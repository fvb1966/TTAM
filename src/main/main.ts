/* eslint-disable @typescript-eslint/no-explicit-any */
import { app, BrowserWindow, ipcMain } from 'electron'
import * as path from 'path'
import fs from 'fs'
import { prisma } from './prisma'
import { importRegistrations } from './importer'
import { readConfig, writeConfig } from './config'
import * as auth from './auth'

function createWindow() {
  const preloadPath = app.isPackaged
    ? path.join(process.resourcesPath, 'app.asar.unpacked', 'dist', 'preload.js')
    : path.join(__dirname, 'preload.js')

  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: preloadPath
    }
  })

  // In development we use Vite dev server. In production there are a few
  // possible locations for the built `index.html` depending on Vite's output
  // layout. Try common locations and pick the first that exists so the app
  // works regardless of whether the renderer was emitted to
  // `dist/renderer/index.html` or `dist/renderer/src/renderer/index.html`.
  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173')
  } else {
    const candidates = [
      path.join(__dirname, 'renderer', 'index.html'),
      path.join(__dirname, 'renderer', 'src', 'renderer', 'index.html'),
      path.join(__dirname, 'renderer', 'src', 'index.html'),
      path.join(__dirname, '..', 'renderer', 'src', 'renderer', 'index.html')
    ]
    let found: string | null = null
    for (const c of candidates) {
      try {
        if (fs.existsSync(c)) {
          found = c
          break
        }
      } catch {
        // ignore
      }
    }
    if (found) {
      win.loadFile(found)
    } else {
      // fallback: attempt to load packaged renderer root or show a diagnostic
      try {
        win.loadFile(path.join(__dirname, '..', 'renderer', 'index.html'))
      } catch (err) {
        console.error('Could not locate renderer index.html. Candidates:', candidates, err)
        win.loadURL('about:blank')
      }
    }
  }

  // Allow opening DevTools when debugging the packaged app by setting
  // environment variable TTAM_DEBUG=1
  if (process.env.TTAM_DEBUG === '1') {
    win.webContents.openDevTools({ mode: 'detach' })
  }
}

