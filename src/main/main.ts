import { app, BrowserWindow, ipcMain } from 'electron'
import * as path from 'path'
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
