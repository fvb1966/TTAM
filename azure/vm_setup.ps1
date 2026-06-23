param(
  [string]$installerUrl,
  [string]$testAdmin = "ttam_test_admin",
  [string]$testPassword = "ttamtest123",
  [string]$storageAccount,
  [string]$containerName,
  [string]$sasToken
)

Write-Host "VM Setup started"
Write-Host "Installer URL: $installerUrl"

$dlPath = "C:\Users\Public\Downloads\TTAM Setup 0.1.0.exe"
$logDir = "C:\Users\Public\Downloads\TTAM_Test_Results"
New-Item -Path $logDir -ItemType Directory -Force | Out-Null

Write-Host "Downloading installer to $dlPath"
Invoke-WebRequest -Uri $installerUrl -OutFile $dlPath -UseBasicParsing

Write-Host "Creating test admin $testAdmin"
try {
  if (-not (Get-LocalUser -Name $testAdmin -ErrorAction SilentlyContinue)) {
    $sec = ConvertTo-SecureString $testPassword -AsPlainText -Force
    New-LocalUser -Name $testAdmin -Password $sec -FullName "TTAM Test Admin" -Description "Temporary admin for TTAM test" -ErrorAction Stop
    Add-LocalGroupMember -Group 'Administrators' -Member $testAdmin -ErrorAction Stop
  } else {
    "EXISTS" | Out-File (Join-Path $logDir 'created_admin.txt')
  }
} catch {
  Write-Host "Failed to create local user: $_"
}

Write-Host "Running silent installer"
$proc = Start-Process -FilePath $dlPath -ArgumentList '/S' -PassThru -Wait
"InstallExitCode:$($proc.ExitCode)" | Out-File (Join-Path $logDir 'install.log')

Write-Host "Searching for installed TTAM exe"
$exe = Get-ChildItem -Path 'C:\Program Files','C:\Program Files (x86)',$env:LOCALAPPDATA -Recurse -Filter 'TTAM.exe' -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName
if ($exe) { "EXE:$exe" | Out-File (Join-Path $logDir 'install.log') -Append; $exeDir = Split-Path $exe -Parent }

if ($exeDir) {
  $asarUnpacked = Join-Path $exeDir 'resources\app.asar.unpacked'
  Get-ChildItem -Path $asarUnpacked -Recurse -Filter '*.node' -ErrorAction SilentlyContinue | Select-Object FullName | Out-File (Join-Path $logDir 'node_files.txt')
  $pre = Join-Path $asarUnpacked 'node_modules\argon2\prebuilds'
  if (Test-Path $pre) { Get-ChildItem -Path $pre -Recurse -ErrorAction SilentlyContinue | Select-Object FullName | Out-File (Join-Path $logDir 'argon2_prebuilds.txt') }
}

Write-Host "Collecting app logs"
Get-ChildItem -Path "$env:LOCALAPPDATA\TTAM","$env:APPDATA\TTAM" -Recurse -ErrorAction SilentlyContinue | Select-Object FullName | Out-File (Join-Path $logDir 'app_logs_listing.txt')

Write-Host "Packing results"
$zip = Join-Path $logDir 'ttam_test_results.zip'
if (Test-Path $zip) { Remove-Item $zip -Force }
Compress-Archive -Path (Join-Path $logDir '*') -DestinationPath $zip -Force

if ($storageAccount -and $containerName -and $sasToken) {
  $dest = "https://$storageAccount.blob.core.windows.net/$containerName/ttam_test_results_$((Get-Date).ToString('yyyyMMddHHmmss')).zip$($sasToken)"
  Write-Host "Uploading results to $dest"
  # perform upload via Invoke-WebRequest
  Invoke-WebRequest -Uri $dest -Method Put -InFile $zip -Headers @{ 'x-ms-blob-type' = 'BlockBlob' } -UseBasicParsing
  Write-Host "UploadUrl:$dest"
} else {
  Write-Host "No storage account info provided; results are at $zip"
}

Write-Host "VM setup complete"