app.whenReady().then(() => {
  // IPC handlers for renderer to interact with the database via Prisma
  ipcMain.handle('db:getStudents', async () => {
    return prisma.student.findMany({ orderBy: { createdAt: 'desc' } })
  })

  ipcMain.handle('db:createStudent', async (_event, payload) => {
    const { firstName, lastName, email, phone } = payload
    return prisma.student.create({ data: { firstName, lastName, email, phone } })
  })
  ipcMain.handle('db:updateStudent', async (_event, payload) => {
    const { id, firstName, lastName, email, phone, active } = payload || {}
    return prisma.student.update({ where: { id }, data: { firstName, lastName, email, phone, active } })
  })
  ipcMain.handle('db:deleteStudent', async (_event, id) => {
    return prisma.student.delete({ where: { id } })
  })

  ipcMain.handle('db:getPayments', async () => {
    return prisma.payment.findMany({ orderBy: { paidAt: 'desc' }, include: { student: true } })
  })

  ipcMain.handle('db:createPayment', async (_event, payload) => {
    const { studentId, amountCents, currency, description, method } = payload
    return prisma.payment.create({ data: { studentId, amountCents, currency: currency ?? 'ARS', description, method } })
  })

  ipcMain.handle('db:updatePayment', async (_event, payload) => {
    const { id, amountCents, currency, description, method, paidAt } = payload || {}
    const data: Record<string, unknown> = {}
    if (amountCents !== undefined) data.amountCents = amountCents
    if (currency !== undefined) data.currency = currency
    if (description !== undefined) data.description = description
    if (method !== undefined) data.method = method
    if (paidAt !== undefined) data.paidAt = new Date(paidAt)
    return prisma.payment.update({ where: { id }, data })
  })

  ipcMain.handle('db:deletePayment', async (_event, id) => {
    return prisma.payment.delete({ where: { id } })
  })

  // Tournaments
  ipcMain.handle('db:getTournaments', async () => {
    return prisma.tournament.findMany({ orderBy: { createdAt: 'desc' } })
  })

  ipcMain.handle('db:createTournament', async (_event, payload) => {
    return prisma.tournament.create({ data: payload })
  })

  // CSV import: rows is an array of objects with firstName,lastName,email,phone
  ipcMain.handle('db:importRegistrations', async (_event, payload) => {
    const { tournamentId, rows } = payload
    return importRegistrations(prisma, tournamentId, rows)
  })

  // Registrations: list/create/delete for manual management
  ipcMain.handle('db:getRegistrations', async (_event, tournamentId?: number) => {
    if (typeof tournamentId === 'number') {
      return prisma.registration.findMany({ where: { tournamentId }, include: { student: true }, orderBy: { createdAt: 'desc' } })
    }
    return prisma.registration.findMany({ include: { student: true, tournament: true }, orderBy: { createdAt: 'desc' } })
  })

  ipcMain.handle('db:createRegistration', async (_event, payload) => {
    const { tournamentId, studentId } = payload || {}
    return prisma.registration.create({ data: { tournamentId, studentId } })
  })

  ipcMain.handle('db:deleteRegistration', async (_event, id) => {
    return prisma.registration.delete({ where: { id } })
  })

  // Authentication handlers (single-admin)
  ipcMain.handle('auth:hasAdmin', async () => {
    try {
      return await auth.hasAdmin()
    } catch {
      return false
    }
  })

  ipcMain.handle('auth:createAdmin', async (_event, payload) => {
    const { username, password } = payload || {}
    return auth.createAdmin(username, password)
  })

  ipcMain.handle('auth:login', async (_event, payload) => {
    const { username, password } = payload || {}
    return auth.login(username, password)
  })

  ipcMain.handle('auth:me', async () => {
    return auth.me()
  })

  ipcMain.handle('auth:logout', async () => {
    return auth.logout()
  })

  // Locale handlers to sync i18n between renderer and main
  ipcMain.handle('app:setLocale', async (_event, locale: string) => {
    try {
      // change main i18n language and persist to config
      const mainI18n = await import('./i18n')
      await mainI18n.default.changeLanguage(locale)
      try {
        const cfg = await import('./config')
        await cfg.setLocaleInConfig(locale)
      } catch {
        // ignore config write errors
      }
      return mainI18n.default.language
    } catch {
      return null
    }
  })

  ipcMain.handle('app:getLocale', async () => {
    try {
      // prefer stored config locale
      try {
        const cfg = await import('./config')
        const stored = await cfg.getLocaleFromConfig()
        if (stored) return stored
      } catch {
        // ignore
      }
      const mainI18n = await import('./i18n')
      return mainI18n.default.language
    } catch {
      return 'es'
    }
  })

  // Settings: read/write config and expose useful paths
  ipcMain.handle('app:getSettings', async () => {
    try {
      const cfg = await readConfig()
      return cfg
    } catch {
      return {}
    }
  })

  ipcMain.handle('app:setSettings', async (_event, payload) => {
    try {
      const current = await readConfig()
      const next = { ...(current || {}), ...(payload || {}) }
      // If the user explicitly disables persistent auth, remove stored session
      try {
        if (payload && Object.prototype.hasOwnProperty.call(payload, 'authRemember') && payload.authRemember === false) {
          delete (next as any).session
        }
      } catch {
        // ignore
      }
      await writeConfig(next)
      return next
    } catch {
      return null
    }
  })

  ipcMain.handle('app:getPaths', async () => {
    try {
      const cfg = await readConfig()
      const dbPath = path.join(process.cwd(), 'data', 'ttam.db')
      const backupDir = cfg && cfg.backupDir ? path.resolve(String(cfg.backupDir)) : path.join(process.cwd(), 'Docs', 'backup')
      return { dbPath, backupDir }
    } catch {
      return { dbPath: path.join(process.cwd(), 'data', 'ttam.db'), backupDir: path.join(process.cwd(), 'Docs', 'backup') }
    }
  })

  // Backup: zip data and Docs into Docs/backup/ttam-backup-<timestamp>.zip
  ipcMain.handle('backup:create', async () => {
    const archiver = await import('archiver')
    // allow override via config.backupDir
    const cfg = await readConfig()
    const backupDir = cfg && cfg.backupDir ? path.resolve(String(cfg.backupDir)) : path.join(process.cwd(), 'Docs', 'backup')
    await fs.promises.mkdir(backupDir, { recursive: true })
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const outPath = path.join(backupDir, `ttam-backup-${timestamp}.zip`)

    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(outPath)
      const archive = archiver.default ? archiver.default('zip', { zlib: { level: 9 } }) : archiver('zip', { zlib: { level: 9 } })

      output.on('close', () => resolve(outPath))
      archive.on('error', err => reject(err))

      archive.pipe(output)
      const dbPath = path.join(process.cwd(), 'data', 'ttam.db')
      if (fs.existsSync(dbPath)) archive.file(dbPath, { name: 'data/ttam.db' })
      const docsPath = path.join(process.cwd(), 'Docs')
      if (fs.existsSync(docsPath)) archive.directory(docsPath, 'Docs')
      archive.finalize()
    })

    // List available backup zip files in backupDir
    ipcMain.handle('backup:list', async () => {
      try {
        const cfg = await readConfig()
        const backupDir = cfg && cfg.backupDir ? path.resolve(String(cfg.backupDir)) : path.join(process.cwd(), 'Docs', 'backup')
        if (!fs.existsSync(backupDir)) return []
        const files = await fs.promises.readdir(backupDir)
        const zipFiles = files.filter(f => f.toLowerCase().endsWith('.zip'))
        const stats = await Promise.all(zipFiles.map(async f => {
          const p = path.join(backupDir, f)
          const s = await fs.promises.stat(p)
          return { name: f, path: p, mtime: s.mtime.getTime() }
        }))
        stats.sort((a, b) => b.mtime - a.mtime)
        return stats
      } catch {
        return []
      }
    })

    // Restore a backup zip: safely backup current DB, extract zip and replace data/ and Docs/
    ipcMain.handle('backup:restore', async (_event, zipPath?: string) => {
      try {
        if (!zipPath || typeof zipPath !== 'string') throw new Error('zipPath required')
        if (!fs.existsSync(zipPath)) throw new Error('Backup not found')

        const unzipper = await import('unzipper')
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
        const tmpDir = path.join(process.cwd(), 'tmp', `restore-${timestamp}`)
        await fs.promises.mkdir(tmpDir, { recursive: true })

        const directory = await (unzipper as any).Open.file(zipPath)
        await directory.extract({ path: tmpDir })

        const extractedDb = path.join(tmpDir, 'data', 'ttam.db')
        const extractedDocs = path.join(tmpDir, 'Docs')
        const dbPath = path.join(process.cwd(), 'data', 'ttam.db')

        const cfg = await readConfig()
        const backupDir = cfg && cfg.backupDir ? path.resolve(String(cfg.backupDir)) : path.join(process.cwd(), 'Docs', 'backup')
        await fs.promises.mkdir(backupDir, { recursive: true })
        const preRestore = path.join(backupDir, `ttam-pre-restore-${timestamp}.db`)

        if (fs.existsSync(dbPath)) {
          await fs.promises.copyFile(dbPath, preRestore)
        }

        // Disconnect prisma, replace files, reconnect
        try { await prisma.$disconnect() } catch { /* ignore disconnect errors */ }

        if (fs.existsSync(extractedDb)) {
          await fs.promises.copyFile(extractedDb, dbPath)
        }

        if (fs.existsSync(extractedDocs)) {
          // remove existing Docs and copy extracted Docs
          await fs.promises.rm(path.join(process.cwd(), 'Docs'), { recursive: true, force: true })
          // prefer native fs.promises.cp when available
          if ((fs as any).promises && (fs as any).promises.cp) {
            await (fs as any).promises.cp(extractedDocs, path.join(process.cwd(), 'Docs'), { recursive: true })
          } else {
            const copyRecursive = async (src: string, dest: string) => {
              await fs.promises.mkdir(dest, { recursive: true })
              const items = await fs.promises.readdir(src, { withFileTypes: true })
              for (const item of items) {
                const srcP = path.join(src, item.name)
                const destP = path.join(dest, item.name)
                if (item.isDirectory()) {
                  await copyRecursive(srcP, destP)
                } else {
                  await fs.promises.copyFile(srcP, destP)
                }
              }
            }
            await copyRecursive(extractedDocs, path.join(process.cwd(), 'Docs'))
          }
        }

        try { await prisma.$connect() } catch { /* ignore connect errors */ }

        // cleanup
        await fs.promises.rm(tmpDir, { recursive: true, force: true })

        return { restored: true, preRestoreBackup: preRestore }
      } catch (err) {
        return { restored: false, error: String(err) }
      }
    })
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('before-quit', async () => {
  try {
    await prisma.$disconnect()
  } catch {
    // ignore
  }
})
