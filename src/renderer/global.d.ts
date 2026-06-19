export {}

declare global {
  interface Window {
    ttam: {
      platform: NodeJS.Platform
      versions: NodeJS.ProcessVersions
      db: {
        getStudents: () => Promise<Record<string, unknown>[]>
        createStudent: (payload: { firstName: string; lastName?: string; email?: string; phone?: string }) => Promise<Record<string, unknown>>
        getPayments: () => Promise<Record<string, unknown>[]>
        createPayment: (payload: { studentId: number; amountCents: number; currency?: string; description?: string; method?: string }) => Promise<Record<string, unknown>>
        getTournaments: () => Promise<Record<string, unknown>[]>
        createTournament: (payload: Record<string, unknown>) => Promise<Record<string, unknown>>
        importRegistrations: (payload: { tournamentId: number; rows: Record<string, string>[] }) => Promise<Record<string, unknown>>
      }
      backup: { create: () => Promise<string> }
      setLocale: (locale: string) => Promise<string | null>
      getLocale: () => Promise<string>
    }
  }
}
