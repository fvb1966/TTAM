import { prisma } from './prisma'
import argon2 from 'argon2'
import { readConfig, writeConfig } from './config'

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
  const hash = await argon2.hash(password)
  const user = await prisma.user.create({ data: { username, passwordHash: hash } })
  const session = { userId: user.id, username: user.username }
  currentSession = session
  await persistSession(session)
  return { id: user.id, username: user.username }
}

export async function login(username: string, password: string) {
  const user = await prisma.user.findUnique({ where: { username } })
  if (!user) throw new Error('Invalid credentials')
  const ok = await argon2.verify(user.passwordHash, password)
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
  const hash = await argon2.hash(newPassword)
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: hash } })
  return true
}
