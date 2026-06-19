import { z } from 'zod'

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
      // Convertir issues de Zod a mensajes legibles en español
      const fieldNameMap: Record<string, string> = {
        firstName: 'Nombre',
        lastName: 'Apellido',
        email: 'Email',
        phone: 'Teléfono',
      }

      const issues = parsed.error.issues.map(i => {
        const field = (i.path && i.path.length > 0) ? String(i.path[0]) : undefined
        const fieldLabel = field ? (fieldNameMap[field] ?? field) : '(registro)'
        const message = i.message || 'Error de validación'

        // Friendly Spanish message
        let friendly = ''
        const code = i.code
        const raw = (i.message || '').toString()

        if (code === 'custom' || raw.includes('Row must contain')) {
          friendly = 'El registro debe contener al menos Nombre, Email o Teléfono.'
        } else if (code === 'invalid_type') {
          friendly = `El campo ${fieldLabel} tiene un tipo inválido.`
        } else if (code === 'invalid_string' || raw.toLowerCase().includes('invalid')) {
          if (raw.toLowerCase().includes('email')) friendly = `El campo ${fieldLabel} debe ser un correo electrónico válido.`
          else friendly = `El campo ${fieldLabel} tiene un valor inválido.`
        } else if (code === 'too_small') {
          friendly = `El campo ${fieldLabel} no cumple la longitud mínima.`
        } else if (code === 'too_big') {
          friendly = `El campo ${fieldLabel} excede la longitud máxima.`
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
