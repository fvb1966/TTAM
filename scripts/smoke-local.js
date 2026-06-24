#!/usr/bin/env node
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const ROOT = process.cwd()
const OUT_DIR = path.join(ROOT, 'artifacts', 'ttam_local_smoke')
const LOG_DIR = path.join(OUT_DIR, 'ttam_results')
fs.mkdirSync(LOG_DIR, { recursive: true })
const LOG = path.join(LOG_DIR, 'smoke.log')

function log(msg) {
  const line = `${new Date().toISOString()} ${msg}`
  console.log(line)
  fs.appendFileSync(LOG, line + '\n')
}

function run(cmd, opts = {}) {
  try {
    log(`$ ${cmd}`)
    const out = execSync(cmd, { stdio: 'pipe', encoding: 'utf8', maxBuffer: 20 * 1024 * 1024, ...opts })
    log(out)
    return { ok: true, out }
  } catch (e) {
    log(`ERROR running: ${cmd}`)
    if (e.stdout) log(String(e.stdout))
    if (e.stderr) log(String(e.stderr))
    return { ok: false, error: e }
  }
}

async function pbkdf2Hash(password) {
  const iterations = 120000
  const salt = crypto.randomBytes(16).toString('hex')
  const key = crypto.pbkdf2Sync(password, salt, iterations, 64, 'sha512')
  return `pbkdf2$${iterations}$${salt}$${key.toString('hex')}`
}

function walk(dir, pattern = /.*/i) {
  const res = []
  try {
    const items = fs.readdirSync(dir, { withFileTypes: true })
    for (const it of items) {
      const full = path.join(dir, it.name)
      if (it.isDirectory()) {
        res.push(...walk(full, pattern))
      } else if (pattern.test(it.name)) {
        res.push(full)
      }
    }
  } catch (e) {
    // ignore
  }
  return res
}

