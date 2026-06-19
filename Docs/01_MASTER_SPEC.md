01_MASTER_SPEC.md
VERSION: 1.1
STATUS: APPROVED
PROJECT: TABLE TENNIS ACADEMY MANAGER (TTAM)
________________________________________
1. PROJECT OVERVIEW
Project Name
TABLE TENNIS ACADEMY MANAGER (TTAM)
________________________________________
Purpose
Desktop application designed to manage:
•	Academy students
•	Student payments
•	Tournament registrations
•	Tournament participants
•	Tournament categories
•	Tournament groups
•	Tournament matches
•	Match results
•	Reports
•	Backups
•	Software licensing
________________________________________
Target User
Single Academy Administrator.
The system is not multi-user in MVP.
________________________________________
2. BUSINESS OBJECTIVES
The system shall allow:
•	Management of academy students.
•	Tracking student payments.
•	Tracking outstanding debts.
•	Management of tournaments.
•	Registration of participants.
•	Recording tournament payments.
•	Management of categories.
•	Management of groups.
•	Recording match results.
•	Generation of reports.
•	Local backup and restore.
________________________________________
3. ACADEMY MANAGEMENT
Student Data
Each student shall contain:
•	First Name
•	Last Name
•	Birth Date
•	Gender
•	Phone
•	Email (optional)
•	Address (optional)
•	Academy Category
•	Registration Date
•	Active Status
•	Notes
________________________________________
Academy Categories
Administrator configurable.
Examples:
•	Beginner
•	Intermediate
•	Advanced
________________________________________
4. STUDENT PAYMENTS
Student payments are independent from tournament payments.
The system shall allow:
•	Register payment
•	Edit payment
•	Delete payment
•	Payment history
________________________________________
Payment Methods
Configurable by administrator.
Examples:
•	Cash
•	Bank Transfer
•	Mercado Pago
•	Naranja X
•	Credit Card
•	Debit Card
•	Other
________________________________________
Debt Tracking
The system shall allow:
•	Identify debtors
•	View payment history
•	Generate debtor reports
________________________________________
5. TOURNAMENT MANAGEMENT
Tournament Data
Each tournament shall contain:
•	Name
•	Description
•	Date
•	Location
•	Organizer
•	Minimum Participants Rule
•	Number of Tables
•	Notes
________________________________________
Tournament Categories
Master categories:
•	1°
•	2°
•	3°
•	4°
•	Principiantes
•	Damas
•	Adaptado
Each tournament may enable one or more categories.
________________________________________
Category Configuration
For each tournament category:
•	Entry Fee (single category)
•	Entry Fee (multiple categories)
•	Minimum Participants
•	Start Time
________________________________________
6. PARTICIPANTS
Participants are independent from students.
A participant may:
•	Participate in one tournament
•	Participate in multiple tournaments
________________________________________
Global Participant Rule
Participant is a global entity.
Participants shall not be duplicated.
The same participant may be linked to multiple tournaments through registrations.
________________________________________
Participant Data
•	First Name
•	Last Name
•	Document Type
•	Document Number
•	Birth Date
•	Gender
•	Phone
•	Email
•	Academy
•	Notes
________________________________________
Document Types
Allowed values:
•	DNI
•	PASSPORT
•	FOREIGN_ID
•	OTHER
________________________________________
7. ACADEMIES
Academies shall be managed as a dedicated entity.
Each academy contains:
•	Name
•	City
•	Notes
•	Active Status
________________________________________
8. REGISTRATIONS
A participant may register in:
•	One category
•	Multiple categories
within the same tournament.
________________________________________
Registration Types
Online Registration
Workflow:
Google Forms
↓
Google Sheets
↓
CSV Export
↓
TTAM Import
________________________________________
Manual Registration
Performed directly by administrator.
________________________________________
9. TOURNAMENT PAYMENTS
Tournament payments are independent from academy payments.
The administrator manually records:
•	Amount
•	Date
•	Payment Method
•	Notes
________________________________________
10. TOURNAMENT GROUPS
Groups are created manually.
The system shall never automatically create groups.
________________________________________
Administrator responsibilities:
•	Create groups
•	Assign players
•	Organize group composition
________________________________________
11. MATCH MANAGEMENT
Matches are created manually.
The system shall never automatically generate matches.
________________________________________
Match Formats
Supported:
•	BO3
•	BO5
•	BO7
________________________________________
Match Data
•	Category
•	Group
•	Round
•	Table
•	Scheduled Time
•	Players
•	Result
________________________________________
12. TOURNAMENT ROUNDS
Supported values:
•	GROUP_STAGE
•	ROUND_OF_16
•	QUARTERFINAL
•	SEMIFINAL
•	FINAL
•	THIRD_PLACE
________________________________________
13. MATCH RESULTS
Administrator manually records:
•	Sets won
•	Points scored
•	Match winner
________________________________________
The system shall calculate standings based on recorded results.
________________________________________
14. WALKOVER (WO)
Supported.
If a participant does not appear:
•	Match may be marked as WO.
•	Opponent receives victory.
________________________________________
15. REPORTS
Academy Reports
•	All Students
•	Active Students
•	Debtors
•	Payments
________________________________________
Tournament Reports
•	Participants
•	Categories
•	Groups
•	Matches
•	Results
•	Final Positions
•	Revenue
________________________________________
Export Formats
•	PDF
•	Excel
________________________________________
16. BACKUPS
The system shall support:
•	Backup creation
•	Backup restoration
________________________________________
Backups must include:
•	Students
•	Payments
•	Participants
•	Tournaments
•	Matches
•	Results
•	Settings
•	License Information
________________________________________
17. LICENSING
Business Model:
One License
=
One Computer
________________________________________
License validation shall be based on:
•	machine_hash
•	license_key
________________________________________
The system must function completely offline.
________________________________________
18. OUT OF SCOPE (MVP)
The following features are excluded:
•	Online synchronization
•	Cloud storage
•	Multi-user access
•	Rankings
•	Mobile application
•	Google API Integration
•	Automatic tournament generation
________________________________________
19. FINAL PRINCIPLE
The administrator always has final authority.
The system assists administration.
The system does not make sports decisions.
END OF DOCUMENT
