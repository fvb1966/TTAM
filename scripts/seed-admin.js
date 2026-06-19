#!/usr/bin/env node
const { PrismaClient } = require('@prisma/client')
const argon2 = require('argon2')

async function run() {
  const prisma = new PrismaClient()
  try {
    const username = process.argv[2] || 'admin'
    const password = process.argv[3] || 'admin123'

    const existing = await prisma.user.findUnique({ where: { username } })
    if (existing) {
      console.log('User already exists:', existing.username)
      await prisma.$disconnect()
      process.exit(0)
    }

    const hash = await argon2.hash(password)
    const user = await prisma.user.create({ data: { username, passwordHash: hash } })
    console.log('Created admin user:', user.username)
    await prisma.$disconnect()
    process.exit(0)
  } catch (err) {
    console.error('Error creating admin:', err)
    try { await prisma.$disconnect() } catch {}
    process.exit(1)
  }
}

run()
