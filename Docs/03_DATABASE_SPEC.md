03_DATABASE_SPEC.md
VERSION: 1.0
STATUS: APPROVED
PROJECT: TABLE TENNIS ACADEMY MANAGER
________________________________________
1. PURPOSE
This document defines the official database structure.
It is the authoritative source for:
•	SQLite schema
•	Prisma schema
•	Migrations
•	Relationships
•	Constraints
•	Indexes
No AI agent or developer may alter this structure without explicit approval.
________________________________________
2. DATABASE TECHNOLOGY
Database Engine:
SQLite
ORM:
Prisma
Encryption:
SQLCipher (Future Commercial Release)
MVP:
SQLite Standard
________________________________________
3. GLOBAL DATABASE RULES
DB-001
Primary Keys shall use:
INTEGER AUTOINCREMENT
________________________________________
DB-002
All tables shall include:
created_at
updated_at
________________________________________
DB-003
Business entities shall support:
is_deleted
deleted_at
Soft Delete only.
________________________________________
DB-004
Physical deletion is prohibited.
________________________________________
DB-005
Dates shall use:
DATETIME
________________________________________
DB-006
Currency values:
DECIMAL(10,2)
________________________________________
4. USERS
Purpose:
Authentication.
________________________________________
Table:
User
Fields:
id
username
password_hash
active
created_at
updated_at
Constraints:
username UNIQUE
________________________________________
5. SETTINGS
Purpose:
Global application configuration.
________________________________________
Table:
Settings
Fields:
id
academy_name
owner_name
address
phone
email
logo_path
currency
default_table_count
created_at
updated_at
Expected:
Single Record Table
________________________________________
6. ACADEMY CATEGORIES
Table:
AcademyCategory
Fields:
id
name
active
created_at
updated_at
Constraints:
name UNIQUE
________________________________________
7. STUDENTS
Table:
Student
Fields:
id
dni
first_name
last_name
birth_date
gender
phone
email
academy_category_id
join_date
notes
status
created_at
updated_at
is_deleted
deleted_at
Constraints:
dni UNIQUE
Relationships:
AcademyCategory 1:N Student
Indexes:
dni
last_name
status
________________________________________
8. PAYMENTS
Table:
Payment
Fields:
id
student_id
amount
due_date
payment_date
payment_method
notes
created_at
updated_at
is_deleted
deleted_at
Relationships:
Student 1:N Payment
Indexes:
student_id
due_date
payment_date
________________________________________
9. TOURNAMENTS
Table:
Tournament
Fields:
id
name
date
location
notes
status
created_at
updated_at
is_deleted
deleted_at
Indexes:
date
status
________________________________________
10. TOURNAMENT CATEGORIES
Table:
TournamentCategory
Fields:
id
tournament_id
name
registration_price
minimum_players
start_time
notes
active
created_at
updated_at
Relationships:
Tournament 1:N TournamentCategory
Indexes:
tournament_id
name
________________________________________
11. PARTICIPANTS
Table:
Participant
Fields:
id
dni
first_name
last_name
academy_name
phone
email
notes
created_at
updated_at
is_deleted
deleted_at
Indexes:
dni
last_name
academy_name
________________________________________
12. REGISTRATIONS
Purpose:
Tournament registrations.
________________________________________
Table:
Registration
Fields:
id
participant_id
tournament_category_id
registration_source
payment_amount
payment_date
payment_method
payment_status
notes
created_at
updated_at
is_deleted
deleted_at
Relationships:
Participant 1:N Registration

TournamentCategory 1:N Registration
Indexes:
participant_id
tournament_category_id
payment_status
Unique Rule:
participant_id
+
tournament_category_id
Must be unique.
________________________________________
13. TOURNAMENT TABLES
Purpose:
Physical tournament tables.
________________________________________
Table:
TournamentTable
Fields:
id
table_number
active
notes
created_at
updated_at
Constraints:
table_number UNIQUE
________________________________________
14. GROUPS
Table:
TournamentGroup
Fields:
id
tournament_category_id
group_name
notes
created_at
updated_at
is_deleted
deleted_at
Relationships:
TournamentCategory 1:N TournamentGroup
Indexes:
tournament_category_id
________________________________________
15. GROUP PLAYERS
Purpose:
Assign participants to groups.
________________________________________
Table:
GroupPlayer
Fields:
id
group_id
participant_id
created_at
updated_at
Relationships:
TournamentGroup 1:N GroupPlayer

Participant 1:N GroupPlayer
Unique Rule:
group_id
+
participant_id
________________________________________
16. MATCHES
Table:
Match
Fields:
id
group_id
player_a_id
player_b_id
winner_id
table_id
scheduled_time
match_type
status
created_at
updated_at
is_deleted
deleted_at
Relationships:
TournamentGroup 1:N Match

Participant 1:N Match
Indexes:
group_id
status
scheduled_time
________________________________________
17. MATCH SETS
Purpose:
Store detailed scores.
________________________________________
Table:
MatchSet
Fields:
id
match_id
set_number
player_a_points
player_b_points
created_at
updated_at
Relationships:
Match 1:N MatchSet
Indexes:
match_id
________________________________________
18. STANDINGS
Purpose:
Calculated standings.
________________________________________
Table:
Standing
Fields:
id
group_id
participant_id
matches_won
matches_lost
sets_won
sets_lost
points_for
points_against
point_difference
created_at
updated_at
Relationships:
TournamentGroup 1:N Standing
Indexes:
group_id
participant_id
________________________________________
19. BACKUPS
Table:
Backup
Fields:
id
filename
creation_date
notes
created_at
updated_at
Purpose:
Backup history only.
Actual backup files remain outside database.
________________________________________
20. LICENSES
Table:
License
Fields:
id
customer_name
license_type
machine_hash
product_version
issue_date
created_at
updated_at
Indexes:
machine_hash
________________________________________
21. ENUM DEFINITIONS
Student Status
ACTIVE
INACTIVE
________________________________________
Tournament Status
DRAFT
OPEN
CLOSED
IN_PROGRESS
COMPLETED
CANCELLED
________________________________________
Payment Methods
CASH
BANK_TRANSFER
CREDIT_CARD
DEBIT_CARD
VIRTUAL_WALLET
OTHER
________________________________________
Payment Status
PAID
PENDING
OVERDUE
________________________________________
Registration Source
CSV_IMPORT
MANUAL
________________________________________
Match Type
GROUP_STAGE
ELIMINATION
________________________________________
Match Status
PENDING
IN_PROGRESS
COMPLETED
WO
________________________________________
22. REQUIRED INDEXES
Mandatory indexes:
Student.dni

Student.last_name

Payment.student_id

Payment.due_date

Tournament.date

Participant.dni

Registration.participant_id

Registration.payment_status

Match.group_id

Match.status

Standing.group_id
________________________________________
23. PRISMA RULES
Mandatory:
Use Prisma ORM.
Naming Convention:
PascalCase Models
camelCase Fields
Example:
Student
TournamentCategory
MatchSet
________________________________________
24. PROHIBITED CHANGES
AI agents and developers SHALL NOT:
•	Replace SQLite.
•	Replace Prisma.
•	Replace local storage.
•	Introduce cloud databases.
•	Introduce Firebase.
•	Introduce Supabase.
•	Introduce MongoDB.
•	Remove Soft Delete support.
________________________________________
25. FINAL PRINCIPLE
This database is designed for:
•	Offline operation
•	Local storage
•	Commercial desktop distribution
All future development must preserve these principles.
END OF DOCUMENT
03_DATABASE_SPEC.md
VERSION 1.0
STATUS: APPROVED
