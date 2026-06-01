# SMS (School Management System) — Admin Workflow

> **School:** Vidya School, Biratnagar, Morang, Nepal
> **Academic Year:** 2083

---

## 1. Dashboard

The admin dashboard provides a bird's-eye view of the entire school. It displays key metrics like total students, teachers, staff, pending leave requests, and today's attendance percentage through stat cards. A bar chart visualizes weekly attendance trends, while a pie chart breaks down fee collection status across Paid, Due, and Partial categories. The dashboard also includes a recent activity timeline, quick action buttons (Mark Attendance, Add Student, Create Exam, Post Announcement), and an alert section highlighting pending leaves, near-full intakes, and unread inquiries.

---

## 2. Inquiries

This module manages prospective student inquiries coming from walk-ins, phone calls, and referrals. Each inquiry captures:

- **Inquirer details** — name, email, mobile, phone, and their relationship to the candidate (Father, Mother, Guardian, etc.)
- **Candidate details** — name, title, gender, DOB, mobile, email
- **Inquiry type** — a predefined dropdown with fixed values: **Admission**, General Inquiry, Complaint, Feedback, Transfer, or Other
- **Address** — permanent and temporary
- **Assignment** — staff member assigned to follow up
- **Description and outcome notes**

The table displays columns for ID, Type (inquiry purpose), Candidate name, Inquirer name, Relation (inquirer-to-candidate relationship), Contact, Status, Date, and Actions.

A **View** button opens a full detail dialog showing all inquiry information in a read-only format — including the inquirer-candidate relationship, addresses, assigned staff, and outcome notes.

Inquiries follow a status pipeline:

- **New** — Fresh inquiry received
- **Contacted** — Follow-up initiated
- **Converted** — Successfully enrolled as a student (handled via Admissions module)
- **Lost** — Inquiry closed without admission

Action buttons are **conditional based on inquiry type**:

- If the type is **"Admission"** and status is **New**, a "Contacted" button appears — clicking it moves the inquiry to the Admissions pipeline
- If the type is **"Admission"** and status is **Contacted**, it shows *"In Admissions"* label — no further actions here; the inquiry is now handled in the Admissions module
- For all other types (General Inquiry, Complaint, Feedback, Transfer, Other), no workflow buttons appear — the inquiry is view-only and informational

This ensures the enrollment pipeline starts here but is completed in the Admissions module.

---

## 3. Admissions

This module handles inquiries that have been marked as **Contacted**. It shows two tabs:

- **Pending** — All contacted inquiries awaiting a decision. Each row has two actions:
  - **Enroll** — Opens a modal to select an intake batch, class group, and roll number. On submission, the system creates a student record, generates user accounts for both the student and parent, links the parent to the student, updates the intake enrollment count, and marks the inquiry as **Converted**
  - **Lost** — Marks the inquiry as **Lost** when the prospect decides not to enroll
- **Enrolled** — Shows all inquiries that were successfully converted into students

> **Note:** This is the inquiry-driven admission path. For students who walk in directly without a prior inquiry, use the **Students → Admit New Student** form instead (see section 5).

---

## 4. Batch Management (Intakes)

Intakes represent enrollment batches for each grade level in a given academic year. Each intake tracks its name, grade, total capacity, and number of students currently enrolled. The admin can create, edit, or close intakes. A visual progress bar shows capacity utilization so the admin can see at a glance which grades are filling up. This helps with capacity planning and admission forecasting.

---

## 5. Students

The student directory lists all enrolled students with their class, section, roll number, fee status, and activation status. The admin can:

- **Admit a new student** — A comprehensive admission form captures personal details (name, DOB, gender, blood group, nationality, religion, ethnicity, mother tongue), family information (father, mother, guardian with contact), address details (permanent and temporary), previous school records, and class assignment. This is the **manual admission path** for students who walk in directly without a prior inquiry
- **Edit** existing student records
- **Delete** student records

Each student name can be clicked to open a detailed profile page organized into tabs:

- **Fee History** — Payment records with amounts and dates
- **Attendance** — Daily status logs with color-coded badges
- **Results** — Exam-wise marks table with subject scores, total, and percentage
- **Assignments** — Submitted work with scores and reviewed status

---

## 6. ID Cards

The admin can generate student ID cards in bulk. Select a class and section, and the system displays all students ready for card generation. Each card displays the school name, student name, class, roll number, address, phone number, and a photo placeholder. A preview panel shows the card layout before final generation.

---

## 7. Teachers

The teacher directory manages all teaching staff. Each teacher record captures:

- Personal information (name, title, gender, DOB, blood group, nationality, religion, ethnicity, mother tongue, marital status)
- Employment details (designation, job type, department, sub-department, branch, level, hire date, salary, payment method)
- Qualifications (highest degree, years of experience, subject specialization)
- Official documents (citizenship number, PAN number, addresses)
- Class assignments (which classes they teach)

The admin can add, edit, or remove teacher records and assign them to specific classes. All dates support the Nepali (Bikram Sambat) calendar.

---

## 8. Staff

This module manages non-teaching staff including accountants, librarians, front desk officers, administrative assistants, security personnel, and cleaners. The staff profile is as detailed as the teacher profile with additional fields specific to staff: employee code, staff type (Teaching/Non-Teaching), residency type, username, official email, SMS contact number, and Nepali name. Staff members can also be assigned class-level access if needed.

---

## 9. Attendance

The attendance module provides three views:

