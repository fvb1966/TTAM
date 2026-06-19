02_UI_UX_SPEC.md
VERSION: 1.0
STATUS: APPROVED
PROJECT: TABLE TENNIS ACADEMY MANAGER
________________________________________
1. PURPOSE
This document defines the User Interface (UI) and User Experience (UX) specifications for the Table Tennis Academy Manager application.
Its purpose is to ensure that:
•	Developers follow a consistent design.
•	AI agents generate screens consistently.
•	Navigation remains predictable.
•	Business workflows remain aligned with the MASTER_SPEC.
This document is mandatory.
If a conflict exists between this document and MASTER_SPEC:
MASTER_SPEC prevails.
________________________________________
2. UI PHILOSOPHY
The application is an administrative management system.
The design must prioritize:
•	Simplicity
•	Speed
•	Readability
•	Efficiency
The system is NOT intended to be:
•	A public website
•	A marketing platform
•	A social network
The primary user is:
Administrator
________________________________________
3. DESIGN PRINCIPLES
DP-001
Minimize clicks.
________________________________________
DP-002
Frequently used actions must remain visible.
________________________________________
DP-003
Tables are preferred over cards.
________________________________________
DP-004
Business information is more important than visual effects.
________________________________________
DP-005
The interface must work completely offline.
________________________________________
DP-006
No screen shall require internet access.
________________________________________
4. APPLICATION LAYOUT
The application uses:
Sidebar Layout
Structure:
Header
Left Sidebar
Main Content Area
________________________________________
5. SIDEBAR NAVIGATION
Mandatory structure:
Dashboard

ACADEMIA
 ├─ Alumnos
 └─ Pagos

TORNEOS
 ├─ Torneos
 ├─ Inscripciones
 ├─ Participantes
 ├─ Grupos
 └─ Partidos

REPORTES

BACKUPS

CONFIGURACIÓN

