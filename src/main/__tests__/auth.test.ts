import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../prisma', () => {
  const findUnique = vi.fn()
  const create = vi.fn()
  const count = vi.fn()
  const update = vi.fn()
  return { prisma: { user: { findUnique, create, count, update } } }
})

vi.mock('argon2', () => ({ default: { hash: vi.fn(async (p) => `hashed-${p}`), verify: vi.fn(async (h, p) => h === `hashed-${p}`) } }))

vi.mock('../config', () => ({ readConfig: vi.fn(async () => ({})), writeConfig: vi.fn(async () => {}) }))

import * as auth from '../auth'
import { prisma } from '../prisma'
import argon2 from 'argon2'

beforeEach(() => {
  prisma.user.findUnique.mockReset()
  prisma.user.create.mockReset()
  prisma.user.count.mockReset()
  prisma.user.update.mockReset()
  ;(argon2 as any).hash.mockClear()
  ;(argon2 as any).verify.mockClear()
})

describe('auth', () => {
  it('createAdmin creates new user when none exists', async () => {
    prisma.user.findUnique.mockResolvedValue(null)
    prisma.user.create.mockResolvedValue({ id: 1, username: 'admin' })

    const res = await auth.createAdmin('admin', 'pass')
    expect(res.username).toBe('admin')
    expect(prisma.user.create).toHaveBeenCalledWith({ data: { username: 'admin', passwordHash: expect.any(String) } })
  })

  it('login succeeds with correct password', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 1, username: 'admin', passwordHash: 'hashed-pass' })
    ;(argon2 as any).verify.mockResolvedValue(true)
    const user = await auth.login('admin', 'pass')
    expect(user).toEqual({ id: 1, username: 'admin' })
    const me = await auth.me()
    expect(me).toEqual({ userId: 1, username: 'admin' })
  })

  it('login fails with wrong password', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 2, username: 'bad', passwordHash: 'hashed-other' })
    ;(argon2 as any).verify.mockResolvedValue(false)
    await expect(auth.login('bad', 'wrong')).rejects.toThrow('Invalid credentials')
  })
})
