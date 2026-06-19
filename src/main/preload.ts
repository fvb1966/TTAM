import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('ttam', {
  platform: process.platform,
  versions: process.versions,
  db: {
    getStudents: () => ipcRenderer.invoke('db:getStudents'),
    createStudent: (payload: any) => ipcRenderer.invoke('db:createStudent', payload),
    getPayments: () => ipcRenderer.invoke('db:getPayments'),
    createPayment: (payload: any) => ipcRenderer.invoke('db:createPayment', payload),
    getTournaments: () => ipcRenderer.invoke('db:getTournaments'),
    createTournament: (payload: any) => ipcRenderer.invoke('db:createTournament', payload),
    importRegistrations: (payload: any) => ipcRenderer.invoke('db:importRegistrations', payload),
  },
  backup: {
    create: () => ipcRenderer.invoke('backup:create'),
  },
})