SALIR
No additional menu items may be introduced without approval.
________________________________________
6. HEADER
The header shall display:
•	Application Name
•	Current User
•	Current Date
•	Current Time
Optional:
•	Academy Logo
________________________________________
7. DASHBOARD SCREEN
Dashboard is the default landing page.
________________________________________
Academy Metrics
Display:
•	Total Students
•	Active Students
•	Inactive Students
•	Debtor Students
________________________________________
Financial Metrics
Display:
•	Current Month Revenue
•	Pending Payments
________________________________________
Tournament Metrics
Display:
•	Upcoming Tournament
•	Active Tournaments
•	Registered Participants
________________________________________
Alerts
Display:
•	Upcoming Payment Due Dates
•	Upcoming Tournament Dates
________________________________________
Quick Actions
Display buttons:
•	New Student
•	Register Payment
•	New Tournament
•	Import Registrations
________________________________________
8. STUDENTS SCREEN
Purpose:
Manage academy students.
________________________________________
Main Actions
•	Create Student
•	Edit Student
•	Deactivate Student
•	Search Student
________________________________________
Search Filters
•	DNI
•	First Name
•	Last Name
•	Phone
________________________________________
Student Table Columns
•	DNI
•	First Name
•	Last Name
•	Category
•	Phone
•	Status
•	Actions
________________________________________
Toolbar
Display:
•	Search Box
•	Filters
•	New Student Button
________________________________________
9. STUDENT DETAIL SCREEN
Tabs:
Personal Data
Display:
•	DNI
•	Name
•	Birth Date
•	Age
•	Gender
________________________________________
Contact Data
Display:
•	Phone
•	Email
________________________________________
Academy Data
Display:
•	Category
•	Join Date
•	Status
________________________________________
Payments
Display:
•	Payment History
•	Outstanding Debt
________________________________________
10. PAYMENTS SCREEN
Purpose:
Manage academy fee payments.
________________________________________
Main Actions
•	Register Payment
•	Edit Payment
•	View Payment History
________________________________________
Payment Form
Fields:
•	Student
•	Amount
•	Due Date
•	Payment Date
•	Payment Method
•	Notes
________________________________________
Payment Methods
•	Cash
•	Bank Transfer
•	Credit Card
•	Debit Card
•	Virtual Wallet
•	Other
________________________________________
Payment Table
Columns:
•	Student
•	Amount
•	Due Date
•	Payment Date
•	Status
________________________________________
11. TOURNAMENTS SCREEN
Purpose:
Manage tournaments.
________________________________________
Main Actions
•	Create Tournament
•	Edit Tournament
•	Archive Tournament
________________________________________
Tournament Table
Columns:
•	Name
•	Date
•	Status
•	Categories
•	Participants
________________________________________
Toolbar
Display:
•	Search
•	Filters
•	New Tournament
________________________________________
12. TOURNAMENT DETAIL SCREEN
Tabs:
•	General
•	Categories
•	Registrations
•	Participants
•	Groups
•	Matches
•	Results
•	Reports
All tournament operations are performed inside this screen.
________________________________________
13. CATEGORIES SCREEN
Purpose:
Manage tournament categories.
________________________________________
Category Fields
•	Name
•	Registration Price
•	Minimum Participants
•	Start Time
•	Notes
________________________________________
Category Table
Columns:
•	Category Name
•	Price
•	Minimum Players
•	Registered Players
•	Start Time
•	Status
________________________________________
14. REGISTRATIONS SCREEN
Purpose:
Manage tournament registrations.
________________________________________
Main Actions
•	Import CSV
•	Manual Registration
•	Edit Registration
________________________________________
Registration Table
Columns:
•	DNI
•	Name
•	Academy
•	Categories
•	Payment Status
________________________________________
15. PARTICIPANTS SCREEN
Purpose:
Manage tournament participants.
________________________________________
Participant Table
Columns:
•	DNI
•	Name
•	Academy
•	Categories
•	Payment Status
________________________________________
16. GROUP MANAGEMENT SCREEN
Purpose:
Create and manage tournament groups.
________________________________________
Administrative Principle
All group assignments are manual.
The system shall never:
•	Generate groups automatically.
•	Move players automatically.
•	Rebalance groups automatically.
________________________________________
Group Layout
Display:
Category
↓
Groups
↓
Players
________________________________________
Example:
Group A
Group B
Group C
________________________________________
Group Actions
•	Create Group
•	Rename Group
•	Delete Group
•	Add Player
•	Remove Player
________________________________________
17. MATCH SCREEN
Purpose:
Manage matches.
________________________________________
Match Fields
•	Player A
•	Player B
•	Match Type
•	Table Number
•	Scheduled Time
•	Status
________________________________________
Match Status
•	Pending
•	In Progress
•	Completed
•	Walkover
________________________________________
Match Types
•	Group Stage
•	Elimination
________________________________________
18. RESULT ENTRY SCREEN
Purpose:
Register match results.
________________________________________
Match Information
Display:
•	Players
•	Table
•	Match Type
________________________________________
Set Entry
For each set:
•	Player A Points
•	Player B Points
________________________________________
Validation
Reject:
•	Negative values
•	Missing players
________________________________________
19. STANDINGS SCREEN
Purpose:
Display group standings.
________________________________________
Calculated Columns
•	Matches Won
•	Matches Lost
•	Sets Won
•	Sets Lost
•	Points For
•	Points Against
•	Point Difference
________________________________________
Administrative Principle
The system displays statistics.
The administrator decides classifications.
________________________________________
20. REPORTS SCREEN
Purpose:
Generate reports.
________________________________________
Academy Reports
•	Total Students
•	Active Students
•	Inactive Students
•	Debtor Students
•	Payments
•	Categories
________________________________________
Tournament Reports
•	Participants
•	Registrations
•	Match Results
•	Standings
•	Final Positions
•	Payments
________________________________________
21. BACKUP SCREEN
Purpose:
Manage backups.
________________________________________
Actions
•	Create Backup
•	Restore Backup
________________________________________
Display
•	Backup Name
•	Date
•	Size
________________________________________
22. SETTINGS SCREEN
Purpose:
Manage system configuration.
________________________________________
General Settings
Fields:
•	Academy Name
•	Owner Name
•	Address
•	Phone
•	Email
•	Logo
________________________________________
Tournament Settings
Fields:
•	Default Table Count
Default:
7
________________________________________
23. LOGIN SCREEN
Purpose:
Restrict access.
________________________________________
Fields
•	Username
•	Password
________________________________________
Actions
•	Login
No online recovery mechanism.
________________________________________
24. GLOBAL COMPONENTS
Reusable Components:
•	Data Table
•	Search Bar
•	Modal Window
•	Confirmation Dialog
•	Date Picker
•	Time Picker
•	Currency Input
________________________________________
25. VALIDATION UX RULES
Validation messages must:
•	Be clear
•	Be concise
•	Explain the problem
Example:
“DNI already exists.”
Avoid technical messages.
________________________________________
26. RESPONSIVE RULES
Primary target:
Desktop
Minimum width:
1366px
Tablet support:
Optional
Mobile support:
Out of Scope
________________________________________
27. DESIGN SYSTEM RULES
Framework:
•	Tailwind CSS
•	shadcn/ui
________________________________________
Theme:
Professional Administrative Interface
Avoid:
•	Animations
•	Excessive colors
•	Decorative elements
Prioritize:
•	Information Density
•	Readability
•	Speed
________________________________________
28. FINAL PRINCIPLE
The interface exists to help the Administrator organize the academy and tournaments.
The interface shall never attempt to replace the Administrator’s sports decisions.
END OF DOCUMENT
02_UI_UX_SPEC.md VERSION 1.0 STATUS: APPROVED
