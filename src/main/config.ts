import * as path from 'path'
import fs from 'fs'
import { app } from 'electron'

const CONFIG_FILENAME = 'config.json'

export async function getConfigPath(): Promise<string> {
  const userData = app.getPath('userData')
  return path.join(userData, CONFIG_FILENAME)
}

export async function readConfig(): Promise<Record<string, unknown>> {
  try {
    const p = await getConfigPath()
    const raw = await fs.promises.readFile(p, 'utf-8')
    return JSON.parse(raw) as Record<string, unknown>
  } catch {
    return {}
  }
}

export async function writeConfig(cfg: Record<string, unknown>): Promise<void> {
  const p = await getConfigPath()
  await fs.promises.mkdir(path.dirname(p), { recursive: true })
  await fs.promises.writeFile(p, JSON.stringify(cfg, null, 2), 'utf-8')
}

export async function getLocaleFromConfig(): Promise<string | null> {
  const cfg = await readConfig()
  const val = cfg.locale
  if (typeof val === 'string') return val
  return null
}

export async function setLocaleInConfig(locale: string): Promise<void> {
  const cfg = await readConfig()
  const newCfg = { ...cfg, locale }
  await writeConfig(newCfg)
}

export default { getConfigPath, readConfig, writeConfig, getLocaleFromConfig, setLocaleInConfig }
