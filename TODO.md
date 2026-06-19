# TODO - TTAM (Table Tennis Academy Manager)

Proyecto: TTAM
Ubicación: E:\IA\APPs\Tenis de Mesa APP
Idioma: Español
Moneda por defecto: $ Argentino (ARS)
Base de datos local sugerida: `data/ttam.db` (SQLite)
Backups: habilitados (directorio `Docs/backup`) — conservar versión comprimida

Resumen rápido:
- Seguir estrictamente `Docs/06_PROJECT_BOOTSTRAP_PROMPT.md` (roles, stack, fases y reglas).
- Prioridad documental: MASTER_SPEC > DATABASE_SPEC > UI_UX_SPEC > DEVELOPMENT_RULES > AI_IMPLEMENTATION_GUIDE.
- Stack aprobado: Electron, React + TypeScript, Vite, Tailwind, shadcn/ui, SQLite + Prisma, React Hook Form, Zod, Zustand, TanStack Table, jsPDF, xlsx.
- Tests: `vitest`.

## Estado actual (2026-06-18)

- Fase 0 — Foundation: scaffold, Vite/Electron/TypeScript, estructura y `data/ttam.db` — COMPLETADO.
- ESLint / Prettier: archivos de configuración añadidos (`.eslintrc.cjs`, `.prettierrc`, `.eslintignore`, `.prettierignore`) y scripts `lint`, `lint:fix`, `format` en `package.json` — CONFIGURADO (hay advertencias/errores de lint pendientes de corrección).
- Vitest: tests unitarios presentes y ejecutados (importer tests pasan) — OK.
- i18n: preferencia de idioma persistida en `localStorage` y sincronizada con `app.getPath('userData')/config.json` — IMPLEMENTADO.


Acciones iniciales (alto nivel):
1. Fase 0 — Foundation
   - Inicializar repositorio, estructura de carpetas y configuración base (Vite + Electron + TypeScript).
   - Crear `data/` y archivo de base de datos `ttam.db` (vacío/seed neutral).
   - Configurar `eslint`/`prettier` y `vitest` básico.

2. Fase 1 — Authentication
   - Especificar modelo de usuarios y login (single administrator).
   - Flujo de login local y almacenamiento seguro de credenciales (hashed).

3. Fase 2 — Settings
   - Implementar pantalla de ajustes: idioma, moneda, rutas (DB, backups), métodos de pago configurables.

4. Fase 3 — Academy Module
   - CRUD Academias y gestión de estudiantes.

5. Fase 4 — Payments Module
   - Registro manual de pagos (MVP) y administración de métodos de pago configurables.

6. Fase 5 — Tournament Core
   - Modelos de torneo, participantes (único global), inscripciones y reglas inmutables.

7. Fase 6 — Tournament Operations
   - Gestión de grupos, matches, resultados y control total por administrador (sin automatismos).

8. Fase 7 — Reports
   - Reportes básicos exportables a PDF/XLSX usando `jsPDF` y `xlsx`.

9. Fase 8 — Backups
   - Implementar copias locales automatizadas en `Docs/backup` (comprimir por fecha).

10. Fase 9 — Licensing
   - Tarea: definir esquema `machine_hash` + `license_key` (pendiente de especificación).

11. Fase 10 — Packaging
   - Preparar `electron-builder` y generador de instalador `TTAM_Setup.exe` (firma pendiente).

Secuencia de implementación por feature (obligatorio para cada feature):
- 1) Modelo de BD (Prisma)
- 2) Prisma Migration
- 3) Service Layer
- 4) Validation Schema (Zod)
- 5) UI Components
- 6) Page Integration
- 7) Tests (Vitest)

Tareas pendientes y notas importantes:
- Leer y analizar: `Docs/01_MASTER_SPEC.md` → `Docs/05_AI_IMPLEMENTATION_GUIDE.md` (siguiente paso).
- Definir esquema de licencias (`machine_hash` y `license_key`) — tarea creada.
- CSV de ejemplo para importación: `Docs/backup/Formulario de Inscripción al Torneo de Tenis de Mesa 2026` (localizar y validar esquema).
- Configurar `electron-builder` (firma de código queda pendiente hasta contar con certificado).
- Mantener todo 100% local: no usar servicios cloud ni Docker.

Commit inicial: este archivo será committeado en Git como paso inicial.

Contacto/owner: Project TTAM (administrador único)
