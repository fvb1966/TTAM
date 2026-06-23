#!/usr/bin/env bash
set -euo pipefail

# Create an Azure Windows VM, a storage container for results, and run a PowerShell
# provisioning script on the VM that downloads and installs the TTAM installer,
# creates a test admin account and uploads results to the storage container.
#
# Usage:
#   ./azure/create_vm.sh <RESOURCE_GROUP> <VM_NAME> <LOCATION> <ADMIN_USER> <ADMIN_PASSWORD>
# Optional env vars / args:
#   INSTALLER_URL - url of installer (defaults to GitHub release in this repo)
#   TEST_ADMIN - name of test admin to create (default: ttam_test_admin)
#   TEST_ADMIN_PASSWORD - password for test admin (default: ttamtest123)
#   STORAGE_ACCOUNT - optional storage account name (must be globally unique); if omitted a random name will be generated
#
# Requirements: Azure CLI logged in (`az login`) and permission to create resources.

if [ "$#" -lt 5 ]; then
  echo "Usage: $0 <RESOURCE_GROUP> <VM_NAME> <LOCATION> <ADMIN_USER> <ADMIN_PASSWORD>"
  exit 1
fi

RG="$1"
VM_NAME="$2"
LOCATION="$3"
ADMIN_USER="$4"
ADMIN_PASSWORD="$5"

INSTALLER_URL="${INSTALLER_URL:-https://github.com/fvb1966/TTAM/releases/download/installer-ci-27856235897/TTAM%20Setup%200.1.0.exe}"
TEST_ADMIN="${TEST_ADMIN:-ttam_test_admin}"
TEST_ADMIN_PASSWORD="${TEST_ADMIN_PASSWORD:-ttamtest123}"
STORAGE_ACCOUNT="${STORAGE_ACCOUNT:-}"
CONTAINER_NAME="results"

echo "Resource group: $RG"
echo "VM name: $VM_NAME"
echo "Location: $LOCATION"
echo "Installer URL: $INSTALLER_URL"

echo "Checking Azure login..."
if ! az account show >/dev/null 2>&1; then
  echo "You are not logged in. Run 'az login' and try again." >&2
  exit 1
fi

echo "Creating resource group $RG (if needed)"
az group create --name "$RG" --location "$LOCATION" --output none

if [ -z "$STORAGE_ACCOUNT" ]; then
  # generate a reasonably-unique storage account name (lowercase, 3-24 chars)
  RAND=$(LC_ALL=C tr -dc 'a-z0-9' < /dev/urandom | head -c6)
  STORAGE_ACCOUNT="ttamstore${RAND}"
  STORAGE_ACCOUNT=${STORAGE_ACCOUNT:0:24}
fi

echo "Creating storage account $STORAGE_ACCOUNT"
az storage account create --name "$STORAGE_ACCOUNT" --resource-group "$RG" --location "$LOCATION" --sku Standard_LRS --output none

echo "Creating container $CONTAINER_NAME"
az storage container create --account-name "$STORAGE_ACCOUNT" --name "$CONTAINER_NAME" --auth-mode login --output none

echo "Generating container SAS token (24h)"
# compute expiry in UTC 24h ahead
EXPIRY=$(python - <<'PY'
import datetime
print((datetime.datetime.utcnow()+datetime.timedelta(days=1)).strftime('%Y-%m-%dT%H:%MZ'))
PY
)

SAS_TOKEN=$(az storage container generate-sas --account-name "$STORAGE_ACCOUNT" --name "$CONTAINER_NAME" --permissions rwdl --expiry "$EXPIRY" -o tsv)

echo "Creating Windows VM $VM_NAME"
az vm create \
  --resource-group "$RG" \
  --name "$VM_NAME" \
  --image Win2022Datacenter \
  --admin-username "$ADMIN_USER" \
  --admin-password "$ADMIN_PASSWORD" \
  --size Standard_D2s_v3 \
  --public-ip-sku Standard \
  --output json

echo "Opening firewall ports RDP(3389) and WinRM(5985)"
az vm open-port --resource-group "$RG" --name "$VM_NAME" --port 3389 --output none
az vm open-port --resource-group "$RG" --name "$VM_NAME" --port 5985 --output none

echo "Fetching public IP"
IP=$(az vm list-ip-addresses -g "$RG" -n "$VM_NAME" --query "[0].virtualMachine.network.publicIpAddresses[0].ipAddress" -o tsv)
echo "VM public IP: $IP"

echo "Waiting 20s for VM Run Command subsystem to be ready"
sleep 20

echo "Invoking remote provisioning script on VM (this may take several minutes)"
# Run the PowerShell script on the VM using the run-command facility. The script will upload a results zip to the storage container.
RUN_OUT=$(mktemp)
az vm run-command invoke \
  --command-id RunPowerShellScript \
  --name "$VM_NAME" \
  --resource-group "$RG" \
  --scripts @azure/vm_setup.ps1 \
  --parameters installerUrl="$INSTALLER_URL" testAdmin="$TEST_ADMIN" testPassword="$TEST_ADMIN_PASSWORD" storageAccount="$STORAGE_ACCOUNT" containerName="$CONTAINER_NAME" sasToken="$SAS_TOKEN" \
  -o json > "$RUN_OUT"

echo "Run command output written to $RUN_OUT"

echo "Parsing output for upload URL (if any)"
UPLOAD_URL=$(jq -r '.value[0].message' "$RUN_OUT" | tr '\n' ' ' | sed -E 's/.*(UploadUrl:[^ ]+).*/\1/' | sed 's/UploadUrl://' | tr -d '\r') || true

if [ -n "$UPLOAD_URL" ] && [ "$UPLOAD_URL" != "null" ]; then
  echo "Results uploaded to: $UPLOAD_URL"
else
  echo "No upload URL found in run output. Check $RUN_OUT for details and see the VM at $IP to retrieve results manually." >&2
fi

echo "Done. VM created in resource group $RG. To connect via RDP: mstsc /v:$IP"
