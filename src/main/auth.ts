import { prisma } from './prisma'
import * as crypto from 'crypto'
import { readConfig, writeConfig } from './config'

// Try to load native `argon2`. If it fails (packaged app without compatible
// native binary), fall back to a PBKDF2-based JS implementation so the app
// doesn't crash. Note: PBKDF2 hashes are not compatible with Argon2 hashes —
// existing Argon2 password hashes will not verify unless `argon2` is available.
let argon2: any = null
try {
  // use require to avoid module load-time crashes when native bindings are missing
  // vitest/vi.mock should still be able to mock this in tests
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  argon2 = require('argon2')
} catch (e) {
  argon2 = null
}

const pbkdf2Hash = async (password: string) => {
  const iterations = 120000
  const salt = crypto.randomBytes(16).toString('hex')
  const key = await new Promise<Buffer>((resolve, reject) => {
    crypto.pbkdf2(password, salt, iterations, 64, 'sha512', (err, derivedKey) => {
      if (err) reject(err)
      else resolve(derivedKey)
    })
  })
  return `pbkdf2$${iterations}$${salt}$${key.toString('hex')}`
}

const pbkdf2Verify = async (stored: string, password: string) => {
  if (!stored || typeof stored !== 'string') return false
  if (!stored.startsWith('pbkdf2$')) return false
  const parts = stored.split('$')
  if (parts.length !== 4) return false
  const iterations = Number(parts[1])
  const salt = parts[2]
  const expected = parts[3]
  const key = await new Promise<Buffer>((resolve, reject) => {
    crypto.pbkdf2(password, salt, iterations, 64, 'sha512', (err, derivedKey) => {
      if (err) reject(err)
      else resolve(derivedKey)
    })
  })
  return key.toString('hex') === expected
}

const hashPassword = async (password: string) => {
  if (argon2) return await argon2.hash(password)
  return await pbkdf2Hash(password)
}

const verifyPassword = async (storedHash: string, password: string) => {
  if (argon2) {
    try {
      return await argon2.verify(storedHash, password)
    } catch (e) {
      // fall through to other checks
    }
  }
  // If stored hash is PBKDF2 (created by the fallback), verify it.
  if (typeof storedHash === 'string' && storedHash.startsWith('pbkdf2$')) {
    return await pbkdf2Verify(storedHash, password)
  }
  // Cannot verify Argon2 hashes without the native module
  return false
}

type Session = { userId: number; username: string } | null

let currentSession: Session = null

async function persistSession(session: Session) {
  try {
    const cfg = await readConfig()
    const next = { ...(cfg || {}) }
    if (session) {
      ;(next as any).session = { userId: session.userId, username: session.username, createdAt: Date.now() }
    } else {
      delete (next as any).session
    }
    await writeConfig(next)
  } catch {
    // ignore persistence errors
  }
}

export async function hasAdmin() {
  const count = await prisma.user.count()
  return count > 0
}

export async function createAdmin(username: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { username } })
  if (existing) throw new Error('User exists')
  const hash = await hashPassword(password)
  const user = await prisma.user.create({ data: { username, passwordHash: hash } })
  const session = { userId: user.id, username: user.username }
  currentSession = session
  await persistSession(session)
  return { id: user.id, username: user.username }
}

export async function login(username: string, password: string) {
  const user = await prisma.user.findUnique({ where: { username } })
  if (!user) throw new Error('Invalid credentials')
  let ok = false
  try {
    ok = await verifyPassword(user.passwordHash, password)
  } catch (e) {
    ok = false
  }
  if (!ok) throw new Error('Invalid credentials')
  currentSession = { userId: user.id, username: user.username }
  await persistSession(currentSession)
  return { id: user.id, username: user.username }
}

export async function me() {
  if (currentSession) return currentSession
  try {
    const cfg = await readConfig()
    const s = (cfg || ({} as any)).session
    if (s && typeof s === 'object' && (s as any).userId) {
      currentSession = { userId: Number((s as any).userId), username: String((s as any).username) }
      return currentSession
    }
  } catch {
    // ignore
  }
  return null
}

export async function logout() {
  currentSession = null
  await persistSession(null)
  return true
}

export async function changePassword(username: string, newPassword: string) {
  const user = await prisma.user.findUnique({ where: { username } })
  if (!user) throw new Error('User not found')
  const hash = await hashPassword(newPassword)
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: hash } })
  return true
}