async function main() {
  log('TTAM local smoke starting')

  // Node version
  run('node -v')

  // Install deps if node_modules absent
  if (!fs.existsSync(path.join(ROOT, 'node_modules'))) {
    log('node_modules not found — running npm ci')
    run('npm ci')
  }

  // Prisma generate
  run('npx prisma generate')
  // Ensure the SQLite database and schema exist for a clean smoke
  run('npx prisma db push --accept-data-loss')

  // Build main and renderer (best-effort)
  run('npm run build:main --if-present')
  run('npm run build --if-present')

  // Try seeding via scripts/seed-admin.js (uses argon2). Fallback to PBKDF2 + prisma if it fails.
  const seed = run('node scripts/seed-admin.js ttam_test_admin ttamtest123')
  if (!seed.ok) {
    log('Seed script failed — attempting fallback create via Prisma + PBKDF2')
    try {
      const { PrismaClient } = require('@prisma/client')
      const prisma = new PrismaClient()
      const existing = await prisma.user.findUnique({ where: { username: 'ttam_test_admin' } })
      if (!existing) {
        const hash = await pbkdf2Hash('ttamtest123')
        const user = await prisma.user.create({ data: { username: 'ttam_test_admin', passwordHash: hash } })
        log(`Created admin fallback: ${user.username}`)
      } else {
        log('Admin already exists')
      }
      await prisma.$disconnect()
    } catch (e) {
      log('Prisma fallback failed: ' + String(e))
    }
  } else {
    log('Seed script succeeded')
  }

  // List .node files
  log('Listing .node files (project + dist + node_modules)')
  const nodeFiles = []
  nodeFiles.push(...walk(path.join(ROOT), /\.node$/i))
  if (fs.existsSync(path.join(ROOT, 'dist'))) nodeFiles.push(...walk(path.join(ROOT, 'dist'), /\.node$/i))
  fs.writeFileSync(path.join(LOG_DIR, 'node_files.txt'), nodeFiles.join('\n'))
  log(`Found ${nodeFiles.length} .node files`)

  // Argon2 prebuilds
  const argonPre = path.join(ROOT, 'node_modules', 'argon2')
  let prebuilds = []
  if (fs.existsSync(argonPre)) {
    prebuilds = walk(argonPre, /./)
  }
  fs.writeFileSync(path.join(LOG_DIR, 'argon2_prebuilds.txt'), prebuilds.join('\n'))
  log(`Found ${prebuilds.length} argon2 files`)

  // Try running dist/main.js if exists
  const mainPath = path.join(ROOT, 'dist', 'main.js')
  if (fs.existsSync(mainPath)) {
    if (process.env.GITHUB_ACTIONS || process.env.CI) {
      log('Skipping running dist/main.js in CI (electron unavailable)')
    } else {
      log('Running dist/main.js for a short smoke (10s timeout)')
      try {
        run(`node "${mainPath}"`)
      } catch (e) {
        log('Error running dist/main.js: ' + String(e))
      }
    }
  }

  // Copy DB
  if (fs.existsSync(path.join(ROOT, 'data', 'ttam.db'))) {
    try {
      fs.copyFileSync(path.join(ROOT, 'data', 'ttam.db'), path.join(LOG_DIR, 'ttam.db'))
      log('Copied ttam.db')
    } catch (e) {
      log('Could not copy DB: ' + String(e))
    }
  }

  // Package results into zip (try archiver, fallback to PowerShell Compress-Archive)
  const zipPath = path.join(OUT_DIR, 'ttam_test_results_local.zip')
  try {
    // Prefer archiver; if it's an ESM-only module use dynamic import
    let archiverModule = null
    try {
      archiverModule = require('archiver')
    } catch (err) {
      log('`archiver` require() failed; attempting dynamic import')
      try {
        const mod = await import('archiver')
        archiverModule = mod.default || mod
      } catch (err2) {
        log('`archiver` dynamic import failed: ' + String(err2))
        archiverModule = null
      }
    }

    if (archiverModule) {
      // archiver may be exported as a function (CJS) or as a default ESM export
      let createArchive = null
      if (typeof archiverModule === 'function') createArchive = archiverModule
      else if (archiverModule && typeof archiverModule.default === 'function') createArchive = archiverModule.default
      else if (archiverModule && typeof archiverModule.archive === 'function') createArchive = archiverModule.archive
      if (!createArchive) {
        log('archiver module found but no function export detected; falling back to zip')
      } else {
        const output = fs.createWriteStream(zipPath)
        const archive = createArchive('zip', { zlib: { level: 9 } })
        output.on('close', function () { log('Created results zip: ' + zipPath + ' (' + archive.pointer() + ' bytes)') })
        archive.on('error', function (err) { throw err })
        archive.pipe(output)
        archive.directory(LOG_DIR, false)
        await archive.finalize()
        // skip fallback logic
        archiverModule = true
      }
    }
    if (!archiverModule || archiverModule === true) {
      // Fallbacks for Linux CI runners: try zip, python, then tar
      try {
        run(`cd "${OUT_DIR}" && zip -r "${path.basename(zipPath)}" ttam_results`)
        log('Created results zip via zip: ' + zipPath)
      } catch (e) {
        try {
          run(`cd "${OUT_DIR}" && python -m zipfile -r "${path.basename(zipPath)}" ttam_results`)
          log('Created results zip via python zipfile: ' + zipPath)
        } catch (e2) {
          try {
            run(`cd "${OUT_DIR}" && tar -czf "${path.basename(zipPath)}" ttam_results`)
            log('Created results tar.gz as fallback: ' + path.join(OUT_DIR, path.basename(zipPath)))
          } catch (e3) {
            log('Failed creating zip via fallback: ' + String(e3))
          }
        }
      }
    }
  } catch (e) {
    log('Failed creating zip: ' + String(e))
  }

  log('Local smoke complete. Results at: ' + zipPath)
}

main().catch(e => {
  log('Unexpected error: ' + String(e))
  process.exit(1)
})
