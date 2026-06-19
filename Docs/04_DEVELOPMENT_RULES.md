04_DEVELOPMENT_RULES.md
VERSION: 1.0
STATUS: APPROVED
PROJECT: TABLE TENNIS ACADEMY MANAGER
________________________________________
1. PURPOSE
This document defines the mandatory technical development rules for the project.
Its purpose is to:
•	Standardize development.
•	Guide AI agents.
•	Reduce technical debt.
•	Ensure maintainability.
•	Preserve architectural consistency.
This document is mandatory.
________________________________________
2. SUPPORTED PLATFORMS
Primary Platform:
•	Windows 10+
•	Windows 11
Secondary Platform:
•	macOS 13+
Requirement:
All code must remain cross-platform compatible.
________________________________________
3. APPROVED TECHNOLOGY STACK
Desktop Framework
Electron
________________________________________
Frontend
React
TypeScript
Vite
________________________________________
Styling
Tailwind CSS
shadcn/ui
________________________________________
Database
SQLite
________________________________________
ORM
Prisma
________________________________________
Forms
React Hook Form
________________________________________
Validation
Zod
________________________________________
State Management
Zustand
________________________________________
Data Tables
TanStack Table
________________________________________
PDF Generation
jsPDF
________________________________________
Excel Export
xlsx
________________________________________
4. FORBIDDEN TECHNOLOGIES
The following technologies are prohibited:
•	Firebase
•	Supabase
•	MongoDB
•	MySQL
•	PostgreSQL
•	AWS
•	Azure
•	Google Cloud
•	Cloud Storage Services
•	SaaS Dependencies
•	Online Authentication Services
No exceptions without explicit approval.
________________________________________
5. PROJECT STRUCTURE
Mandatory structure:
project-root/

docs/

src/

components/

modules/

academy/

payments/

tournaments/

reports/

backups/

security/

settings/

database/

services/

hooks/

stores/

types/

utils/

pages/

prisma/

public/

