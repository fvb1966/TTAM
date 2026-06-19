import { z } from 'zod'
import i18n from './i18n'

export async function importRegistrations(prisma: any, tournamentId: number, rows: any[]) {
  const preprocessTrimEmpty = <T extends z.ZodTypeAny>(schema: T) =>
    z.preprocess((val) => {
      if (typeof val === 'string') {
        const t = val.trim()
        return t === '' ? undefined : t
      }
      return val
    }, schema)

  const OptionalString = preprocessTrimEmpty(z.string().optional())
  const OptionalEmail = preprocessTrimEmpty(z.string().email().optional())

  const rowSchema = z
    .object({
      firstName: OptionalString,
      lastName: OptionalString,
      email: OptionalEmail,
      phone: OptionalString,
    })
    .refine((d) => !!(d.firstName || d.email || d.phone), {
      message: 'Row must contain at least firstName, email or phone',
    })

  const results: Array<{ studentId: number; registrationId: number }> = []
  const errors: Array<{ index: number; row?: any; issues: Array<{ field?: string; fieldLabel?: string; message: string; code?: string; friendly?: string }> }> = []

  for (const [idx, row] of rows.entries()) {
    const parsed = rowSchema.safeParse(row)
    if (!parsed.success) {
      // Convertir issues de Zod a mensajes legibles usando i18n
      const issues = parsed.error.issues.map(i => {
        const field = (i.path && i.path.length > 0) ? String(i.path[0]) : undefined
        const fieldLabel = field ? i18n.t(`fields.${field}`) : '(registro)'
        const message = i.message || 'Error de validación'

        // Friendly Spanish message using i18n keys
        let friendly = ''
        const code = i.code
        const raw = (i.message || '').toString()

        if (code === 'custom' || raw.includes('Row must contain')) {
          friendly = i18n.t('import.error.missingFields')
        } else if (code === 'invalid_type') {
          friendly = i18n.t('import.error.invalidType', { field: fieldLabel })
        } else if (code === 'invalid_string' || raw.toLowerCase().includes('invalid')) {
          if (raw.toLowerCase().includes('email')) friendly = i18n.t('import.error.invalidEmail', { field: fieldLabel })
          else friendly = i18n.t('import.error.invalidValue', { field: fieldLabel })
        } else if (code === 'too_small') {
          friendly = i18n.t('import.error.tooSmall', { field: fieldLabel })
        } else if (code === 'too_big') {
          friendly = i18n.t('import.error.tooBig', { field: fieldLabel })
        } else {
          friendly = message
        }

        return { field, fieldLabel, message, code: i.code, friendly }
      })

      errors.push({ index: idx, row, issues })
      continue
    }

    const { firstName, lastName, email, phone } = parsed.data

    let student: any | null = null
    if (email) {
      try {
        student = await prisma.student.findUnique({ where: { email } })
      } catch (e) {
        student = null
      }
    }
    if (!student && phone) {
      try {
        student = await prisma.student.findFirst({ where: { phone } })
      } catch (e) {
        student = null
      }
    }

    if (!student) {
      const createData: any = { firstName: firstName || 'N/A' }
      if (lastName) createData.lastName = lastName
      if (email) createData.email = email
      if (phone) createData.phone = phone
      student = await prisma.student.create({ data: createData })
    }

    const registration = await prisma.registration.create({ data: { tournamentId, studentId: student.id } })
    results.push({ studentId: student.id, registrationId: registration.id })
  }

  return { imported: results.length, details: results, errors }
}

export default importRegistrations
