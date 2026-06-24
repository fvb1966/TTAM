# Windows local MVP build instructions

This document explains how to build a Windows installer for TTAM locally on a Windows PC without using WSL, Docker, or cloud providers.

Prerequisites
- Install Node.js (recommended LTS or newer): https://nodejs.org/
- Git (optional)
- PowerShell (built-in on Windows 10/11)

Steps
1. Open PowerShell as Administrator and navigate to the project root.
2. (Optional) If you want a clean build, remove `node_modules` and `dist` folders.
3. Run the automated script:

```powershell
.\scripts\build-windows-mvp.ps1
```

What the script does:
- Installs dependencies with `npm ci` (falls back to `npm install` on error)
- Runs `npm run prisma:generate` to create the Prisma client
- Builds the main and renderer bundles
- Runs `electron-builder` to create an NSIS installer under `dist/`

If you prefer to run the steps manually:

```powershell
# install deps
npm ci
# generate prisma client
npm run prisma:generate
# build main
npm run build:main
# build renderer
npm run build
# package
npm run dist -- --publish never
```

Troubleshooting
- If `npm ci` fails due to corporate policies, try `npm install`.
- If `electron-builder` fails trying to rebuild native modules, we set `npmRebuild=false` in `package.json` to avoid rebuilds; ensure your `node_modules` contains suitable prebuilt binaries for your target (most common case: install on the same OS/arch you will package).
- The app contains a runtime fallback to PBKDF2 if `argon2` native bindings are missing, so missing argon2 prebuilds will not crash the app but will fall back to a slower JS-compatible method.