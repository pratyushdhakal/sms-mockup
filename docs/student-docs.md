# SMS (School Management System) Student Portal

> **School:** Vidya School, Biratnagar, Morang, Nepal
> **Academic Year:** 2083

---

## 1. Dashboard

The student dashboard opens upon login. It shows the student's name and class section in the header. Three stat cards display the attendance percentage, number of pending assignments, and upcoming exams count. Below the stats, a Quick Links section provides one-click navigation to My Attendance, My Routine, Assignments, and My Results pages. This is the central hub for the student's daily activity overview.

---

## 2. My Attendance

This page displays the student's complete attendance history. Four stat cards at the top show the total count of Present, Absent, Late, and Leave records. A filterable table lists each record with date, status (color coded green for Present, red for Absent, amber for Late, blue for Leave), and source (manual or device). The student can filter by status using a dropdown or search by date. This is a read-only view; attendance is marked by teachers or the admin.

---

## 3. My Routine

The weekly timetable shows the student's class schedule in a grid format. Columns represent school days (Sunday through Thursday) and rows represent periods (1 through 6). Each cell displays the subject name, teacher name, and room number. If a slot is unassigned, it shows a dash. This helps the student prepare for the school day and know which teacher teaches which subject.

---

## 4. Assignments

The assignments page lists all tasks assigned to the student's class. Each card shows the title, subject, teacher, due date, and a status badge: Pending (amber) means not yet submitted, Submitted (sky) means delivered but not reviewed, Graded (emerald) means the teacher has scored it. If graded, the score appears next to a star icon.

A Submit button appears on each card only when the status is Pending. Clicking it opens a modal overlay with a required Response textarea and an optional File URL field. The student types their answer and clicks Submit. The submission is recorded immediately and the card updates: the button disappears, the badge changes to Submitted, and clicking the card now shows the submission date in the detail view. Later, when a teacher reviews and scores it, the badge changes to Graded and the score and teacher comment appear in the detail view.

---

## 5. My Results

Published exam results are displayed here. Each published exam appears as a card with the exam name and date range. Inside, a table lists every subject with the obtained marks, full marks, pass marks, percentage, letter grade (A+, A, B+, and so on), and pass/fail indicator (green check or red cross). A summary section at the bottom shows the total marks, overall percentage, and overall grade. Only results that the admin has published are visible to the student.

---

## 6. Leave Requests

This page allows the student to submit and track leave applications. A New Leave Request button opens a form with start date, end date, leave type (Sick, Casual, Annual, Maternity, Paternity, Unpaid), and a reason field. Once submitted, the request appears in the table with its status: Pending (amber), Approved (green), or Rejected (red). The admin reviews and responds to leave requests from their Leave Management page.

---

## 7. My Profile

The profile page displays the student's personal and academic details in a card grid. Fields include full name, email, phone, roll number, class, batch, gender, date of birth, blood group, nationality, religion, mother tongue, ethnic group, permanent and temporary addresses, parent names and occupations, guardian information, admission date, previous school, linked account email, and account status. All fields are read-only. The student cannot edit their profile; changes must be made by the admin.

---

## 8. Fee Details

This page shows the student's fee payment records. Three stat cards summarize the total fees, total paid amount (green), and outstanding balance (red if positive). Below the stats, a table lists each fee record with columns for amount, paid amount, status (Paid, Due, or Partial with matching color badges), and date. If no records exist, a message indicates no fee records found. This gives the student a clear picture of their financial standing with the school.

---

## 9. Announcements

School-wide announcements and notices appear here. The page filters announcements to show only those targeted at "All" or "Students" audiences. Each announcement card displays the title, content, priority badge (High in red, Medium in amber, Low in blue), audience label, and publish date. This keeps students informed about school events, policy changes, and important updates.

---

## 10. Calendar

The calendar page lists school events organized into two tabs: General (holidays, sports days, picnics) and Academic (exams, parent-teacher meetings, deadlines). Each event card shows the title, description, date, and type badge. Events are created by the admin and are view-only for students.
