05_AI_IMPLEMENTATION_GUIDE.md
VERSION: 1.0
STATUS: APPROVED
PROJECT: TABLE TENNIS ACADEMY MANAGER
________________________________________
1. PURPOSE
This document defines the official implementation sequence for AI agents and developers.
Its objectives are:
•	Prevent architectural deviations.
•	Standardize development order.
•	Reduce technical debt.
•	Ensure incremental delivery.
•	Guarantee MVP completion.
This document is mandatory.
________________________________________
2. MANDATORY READING ORDER
Before generating code, every AI agent SHALL read:
1.	MASTER_SPEC.md
2.	UI_UX_SPEC.md
3.	DATABASE_SPEC.md
4.	DEVELOPMENT_RULES.md
5.	AI_IMPLEMENTATION_GUIDE.md
Implementation is prohibited without reading all documents.
________________________________________
3. DEVELOPMENT PHILOSOPHY
The project shall be developed:
Incrementally
Module by module
Feature by feature
________________________________________
The objective is:
Working software first.
Optimization later.
________________________________________
4. IMPLEMENTATION PHASES
The MVP shall be developed in the following order:
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
No phase may be skipped.
________________________________________
5. PHASE 0 – FOUNDATION
Objective:
Create the technical foundation.
________________________________________
Deliverables:
Project initialization
Electron configuration
React configuration
TypeScript configuration
Tailwind configuration
Prisma configuration
SQLite configuration
Folder structure
________________________________________
Validation:
Application starts successfully.
Database connects successfully.
________________________________________
6. PHASE 1 – AUTHENTICATION
Objective:
Protect application access.
________________________________________
Entities:
User
________________________________________
Screens:
Login
________________________________________
Features:
Create default administrator
Password hashing
Session management
Logout
________________________________________
Validation:
Only authenticated users may access the application.
________________________________________
7. PHASE 2 – SETTINGS MODULE
Objective:
Store global configuration.
________________________________________
Entities:
Settings
________________________________________
Screens:
Settings
________________________________________
Features:
Academy information
Logo management
Table count configuration
________________________________________
Validation:
Configuration persists correctly.
________________________________________
8. PHASE 3 – ACADEMY MODULE
Objective:
Manage students.
________________________________________
Entities:
AcademyCategory
Student
________________________________________
Screens:
Students List
Student Detail
Student Form
________________________________________
Features:
Create student
Edit student
Deactivate student
Search student
Soft delete
________________________________________
Validation:
CRUD operations fully functional.
________________________________________
9. PHASE 4 – PAYMENTS MODULE
Objective:
Manage academy payments.
________________________________________
Entities:
Payment
________________________________________
Screens:
Payments List
Payment Form
________________________________________
Features:
Register payment
Edit payment
Outstanding debt tracking
Payment history
________________________________________
Validation:
Student payment history works correctly.
________________________________________
10. PHASE 5 – TOURNAMENT CORE
Objective:
Create tournament foundation.
________________________________________
Entities:
Tournament
TournamentCategory
TournamentTable
Participant
Registration
________________________________________
Screens:
Tournament List
Tournament Detail
Category Management
Participant Management
Registration Management
________________________________________
Features:
Create tournament
Create categories
Manual registrations
CSV imports
________________________________________
Validation:
Tournament data persists correctly.
________________________________________
11. PHASE 6 – TOURNAMENT OPERATIONS
Objective:
Run tournaments.
________________________________________
Entities:
TournamentGroup
GroupPlayer
Match
MatchSet
Standing
________________________________________
Screens:
Groups
Matches
Results
Standings
________________________________________
Features:
Manual group creation
Participant assignment
Match creation
Result entry
Statistics calculation
Standings generation
________________________________________
Administrative Rule:
No automatic sports decisions.
________________________________________
Validation:
Tournament progression works correctly.
________________________________________
12. PHASE 7 – REPORTS
Objective:
Generate printable reports.
________________________________________
Libraries:
jsPDF
xlsx
________________________________________
Reports:
Students
Debtors
Payments
Participants
Results
Final Positions
Tournament Revenue
________________________________________
Exports:
PDF
Excel
________________________________________
Validation:
Generated files open successfully.
________________________________________
13. PHASE 8 – BACKUPS
Objective:
Protect user data.
________________________________________
Entities:
Backup
________________________________________
Screens:
Backup Management
________________________________________
Features:
Create backup
Restore backup
Backup history
________________________________________
Validation:
Data can be restored successfully.
________________________________________
14. PHASE 9 – LICENSING
Objective:
Protect commercial distribution.
________________________________________
Entities:
License
________________________________________
Features:
Machine hash generation
License validation
License storage
Startup verification
________________________________________
Validation:
Application blocks unauthorized installations.
________________________________________
15. PHASE 10 – PACKAGING
Objective:
Create distributable builds.
________________________________________
Platforms:
Windows
macOS
________________________________________
Deliverables:
Windows Installer
Portable Version
macOS Package
________________________________________
Validation:
Clean installation succeeds.
________________________________________
16. AI IMPLEMENTATION RULES
AI agents SHALL:
Implement only one phase at a time.
________________________________________
AI agents SHALL NOT:
Jump ahead to future phases.
________________________________________
AI agents SHALL:
Finish the current phase completely before continuing.
________________________________________
17. FEATURE IMPLEMENTATION ORDER
For every feature:
Step 1
Database Model
↓
Step 2
Prisma Repository
↓
Step 3
Service Layer
↓
Step 4
Validation Schema
↓
Step 5
UI Components
↓
Step 6
Page Integration
↓
Step 7
Testing
________________________________________
Mandatory sequence.
________________________________________
18. FILE GENERATION RULES
Every new module shall include:
README.md
Types
Services
Pages
Components
Validation
________________________________________
No empty folders.
________________________________________
19. TESTING REQUIREMENTS
Before completing any phase:
Verify:
Create
Read
Update
Delete
Validation
Navigation
Persistence
________________________________________
Failures must be resolved before advancing.
________________________________________
20. DOCUMENTATION REQUIREMENTS
After each completed phase:
Update:
README
Implementation Notes
Known Issues
________________________________________
Documentation is mandatory.
________________________________________
21. PROHIBITED SHORTCUTS
AI agents SHALL NOT:
Skip validation
Skip services
Access database directly from UI
Store business logic inside components
Ignore TypeScript errors
Disable strict mode
________________________________________
22. MVP COMPLETION CRITERIA
The MVP is complete when:
Authentication works
Settings work
Student management works
Payment management works
Tournament management works
Reports work
Backups work
Licensing works
Packaging works
________________________________________
All requirements from MASTER_SPEC must be satisfied.
________________________________________
23. POST-MVP FEATURES
Out of Scope:
Google API integration
Online synchronization
Cloud storage
Multi-user system
Ranking system
Advanced analytics
Mobile application
________________________________________
These belong to future releases.
________________________________________
24. AI SUCCESS CRITERIA
A successful implementation is:
Simple
Reliable
Maintainable
Offline-first
Commercially distributable
Cross-platform
________________________________________
25. FINAL PRINCIPLE
The objective is not to build features quickly.
The objective is to build a stable product that can be sold, maintained and evolved over time.
Every implementation decision must respect:
MASTER_SPEC
UI_UX_SPEC
DATABASE_SPEC
DEVELOPMENT_RULES
END OF DOCUMENT
05_AI_IMPLEMENTATION_GUIDE.md
VERSION 1.0
STATUS: APPROVED
