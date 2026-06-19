import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('ttam', {
  platform: process.platform,
  versions: process.versions,
  db: {
    getStudents: () => ipcRenderer.invoke('db:getStudents'),
    createStudent: (payload: unknown) => ipcRenderer.invoke('db:createStudent', payload as Record<string, unknown>),
    getPayments: () => ipcRenderer.invoke('db:getPayments'),
    createPayment: (payload: unknown) => ipcRenderer.invoke('db:createPayment', payload as Record<string, unknown>),
    getTournaments: () => ipcRenderer.invoke('db:getTournaments'),
    createTournament: (payload: unknown) => ipcRenderer.invoke('db:createTournament', payload as Record<string, unknown>),
    importRegistrations: (payload: unknown) => ipcRenderer.invoke('db:importRegistrations', payload as Record<string, unknown>),
  },
  backup: {
    create: () => ipcRenderer.invoke('backup:create'),
  },
  // Locale management
  setLocale: (locale: string) => ipcRenderer.invoke('app:setLocale', locale),
  getLocale: () => ipcRenderer.invoke('app:getLocale'),
})
