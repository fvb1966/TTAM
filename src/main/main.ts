import { app, BrowserWindow, ipcMain } from 'electron'
import * as path from 'path'
import fs from 'fs'
import archiver from 'archiver'
import { prisma } from './prisma'

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

  ipcMain.handle('db:getPayments', async () => {
    return prisma.payment.findMany({ orderBy: { paidAt: 'desc' }, include: { student: true } })
  })

  ipcMain.handle('db:createPayment', async (_event, payload) => {
    const { studentId, amountCents, currency, description, method } = payload
    return prisma.payment.create({ data: { studentId, amountCents, currency: currency ?? 'ARS', description, method } })
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
    const results: any[] = []
    for (const r of rows) {
      const firstName = r.firstName || r.nombre || ''
      const lastName = r.lastName || r.apellido || ''
      const email = r.email || r.Email || null
      const phone = r.phone || r.telefono || null

      let student = null
      if (email) {
        student = await prisma.student.findUnique({ where: { email } }).catch(() => null)
      }
      if (!student && phone) {
        student = await prisma.student.findFirst({ where: { phone } }).catch(() => null)
      }
      if (!student) {
        student = await prisma.student.create({ data: { firstName: firstName || 'N/A', lastName, email, phone } })
      }

      const registration = await prisma.registration.create({ data: { tournamentId, studentId: student.id } })
      results.push({ studentId: student.id, registrationId: registration.id })
    }
    return { imported: results.length, details: results }
  })

  // Backup: zip data and Docs into Docs/backup/ttam-backup-<timestamp>.zip
  ipcMain.handle('backup:create', async () => {
    const backupDir = path.join(process.cwd(), 'Docs', 'backup')
    await fs.promises.mkdir(backupDir, { recursive: true })
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const outPath = path.join(backupDir, `ttam-backup-${timestamp}.zip`)

    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(outPath)
      const archive = archiver('zip', { zlib: { level: 9 } })

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
  } catch (e) {
    // ignore
  }
})