- **Class Attendance** — Select a class and date to view the student roster. Mark each student as Present, Absent, Late, or Leave. A "Mark All Present" button speeds up routine days.
- **Staff Attendance** — Filter by department and record attendance for all staff members.
- **Device Logs** — View check-in and check-out times recorded by the biometric device, providing an audit trail of when employees arrived and departed.

Attendance can be recorded manually (by admin or teacher) or imported from biometric devices.

---

## 10. Leave Requests

This is the centralized hub for managing all leave requests submitted by teachers, staff, and students. The admin sees a list of applications with the applicant's name, leave type (sick, casual, annual, maternity, paternity, unpaid), date range, and reason. Each request can be:

- **Approved** — Optionally with an admin note
- **Rejected** — With a reason provided

Filters allow viewing All, Pending, Approved, or Rejected requests. The status is communicated back to the applicant through the system.

---

## 11. Assignments

Assignments can be overseen school-wide from this module. It is organized into:

- **List** — All assignments created by any teacher, showing title, class, subject, teacher, due date, and number of submissions
- **Create** — Admin can create assignments for any class and assign to any teacher
- **Submitted** — View all student submissions across classes and see which ones are reviewed or pending
- **Ledger** — Per-student view showing their complete assignment history
- **Staff Ledger** — Filtered view for assignments related to staff work

This gives the admin full visibility into academic workload across the school.

---

## 12. Routine Builder

The weekly timetable is built here. The admin works with a grid of days (Sunday through Thursday) and periods (1 through 6). Each cell can be filled by selecting a class, subject, teacher, and room. A "Create Routine" form allows adding individual slots to the grid. This replaces manual timetable creation with a digital drag-and-drop style interface.

---

## 13. Calendar

Manage school events. Events are categorized as **General** (holidays, sports day, picnics) or **Academic** (exams, parent-teacher meetings, admission deadlines). Each event has a title, description, and date. The admin can add, edit, or delete events. Events appear on the respective role's calendar view so teachers, students, staff, and parents stay informed.

---

## 14. Exams

Exams are created and scheduled here. Each exam record captures:

- Exam name and type (Terminal, Mid-Term, Final, Unit Test, Weekly Test, Pre-Board, Quarterly)
- Date range (start and end)
- Applicable classes (which grades sit for this exam)
- Subjects with their full marks and pass marks

The admin can add, edit, or remove exams. Multiple subjects can be added per exam dynamically.

---

## 15. Exam Results

Once exams are conducted and marks are entered by teachers, the admin can view and publish results. The results page shows:

- Summary stats: total students, average percentage, number of students who passed and failed
- Student-wise table: subject scores, total marks, percentage, and letter grade (A+, A, B+, etc.)
- Color-coded indicators: pass in green, fail in red

The admin can publish or unpublish results with a toggle. When published, results become visible to students and parents. Grades are computed automatically based on the grading scale configuration.

---

## 16. Announcements

Post school-wide or targeted announcements. Each announcement has a title, content, target audience (All, Students, Teachers, Staff, or Parents), priority level (High, Medium, Low), and publish date. Announcements appear on the respective role's dashboard and notices page. The admin can edit or delete past announcements.

---

## 17. Fee Management

The fee module tracks what each student has paid and what remains due. The admin can:

- View all fee records with student name, fee type, amount, paid amount, balance, and status
- Record a new payment by selecting a student, entering the amount, and date
- See status badges: Paid (green), Due (red), Partial (amber)

This provides a real-time view of the school's fee collection status.

---

## 18. Class Groups

This module defines the school's class structure. Each class group has a name (e.g., Nursery, Class 1, Grade 10), a section, a designated class teacher, and a room number. The admin can create, edit, or delete class groups.

---

## 19. Sections

Simple management of section labels (e.g., Section A, Section B). These labels are used across classes to group students.

---

## 20. Subjects

The subject catalog holds all subjects offered by the school (e.g., Mathematics, Science, English, Nepali, Social Studies, Computer Science). Each subject has a name and a short code. The admin can add, edit, or remove subjects.

---

## 21. Academic Years

Manage academic sessions. Each year can be added, edited, or removed. The active academic year is set in school settings and used throughout the system.

---

## 22. Fee Structure

Define what fees apply to each class. For example, Tuition Fee, Transport Fee, Library Fee, Lab Fee — each with a specific amount per class. This serves as the rate card for fee collection.

---

## 23. Grading Scale

Configure how marks translate to letter grades. The default scale is:

| Grade | Range |
|-------|-------|
| A+ | 90–100% |
| A | 80–89% |
| B+ | 70–79% |
| B | 60–69% |
| C+ | 50–59% |
| C | 40–49% |
| D | 0–39% |

The admin can add, edit, or remove grade boundaries.

---

## 24. Reference Data

Manage the dropdown options used throughout the system. Categories include: staff roles, leave types, gender, blood groups, religions, ethnic groups, fee statuses, announcement audiences, residency types, and staff types. This ensures data consistency across all forms.

---

## 25. School Settings

Configure the school's identity: school name, address, phone number, and the active academic year. These values appear on ID cards, reports, and throughout the system.

---

## 26. User Accounts

Manage login accounts for all users across the system (admins, teachers, staff, students, parents). Each account has a name, email, password, role, and phone number. The admin can create new accounts, edit existing ones, or toggle accounts between Active and Inactive to grant or revoke system access.

---

## 27. Parents

Manage parent accounts and their relationship to students. The admin can create parent accounts, view which children are linked to each parent, and link or unlink students from a parent's account. This enables parents to view their children's attendance, results, assignments, and fees through the parent portal.