build/
No alternative structure is allowed.
________________________________________
6. MODULE PRINCIPLE
Each business module must remain isolated.
Example:
academy
payments
tournaments
reports
Modules must communicate through services.
Direct coupling is prohibited.
________________________________________
7. NAMING CONVENTIONS
Components
PascalCase
Example:
StudentForm
TournamentList
PaymentTable
________________________________________
Files
PascalCase for React components.
camelCase for utility files.
________________________________________
Variables
camelCase
Example:
studentName
paymentAmount
________________________________________
Constants
UPPER_CASE
Example:
DEFAULT_TABLE_COUNT
________________________________________
8. TYPESCRIPT RULES
Use strict mode.
Mandatory:
strict: true
________________________________________
Avoid:
any
________________________________________
Prefer:
interfaces
types
________________________________________
All business entities must be strongly typed.
________________________________________
9. REACT RULES
Use:
Functional Components only.
________________________________________
Prohibited:
Class Components.
________________________________________
Use:
Custom Hooks.
________________________________________
Business logic must not live inside UI components.
________________________________________
10. STATE MANAGEMENT RULES
Use Zustand.
________________________________________
Global state only for:
•	Authentication
•	Application Settings
•	Global UI State
________________________________________
Do not store database records globally unless necessary.
________________________________________
11. FORM RULES
Use React Hook Form.
Mandatory.
________________________________________
Every form must:
•	Validate before submission.
•	Display validation errors.
•	Prevent invalid persistence.
________________________________________
12. VALIDATION RULES
Use Zod.
Mandatory.
________________________________________
Each form shall have:
Form
+
Zod Schema
________________________________________
Validation logic must not be duplicated.
________________________________________
13. DATABASE RULES
Use SQLite.
Mandatory.
________________________________________
No remote database.
________________________________________
No synchronization service.
________________________________________
Database file must remain local.
________________________________________
14. PRISMA RULES
Use Prisma ORM.
Mandatory.
________________________________________
Model Naming:
PascalCase
Example:
Student
Tournament
Registration
________________________________________
Field Naming:
camelCase
Example:
firstName
paymentDate
________________________________________
15. SERVICE LAYER RULES
All database operations must pass through services.
Example:
StudentService
PaymentService
TournamentService
________________________________________
UI components must never directly access Prisma.
________________________________________
16. COMPONENT RULES
Components must be:
•	Small
•	Reusable
•	Focused
________________________________________
Avoid:
Massive components.
________________________________________
Maximum recommendation:
300 lines per component.
________________________________________
17. TABLE RULES
Use TanStack Table.
Mandatory.
________________________________________
Features:
•	Sorting
•	Filtering
•	Pagination
________________________________________
Reusable table component preferred.
________________________________________
18. PDF RULES
Use jsPDF.
Mandatory.
________________________________________
Supported Reports:
•	Student Reports
•	Payment Reports
•	Tournament Reports
•	Final Standings
________________________________________
19. EXCEL RULES
Use xlsx.
Mandatory.
________________________________________
Supported Exports:
•	Students
•	Payments
•	Participants
•	Match Results
________________________________________
20. ERROR HANDLING RULES
All errors must:
•	Be logged.
•	Be user friendly.
________________________________________
Avoid:
Technical messages.
________________________________________
Bad:
SQLITE_ERROR
________________________________________
Good:
Student could not be saved.
________________________________________
21. LOGGING RULES
Log:
•	Database errors
•	Import errors
•	Backup errors
•	License errors
________________________________________
Logs must remain local.
________________________________________
22. SECURITY RULES
Passwords:
Hash only.
Never store plaintext passwords.
________________________________________
Database:
Local only.
________________________________________
Sensitive configuration:
Protected.
________________________________________
23. LICENSE RULES
Machine-bound license system.
Mandatory.
________________________________________
License validation:
Local.
________________________________________
No online activation required.
________________________________________
The system must support:
machine_hash
license_key
________________________________________
24. BACKUP RULES
Backups must include:
•	Students
•	Payments
•	Tournaments
•	Registrations
•	Matches
•	Settings
________________________________________
Backup format:
Compressed archive.
________________________________________
Restore process:
Manual.
________________________________________
25. GOOGLE FORMS RULES
MVP Workflow:
Google Forms
↓
Google Sheets
↓
CSV Export
↓
Import into Application
________________________________________
Direct Google API integration:
Out of Scope for MVP.
________________________________________
26. TOURNAMENT MANAGEMENT RULES
Administrative control always prevails.
________________________________________
The system shall NEVER:
•	Create groups automatically.
•	Move players automatically.
•	Decide classifications automatically.
•	Create elimination brackets automatically.
________________________________________
The administrator remains responsible for sports decisions.
________________________________________
27. REPORTING RULES
Reports must be printable.
Supported formats:
•	PDF
•	Excel
________________________________________
Reports must include:
•	Generation date
•	Tournament name when applicable
________________________________________
28. DOCUMENTATION RULES
Every module shall contain:
README.md
describing:
•	Purpose
•	Services
•	Components
________________________________________
Complex functions require comments.
________________________________________
29. GIT RULES
Mandatory:
Feature-based commits.
Example:
feat(students): add student form

fix(payments): payment validation

refactor(tournaments): improve group management
________________________________________
30. AI AGENT RULES
AI agents SHALL:
•	Follow MASTER_SPEC.
•	Follow UI_UX_SPEC.
•	Follow DATABASE_SPEC.
•	Follow DEVELOPMENT_RULES.
________________________________________
AI agents SHALL NOT:
•	Change architecture.
•	Replace technologies.
•	Introduce cloud services.
•	Modify business rules.
________________________________________
31. DEFINITION OF DONE
A feature is complete only if:
•	Code compiles.
•	Types pass.
•	Validation works.
•	Data persists correctly.
•	UI behaves correctly.
•	Documentation updated.
________________________________________
32. FINAL PRINCIPLE
The objective is not to build the most complex software.
The objective is to build the most reliable, maintainable and commercially viable software for managing a table tennis academy and its tournaments.
Every technical decision must support:
•	Simplicity
•	Offline operation
•	Maintainability
•	Commercial distribution
END OF DOCUMENT
04_DEVELOPMENT_RULES.md
VERSION 1.0
STATUS: APPROVED
