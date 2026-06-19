import { app, BrowserWindow, ipcMain } from 'electron'
import * as path from 'path'
import fs from 'fs'
import { prisma } from './prisma'
import { importRegistrations } from './importer'

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173')
  } else {
    win.loadFile(path.join(__dirname, '..', 'renderer', 'index.html'))
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

  // Backup: zip data and Docs into Docs/backup/ttam-backup-<timestamp>.zip
  ipcMain.handle('backup:create', async () => {
    const archiver = await import('archiver')
    const backupDir = path.join(process.cwd(), 'Docs', 'backup')
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
