# Azure VM provisioning for TTAM testing

This folder contains scripts to create a Windows VM in Azure, run a provisioning
PowerShell script that downloads the TTAM installer, installs it silently, creates
a test admin user, collects logs and uploads the results to an Azure Storage
container.

Prerequisites:
- Azure CLI installed and logged in (`az login`)
- Sufficient permissions to create resource groups, VMs and storage accounts

Quick start:

1. From a shell, run:

```bash
./azure/create_vm.sh my-rg ttam-vm eastus azureadmin 'YourP@ssw0rd!'
```

2. Wait for the script to complete. It will print the VM public IP and a link
   where the results were uploaded (if upload succeeded).

Notes:
- The script creates an Azure Storage account and container to collect the
  results and uploads a ZIP with logs and listings from the VM. The storage
  account name must be globally unique; the script will generate a name if not
  provided.
