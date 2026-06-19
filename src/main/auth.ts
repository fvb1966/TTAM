import { prisma } from './prisma'
import argon2 from 'argon2'

type Session = { userId: number; username: string } | null

let currentSession: Session = null

export async function hasAdmin() {
  const count = await prisma.user.count()
  return count > 0
}

export async function createAdmin(username: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { username } })
  if (existing) throw new Error('User exists')
  const hash = await argon2.hash(password)
  const user = await prisma.user.create({ data: { username, passwordHash: hash } })
  return { id: user.id, username: user.username }
}

export async function login(username: string, password: string) {
  const user = await prisma.user.findUnique({ where: { username } })
  if (!user) throw new Error('Invalid credentials')
  const ok = await argon2.verify(user.passwordHash, password)
  if (!ok) throw new Error('Invalid credentials')
  currentSession = { userId: user.id, username: user.username }
  return { id: user.id, username: user.username }
}

export async function me() {
  return currentSession
}

export async function logout() {
  currentSession = null
  return true
}

export async function changePassword(username: string, newPassword: string) {
  const user = await prisma.user.findUnique({ where: { username } })
  if (!user) throw new Error('User not found')
  const hash = await argon2.hash(newPassword)
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: hash } })
  return true
}
