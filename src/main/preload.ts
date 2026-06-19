import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('ttam', {
  platform: process.platform,
  versions: process.versions,
  db: {
    getStudents: () => ipcRenderer.invoke('db:getStudents'),
    createStudent: (payload: any) => ipcRenderer.invoke('db:createStudent', payload),
    getPayments: () => ipcRenderer.invoke('db:getPayments'),
    createPayment: (payload: any) => ipcRenderer.invoke('db:createPayment', payload),
  },
})
