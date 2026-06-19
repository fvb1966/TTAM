import { contextBridge } from 'electron'

contextBridge.exposeInMainWorld('ttam', {
  platform: process.platform,
  versions: process.versions,
})
