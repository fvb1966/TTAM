import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('ttam', {
  platform: process.platform,
  versions: process.versions,
  db: {
    getStudents: () => ipcRenderer.invoke('db:getStudents'),
    createStudent: (payload: unknown) => ipcRenderer.invoke('db:createStudent', payload as Record<string, unknown>),
    updateStudent: (payload: unknown) => ipcRenderer.invoke('db:updateStudent', payload as Record<string, unknown>),
    deleteStudent: (id: number) => ipcRenderer.invoke('db:deleteStudent', id),
    getPayments: () => ipcRenderer.invoke('db:getPayments'),
    createPayment: (payload: unknown) => ipcRenderer.invoke('db:createPayment', payload as Record<string, unknown>),
    getTournaments: () => ipcRenderer.invoke('db:getTournaments'),
    createTournament: (payload: unknown) => ipcRenderer.invoke('db:createTournament', payload as Record<string, unknown>),
    importRegistrations: (payload: unknown) => ipcRenderer.invoke('db:importRegistrations', payload as Record<string, unknown>),
    // Registrations (manual)
    getRegistrations: (tournamentId?: number) => ipcRenderer.invoke('db:getRegistrations', tournamentId),
    createRegistration: (payload: unknown) => ipcRenderer.invoke('db:createRegistration', payload as Record<string, unknown>),
    deleteRegistration: (id: number) => ipcRenderer.invoke('db:deleteRegistration', id),
  },
  backup: {
    create: () => ipcRenderer.invoke('backup:create'),
  },
  // Locale management
  setLocale: (locale: string) => ipcRenderer.invoke('app:setLocale', locale),
  getLocale: () => ipcRenderer.invoke('app:getLocale'),
})
