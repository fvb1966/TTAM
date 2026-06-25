import * as crypto from 'crypto'

// Minimal fallback exposing `hash` and `verify` to behave similarly to argon2
// for the packaged app. Uses PBKDF2 with high iteration count. This is slower
// but avoids native binary dependency issues for the MVP.

export async function hash(password: string) {
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

export async function verify(stored: string, password: string) {
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

export default { hash, verify }
