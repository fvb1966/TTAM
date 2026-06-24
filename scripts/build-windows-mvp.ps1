<#
Builds a Windows MVP installer for TTAM locally.

Usage (PowerShell as Administrator recommended):
  .\scripts\build-windows-mvp.ps1

Prerequisites:
- Node.js (16+ / tested with 18-22)
- npm
- git (optional)

What the script does:
 - Installs dependencies (`npm ci`)
 - Generates Prisma client (`npm run prisma:generate`)
 - Builds main and renderer (`npm run build:main` and `npm run build`)
 - Runs electron-builder to create a Windows NSIS installer (`npm run dist -- --publish never`)

Notes:
- `package.json` is configured to skip `npmRebuild` so native modules are not rebuilt.
#>

param(
  [switch]$SkipInstall
)

function Ensure-Command($cmd) {
  $p = Get-Command $cmd -ErrorAction SilentlyContinue
  return $null -ne $p
}

Write-Host "Building Windows MVP for TTAM"

if (-not (Ensure-Command node)) {
  Write-Error "Node.js not found. Install Node.js (https://nodejs.org/) and re-run the script."; exit 1
}

if (-not (Ensure-Command npm)) {
  Write-Error "npm not found. Install Node.js which includes npm."; exit 1
}

if (-not $SkipInstall) {
  Write-Host "Installing dependencies (npm ci) - this may take a few minutes"
  try {
    npm ci
  } catch {
    Write-Warning "npm ci failed, trying npm install"
    npm install
  }
}

Write-Host "Generating Prisma client"
try {
  npm run prisma:generate
} catch {
  Write-Warning "Prisma generate failed. If you see schema-related errors, ensure you have a compatible Prisma CLI (devDependency 'prisma' is pinned).";
}

Write-Host "Building main process (esbuild)"
npm run build:main

Write-Host "Building renderer (Vite)"
npm run build

Write-Host "Packaging with electron-builder (NSIS)"
# Ensure we don't attempt to publish during build
npm run dist -- --publish never

Write-Host "Build finished. Look for installer under the 'dist' folder (e.g. TTAM Setup *.exe)"
