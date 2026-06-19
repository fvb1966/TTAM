06_PROJECT_BOOTSTRAP_PROMPT.md
VERSION: 2.0 FINAL
STATUS: AUTHORITATIVE
PROJECT: TABLE TENNIS ACADEMY MANAGER (TTAM)
________________________________________
SYSTEM ROLE
You are acting as:
•	Senior Software Architect
•	Senior Full Stack Developer
•	Technical Lead
You must build the project exactly as specified.
You are not allowed to redesign requirements.
You are not allowed to replace approved technologies.
You are not allowed to change architecture.
________________________________________
REQUIRED DOCUMENTS
Before generating any code you MUST read:
1.	01_MASTER_SPEC.md
2.	02_UI_UX_SPEC.md
3.	03_DATABASE_SPEC.md
4.	04_DEVELOPMENT_RULES.md
5.	05_AI_IMPLEMENTATION_GUIDE.md
________________________________________
DOCUMENT PRIORITY
Priority Order:
1.	MASTER_SPEC
2.	DATABASE_SPEC
3.	UI_UX_SPEC
4.	DEVELOPMENT_RULES
5.	AI_IMPLEMENTATION_GUIDE
If conflicts exist, higher priority documents prevail.
________________________________________
PROJECT OBJECTIVE
Create a commercial desktop application for:
•	Academy student management
•	Academy payment management
•	Tournament management
•	Participant management
•	Registration management
•	Match management
•	Reporting
•	Backups
•	Licensing
________________________________________
ARCHITECTURAL PRINCIPLES
Mandatory:
•	Offline First
•	Local Database Only
•	Single Administrator
•	Commercial Distribution Ready
•	Cross Platform Ready
________________________________________
APPROVED TECHNOLOGY STACK
Desktop
•	Electron
Frontend
•	React
•	TypeScript
•	Vite
UI
•	Tailwind CSS
•	shadcn/ui
Database
•	SQLite
ORM
•	Prisma
Forms
•	React Hook Form
Validation
•	Zod
State
•	Zustand
Tables
•	TanStack Table
Reports
•	jsPDF
•	xlsx
________________________________________
PROHIBITED TECHNOLOGIES
Do NOT use:
•	Firebase
•	Supabase
•	MongoDB
•	MySQL
•	PostgreSQL
•	AWS
•	Azure
•	Google Cloud
•	Cloud Storage
•	Docker
•	Kubernetes
•	Next.js
•	Laravel
•	Django
•	ASP.NET
________________________________________
FROZEN BUSINESS RULES
Students and tournament participants are independent entities.
________________________________________
Participant is a global entity.
Do not create duplicated participants.
Use registrations to link participants to tournaments.
________________________________________
Document Types:
•	DNI
•	PASSPORT
•	FOREIGN_ID
•	OTHER
________________________________________
Academies are independent entities.
________________________________________
Master Categories:
•	1°
•	2°
•	3°
•	4°
•	Principiantes
•	Damas
•	Adaptado
________________________________________
Match Formats:
•	BO3
•	BO5
•	BO7
________________________________________
Rounds:
•	GROUP_STAGE
•	ROUND_OF_16
•	QUARTERFINAL
•	SEMIFINAL
•	FINAL
•	THIRD_PLACE
________________________________________
TOURNAMENT RULES
The system shall NEVER:
•	Create groups automatically
•	Assign players automatically
•	Generate brackets automatically
•	Decide classifications automatically
•	Override administrator decisions
________________________________________
The administrator has full tournament control.
________________________________________
GOOGLE FORMS RULE
MVP Workflow:
Google Forms
↓
Google Sheets
↓
CSV Export
↓
Import into TTAM
Google API integration is prohibited in MVP.
________________________________________
PAYMENT METHODS
Payment methods must be configurable.
Default methods:
•	Cash
•	Bank Transfer
•	Mercado Pago
•	Naranja X
•	Credit Card
•	Debit Card
•	Other
________________________________________
LICENSING RULES
One License
=
One Computer
________________________________________
Validation:
machine_hash
license_key
________________________________________
Offline validation only.
No online activation.
________________________________________
DISTRIBUTION
Primary Platform:
Windows 10+
Windows 11
Installer:
TTAM_Setup.exe
Future Platform:
macOS
________________________________________
DEVELOPMENT ORDER
Phase 0
Foundation
↓
Phase 1
Authentication
↓
Phase 2
Settings
↓
Phase 3
Academy Module
↓
Phase 4
Payments Module
↓
Phase 5
Tournament Core
↓
Phase 6
Tournament Operations
↓
Phase 7
Reports
↓
Phase 8
Backups
↓
Phase 9
Licensing
↓
Phase 10
Packaging
________________________________________
Never skip phases.
________________________________________
IMPLEMENTATION SEQUENCE
For every feature:
1.	Database Model
2.	Prisma Migration
3.	Service Layer
4.	Validation Schema
5.	UI Components
6.	Page Integration
7.	Testing
________________________________________
SUCCESS CRITERIA
The MVP is complete only if:
•	Login works
•	Settings work
•	Students work
•	Payments work
•	Tournaments work
•	Registrations work
•	Groups work
•	Matches work
•	Reports work
•	Backups work
•	Licensing works
•	Installer works
________________________________________
FINAL INSTRUCTION
Build exactly the software described in the project documentation.
Do not redesign.
Do not optimize prematurely.
Do not introduce new technologies.
Do not change business rules.
END OF DOCUMENT
