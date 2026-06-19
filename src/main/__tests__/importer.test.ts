import { describe, it, expect } from 'vitest'
import { importRegistrations } from '../importer'
import type { PrismaClient } from '@prisma/client'

type StudentRecord = Record<string, unknown>

describe('importRegistrations', () => {
  it('imports valid rows and creates students/registrations', async () => {
    const students: StudentRecord[] = []
    const registrations: StudentRecord[] = []

    const prismaMock = {
      student: {
        findUnique: async ({ where: { email } }: { where: { email?: string } }) => students.find((s) => s.email === email) || null,
        findFirst: async ({ where: { phone } }: { where: { phone?: string } }) => students.find((s) => s.phone === phone) || null,
        create: async ({ data }: { data: Record<string, unknown> }) => {
          const id = students.length + 1
          const s = { id, ...data }
          students.push(s)
          return s
        }
      },
      registration: {
        create: async ({ data }: { data: Record<string, unknown> }) => {
          const id = registrations.length + 1
          const r = { id, ...data }
          registrations.push(r)
          return r
        }
      }
    }

    const rows = [
      { firstName: 'Juan', lastName: 'Perez', email: 'juan@example.com', phone: '1234' }
    ]

    const res = await importRegistrations(prismaMock as unknown as PrismaClient, 1, rows as unknown as Record<string, unknown>[])

    expect(res.imported).toBe(1)
    expect(res.details[0].studentId).toBe(1)
    expect(students.length).toBe(1)
    expect(registrations.length).toBe(1)
    expect(res.errors.length).toBe(0)
  })

  it('skips invalid rows and reports errors', async () => {
    const prismaMock = {
      student: { findUnique: async () => null, findFirst: async () => null, create: async ({ data }: { data: Record<string, unknown> }) => ({ id: 1, ...data }) },
      registration: { create: async ({ data }: { data: Record<string, unknown> }) => ({ id: 1, ...data }) }
    }

    const rows = [{}, { some: 'value' }]
    const res = await importRegistrations(prismaMock as unknown as PrismaClient, 1, rows as unknown as Record<string, unknown>[])
    expect(res.imported).toBe(0)
    expect(res.errors.length).toBe(2)
  })
})
