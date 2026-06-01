# SMS (School Management System) Staff Portal

> **School:** Vidya School, Biratnagar, Morang, Nepal
> **Academic Year:** 2083

---

## 1. Dashboard

The staff dashboard provides a personal overview. Two stat cards show the staff member's attendance percentage and number of pending leave requests. A Today's Attendance section displays the current day's recorded status (Present, Absent, Late, Leave) and its source (manual or device), or "No record" if attendance has not been taken yet. Quick Links provide navigation to My Attendance and Leave Requests pages.

---

## 2. Inquiries

This module manages prospective student inquiries. It mirrors the admin inquiry module but is limited to creating and tracking inquiries. The page shows a table with columns for ID, type, candidate name, inquirer name, relationship, contact, status, date, and actions.

Key features:

- **New Inquiry:** A button opens a form with sections for inquirer information (name, email, mobile, phone, relationship), candidate information (name, gender), address (permanent), and inquiry details (type, description). The inquiry type uses a dropdown with predefined values: Admission, General Inquiry, Complaint, Feedback, Transfer, or Other.
- **Status Pipeline:** Inquiries follow a pipeline: New (fresh), Contacted (follow-up started), Converted (enrolled via admin), Lost (closed). For Admission-type inquiries with New status, a Contacted button appears to advance the inquiry. Once Contacted, the inquiry displays an "In Admissions" label and is handled by the admin from there.
- **View Details:** A View button opens a read-only dialog showing all inquiry information including inquirer details, candidate details, addresses, and inquiry metadata.

---

## 3. Intakes

This page displays admission intake batches in a read-only view. Four stat cards show total intakes, pending count, open/approved count, and total enrolled students versus total capacity. The table lists each intake with its ID, name, grade, academic year, capacity, enrolled count, occupancy bar with percentage, and status badge (Open or Closed). Filters allow searching by name or ID, filtering by status, and filtering by grade.

---

## 4. My Attendance

This page shows the staff member's own attendance records. Four stat cards display the total count of Present, Absent, Late, and Leave records. Below the stats, a table lists each record with date, status (color coded green for Present, red for Absent, amber for Late, blue for Leave), and source (manual or device). Attendance is marked by the admin or pulled from biometric devices. The staff member cannot modify these records.

---

## 5. Leave Requests

Staff members can submit and track their own leave applications. A New Leave Request button opens a form with start date, end date, leave type (Sick, Casual, Annual, Maternity, Paternity, Unpaid), and a reason field. Once submitted, the request appears in the table with its status: Pending (amber), Approved (green), or Rejected (red). The admin reviews and responds to leave requests from their Leave Management page.

---

## 6. Announcements

School announcements targeted at All, Staff, or Teachers audiences appear here. Each announcement card shows the title, content, priority badge (High in red, Medium in amber, Low in blue), audience label, and publish date. This keeps staff members informed about school events and administrative updates.

---

## 7. Calendar

The calendar page displays school events organized into two tabs: General and Academic. General events include holidays and non-academic activities. Academic events include exams, parent-teacher meetings, and deadlines. Each event card shows the title, description, date, and type badge. Events are created by the admin and are view-only for staff.
