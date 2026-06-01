# SMS (School Management System) Teacher Portal

> **School:** Vidya School, Biratnagar, Morang, Nepal
> **Academic Year:** 2083

---

## 1. Dashboard

The teacher dashboard provides an overview of the school day. It shows four stat cards: number of assigned classes, total students across those classes, today's attendance percentage for their students, and pending leave requests. A welcome banner displays the teacher's name. The schedule section lists the teacher's classes for the current day, sorted by period, showing the subject, class name, and room number for each. A Quick Links section offers navigation to Mark Attendance, My Routine, and Assignments.

---

## 2. My Classes

This page lists all class groups assigned to the teacher. Each card displays the class name, section, an Active badge, the number of enrolled students, and the room number. This gives the teacher a quick reference of their teaching responsibilities.

---

## 3. Mark Attendance

Teachers can record student attendance from this page. They select a class from their assigned classes and a date. The student roster appears with each student's name and roll number, alongside a status dropdown (Present, Absent, Late, Leave). A Mark All Present button sets all students to Present at once. The Save Attendance button submits the records, which then appear in the admin's attendance overview and on the student's attendance page. A success confirmation is shown briefly after saving.

---

## 4. Approve Attendance

This page lets teachers review and verify the attendance they have marked. It has three filter tabs: Pending (unverified records), Verified (confirmed records), and All. Each record shows the student name, date, status badge, and verification status. Teachers can:

- Verify a single record by clicking the shield icon
- Select multiple records with checkboxes and verify them in bulk
- Edit a record's status and verify it simultaneously using the clock icon
- Unverify a previously verified record using the X icon

This two-step process (mark then verify) ensures attendance accuracy before it becomes final.

---

## 5. My Routine

The weekly timetable shows all classes assigned to the teacher in a grid layout. Columns represent school days (Sunday through Thursday) and rows represent periods (1 through 6). Each cell shows the subject name, class section, and room number. Empty cells represent free periods. The routine is set by the admin and is view-only for the teacher.

---

## 6. Assignments

This page allows teachers to create assignments and review student submissions. It has two main sections:

**Create Assignment:** A button opens a modal form with fields for title, description, class (restricted to the teacher's assigned classes), subject, and due date. Form validation highlights required fields in red. On submission, the assignment is saved and appears in the student portal.

**Review Submissions:** The assignment list table shows title, class, subject, due date, and submission count. Clicking the View button on any row expands it to reveal a nested table of student submissions. Each submission shows the student name, submission date, response text, current score (if reviewed), and status badge (Pending in amber, Reviewed in green). For unreviewed submissions, a Review button opens a modal where the teacher enters a score and optional comment. On saving, the student's portal updates to show the score and teacher feedback.

---

## 7. Exam Entry

Teachers record student exam marks through this page. They select an exam and a class from dropdowns. Both dropdowns are filtered to show only exams and classes relevant to the teacher. The student list appears with columns for each subject in the exam, showing the full marks and pass marks below each subject header. Teachers enter marks directly into input fields for each student and subject.

Validation prevents marks below zero or above the full marks, with red error indicators on invalid cells. A total and percentage column update in real time as marks are entered. The Save Marks button stores all entries. Existing marks for the same exam and class are replaced. A confirmation message shows the number of students saved.

---

## 8. My Attendance

This page shows the teacher's own attendance records. Four stat cards display the total count of Present, Absent, Late, and Leave records. Below the stats, a table lists each record with date, status (color coded green, red, amber, blue), and source (manual or device). Attendance is marked by the admin or pulled from biometric devices. The teacher cannot modify these records.

---

## 9. Leave Requests

Teachers can submit and track their own leave applications. A New Leave Request button opens a form with start date, end date, leave type (Sick, Casual, Annual), and a reason field. Once submitted, the request appears in the table with its status: Pending (amber), Approved (green), or Rejected (red). The admin reviews and responds to leave requests from their Leave Management page.

---

## 10. Announcements

School announcements targeted at All, Teachers, or Staff audiences appear here. Each announcement card shows the title, publish date, audience badge, priority badge (High in red, Medium in amber, Low in blue), and the full content. This keeps teachers informed about school events and administrative notices.

---

## 11. Calendar

The calendar page displays school events organized into two tabs: General Calendar and Academic Calendar. General events include holidays and non-academic activities. Academic events include exams, parent-teacher meetings, and deadlines. Each event card shows the title, description, date, and type badge. Events are created by the admin and are view-only for teachers.
