#!/usr/bin/env bash
set -euo pipefail

OUT_DIR=/artifacts
LOG_DIR=/tmp/ttam_results
mkdir -p "$OUT_DIR" "$LOG_DIR"

echo "Starting TTAM docker smoke test" > "$LOG_DIR/smoke.log"

echo "Running prisma generate" >> "$LOG_DIR/smoke.log" 2>&1 || true
npx prisma generate >> "$LOG_DIR/smoke.log" 2>&1 || true

echo "Building main" >> "$LOG_DIR/smoke.log"
npm run build:main >> "$LOG_DIR/smoke.log" 2>&1 || true

echo "Building renderer" >> "$LOG_DIR/smoke.log"
npm run build >> "$LOG_DIR/smoke.log" 2>&1 || true

echo "Seeding admin user" >> "$LOG_DIR/smoke.log"
node scripts/seed-admin.js ttam_test_admin ttamtest123 >> "$LOG_DIR/smoke.log" 2>&1 || true

echo "Listing .node files" > "$LOG_DIR/node_files.txt"
find . -type f -name '*.node' >> "$LOG_DIR/node_files.txt" || true

echo "Listing argon2 prebuilds" > "$LOG_DIR/argon2_prebuilds.txt"
if [ -d node_modules/argon2 ]; then
  find node_modules/argon2 -maxdepth 4 -type f >> "$LOG_DIR/argon2_prebuilds.txt" || true
fi

if [ -d dist ]; then
  find dist -type f -name '*.node' >> "$LOG_DIR/node_files.txt" || true
fi

if [ -f dist/main.js ]; then
  echo "Running dist/main.js for smoke" >> "$LOG_DIR/smoke.log"
  node dist/main.js >> "$LOG_DIR/smoke_main_output.txt" 2>&1 || true
fi

echo "Collecting DB and config files" >> "$LOG_DIR/smoke.log"
cp -r data "$LOG_DIR/" || true

echo "Packaging results" >> "$LOG_DIR/smoke.log"
tar -czf "$OUT_DIR/ttam_test_results.tar.gz" -C /tmp ttam_results || true

echo "Done. Results: $OUT_DIR/ttam_test_results.tar.gz" >> "$LOG_DIR/smoke.log"
echo "Done. Results: $OUT_DIR/ttam_test_results.tar.gz"
