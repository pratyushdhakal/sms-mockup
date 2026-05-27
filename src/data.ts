import type {
  User, Student, Teacher, StaffMember, AttendanceRecord, ClassGroup,
  Intake, LeaveRequest, RoutineSlot, Announcement, CalendarEvent,
  Exam, ExamMarks, Assignment, AssignmentSubmission, FeeRecord, ParentStudent,
} from "./types";

export const MOCK_USERS: User[] = [
  { id: "U001", type: "admin", email: "admin", password: "admin", name: "Admin", phone: "9800000000", schoolId: "SCH001", active: true },
  { id: "U002", type: "teacher", email: "teacher", password: "teacher", name: "Ram Prasad KC", phone: "9800000001", schoolId: "SCH001", active: true },
  { id: "U003", type: "teacher", email: "sunita", password: "teacher", name: "Sunita Maharjan", phone: "9800000002", schoolId: "SCH001", active: true },
  { id: "U004", type: "teacher", email: "kamala", password: "teacher", name: "Kamala Adhikari", phone: "9800000003", schoolId: "SCH001", active: true },
  { id: "U005", type: "staff", email: "staff", password: "staff", name: "Gopal Shrestha", phone: "9800000004", schoolId: "SCH001", active: true },
  { id: "U006", type: "staff", email: "binod", password: "staff", name: "Binod Karmacharya", phone: "9800000005", schoolId: "SCH001", active: true },
  { id: "U007", type: "student", email: "student", password: "student", name: "Yuwansh Magar", phone: "9800000006", schoolId: "SCH001", active: true },
  { id: "U008", type: "student", email: "bijans", password: "student", name: "Bijan Shakya", phone: "9800000007", schoolId: "SCH001", active: true },
  { id: "U009", type: "parent", email: "parent", password: "parent", name: "Parent", phone: "9800000008", schoolId: "SCH001", active: true },
  { id: "U010", type: "student", email: "aarav", password: "student", name: "Aarav Sharma", phone: "9800000009", schoolId: "SCH001", active: true },
  { id: "U011", type: "student", email: "priya", password: "student", name: "Priya Thapa", phone: "9800000010", schoolId: "SCH001", active: true },
];

export const CLASS_GROUPS: ClassGroup[] = [
  { id: "C001", name: "Nursery", section: "Section A", teacherId: "U002", room: "101", schoolId: "SCH001" },
  { id: "C002", name: "LKG", section: "Section A", teacherId: "U003", room: "102", schoolId: "SCH001" },
  { id: "C003", name: "UKG", section: "Section A", teacherId: "U004", room: "103", schoolId: "SCH001" },
  { id: "C004", name: "Class 1", section: "Section A", teacherId: "U002", room: "104", schoolId: "SCH001" },
  { id: "C005", name: "Class 2", section: "Section A", teacherId: "U003", room: "105", schoolId: "SCH001" },
  { id: "C006", name: "Class 3", section: "Section A", teacherId: "U004", room: "106", schoolId: "SCH001" },
  { id: "C007", name: "Grade 10", section: "Section A", teacherId: "U002", room: "201", schoolId: "SCH001" },
  { id: "C008", name: "Grade 10", section: "Section B", teacherId: "U003", room: "202", schoolId: "SCH001" },
  { id: "C009", name: "Grade 9", section: "Section A", teacherId: "U004", room: "203", schoolId: "SCH001" },
];

export const TEACHERS: Teacher[] = [
  { id: "T001", userId: "U002", name: "Ram Prasad KC", email: "ram@school.com", phone: "9800000001", subjectSpecialization: "Mathematics", assignedClassIds: ["C001", "C004", "C007"], joined: "2020-03-15", status: "Active", schoolId: "SCH001" },
  { id: "T002", userId: "U003", name: "Sunita Maharjan", email: "sunita@school.com", phone: "9800000002", subjectSpecialization: "Science", assignedClassIds: ["C002", "C005", "C008"], joined: "2019-07-01", status: "Active", schoolId: "SCH001" },
  { id: "T003", userId: "U004", name: "Kamala Adhikari", email: "kamala@school.com", phone: "9800000003", subjectSpecialization: "English", assignedClassIds: ["C003", "C006", "C009"], joined: "2022-04-20", status: "Active", schoolId: "SCH001" },
];


export const STAFF: StaffMember[] = [
  { id: "S001", userId: "U005", name: "Gopal Shrestha", email: "gopal@school.com", phone: "9800000004", role: "accountant", department: "Finance", joined: "2021-01-10", status: "Active", schoolId: "SCH001" },
  { id: "S002", userId: "U006", name: "Binod Karmacharya", email: "binod@school.com", phone: "9800000005", role: "librarian", department: "Library", joined: "2020-08-05", status: "Inactive", schoolId: "SCH001" },
];

export const STUDENTS: Student[] = [
  { id: "STU-601", name: "Yuwansh Magar", classId: "C003", section: "Section A", rollNumber: "01", batch: "2083", phone: "98XXXXXXXX", email: "yuwansh@email.com", fee: "Paid", status: "Active", dob: "", gender: "", bloodGroup: "", nationality: "", religion: "", motherTongue: "", ethnicGroup: "", permanentAddress: "", temporaryAddress: "", fatherName: "", fatherOccupation: "", motherName: "", motherOccupation: "", guardianName: "", guardianContact: "", guardianRelation: "", parentEmail: "", previousSchool: "", admissionDate: "", schoolId: "SCH001", userId: "U007" },
  { id: "STU-602", name: "Bijan Shakya", classId: "C001", section: "Section A", rollNumber: "02", batch: "2085", phone: "98XXXXXXXX", email: "bijan@email.com", fee: "Paid", status: "Active", dob: "", gender: "", bloodGroup: "", nationality: "", religion: "", motherTongue: "", ethnicGroup: "", permanentAddress: "", temporaryAddress: "", fatherName: "", fatherOccupation: "", motherName: "", motherOccupation: "", guardianName: "", guardianContact: "", guardianRelation: "", parentEmail: "", previousSchool: "", admissionDate: "", schoolId: "SCH001", userId: "U008" },
  { id: "STU-603", name: "Aarav Sharma", classId: "C007", section: "Section A", rollNumber: "03", batch: "2083", phone: "98XXXXXXXX", email: "aarav@email.com", fee: "Paid", status: "Active", dob: "", gender: "", bloodGroup: "", nationality: "", religion: "", motherTongue: "", ethnicGroup: "", permanentAddress: "", temporaryAddress: "", fatherName: "", fatherOccupation: "", motherName: "", motherOccupation: "", guardianName: "", guardianContact: "", guardianRelation: "", parentEmail: "", previousSchool: "", admissionDate: "", schoolId: "SCH001", userId: "U010" },
  { id: "STU-604", name: "Priya Thapa", classId: "C009", section: "Section A", rollNumber: "04", batch: "2083", phone: "98XXXXXXXX", email: "priya@email.com", fee: "Due", status: "Active", dob: "", gender: "", bloodGroup: "", nationality: "", religion: "", motherTongue: "", ethnicGroup: "", permanentAddress: "", temporaryAddress: "", fatherName: "", fatherOccupation: "", motherName: "", motherOccupation: "", guardianName: "", guardianContact: "", guardianRelation: "", parentEmail: "", previousSchool: "", admissionDate: "", schoolId: "SCH001", userId: "U011" },
  { id: "STU-605", name: "Ert Ert", classId: "C004", section: "Section A", rollNumber: "05", batch: "2083", phone: "97XXXXXXXX", email: "ert@email.com", fee: "Due", status: "Active", dob: "", gender: "", bloodGroup: "", nationality: "", religion: "", motherTongue: "", ethnicGroup: "", permanentAddress: "", temporaryAddress: "", fatherName: "", fatherOccupation: "", motherName: "", motherOccupation: "", guardianName: "", guardianContact: "", guardianRelation: "", parentEmail: "", previousSchool: "", admissionDate: "", schoolId: "SCH001" },
];

export const ATTENDANCE: AttendanceRecord[] = [
  { id: "A001", userId: "U007", date: "2026-05-26", status: "Present", source: "manual", markedBy: "U002", schoolId: "SCH001" },
  { id: "A002", userId: "U008", date: "2026-05-26", status: "Present", source: "manual", markedBy: "U002", schoolId: "SCH001" },
  { id: "A003", userId: "U010", date: "2026-05-26", status: "Absent", source: "manual", markedBy: "U002", schoolId: "SCH001" },
  { id: "A004", userId: "U011", date: "2026-05-26", status: "Late", source: "manual", markedBy: "U002", schoolId: "SCH001" },
  { id: "A005", userId: "U007", date: "2026-05-25", status: "Present", source: "device", markedBy: "device", schoolId: "SCH001" },
  { id: "A006", userId: "U008", date: "2026-05-25", status: "Present", source: "device", markedBy: "device", schoolId: "SCH001" },
  { id: "A007", userId: "U002", date: "2026-05-26", status: "Present", source: "manual", markedBy: "U001", schoolId: "SCH001" },
  { id: "A008", userId: "U003", date: "2026-05-26", status: "Present", source: "manual", markedBy: "U001", schoolId: "SCH001" },
  { id: "A009", userId: "U005", date: "2026-05-26", status: "Present", source: "manual", markedBy: "U001", schoolId: "SCH001" },
];

export const INTAKES: Intake[] = [
  { id: "I001", name: "Grade 10 Intake 2082", academicYear: "2082", grade: "Grade 10", capacity: 80, enrolled: 72, status: "closed", schoolId: "SCH001" },
  { id: "I002", name: "Grade 1 Intake 2083", academicYear: "2083", grade: "Class 1", capacity: 60, enrolled: 45, status: "open", schoolId: "SCH001" },
  { id: "I003", name: "Nursery Intake 2083", academicYear: "2083", grade: "Nursery", capacity: 40, enrolled: 28, status: "open", schoolId: "SCH001" },
];

export const LEAVE_REQUESTS: LeaveRequest[] = [
  { id: "L001", userId: "U002", startDate: "2026-06-01", endDate: "2026-06-02", type: "sick", reason: "Fever", status: "approved", schoolId: "SCH001" },
  { id: "L002", userId: "U003", startDate: "2026-06-10", endDate: "2026-06-10", type: "casual", reason: "Personal work", status: "pending", schoolId: "SCH001" },
  { id: "L003", userId: "U005", startDate: "2026-06-15", endDate: "2026-06-17", type: "annual", reason: "Family event", status: "pending", schoolId: "SCH001" },
  { id: "L004", userId: "U007", startDate: "2026-06-05", endDate: "2026-06-05", type: "sick", reason: "Not feeling well", status: "pending", schoolId: "SCH001" },
];

export const ROUTINE_SLOTS: RoutineSlot[] = [
  { id: "R001", classId: "C007", day: "Sunday", period: 1, subject: "Mathematics", teacherId: "U002", room: "201", schoolId: "SCH001" },
  { id: "R002", classId: "C007", day: "Sunday", period: 2, subject: "Science", teacherId: "U003", room: "201", schoolId: "SCH001" },
  { id: "R003", classId: "C007", day: "Sunday", period: 3, subject: "English", teacherId: "U004", room: "201", schoolId: "SCH001" },
  { id: "R004", classId: "C007", day: "Monday", period: 1, subject: "English", teacherId: "U004", room: "201", schoolId: "SCH001" },
  { id: "R005", classId: "C007", day: "Monday", period: 2, subject: "Mathematics", teacherId: "U002", room: "201", schoolId: "SCH001" },
  { id: "R006", classId: "C007", day: "Monday", period: 3, subject: "Science", teacherId: "U003", room: "201", schoolId: "SCH001" },
  { id: "R007", classId: "C007", day: "Tuesday", period: 1, subject: "Science", teacherId: "U003", room: "201", schoolId: "SCH001" },
  { id: "R008", classId: "C007", day: "Tuesday", period: 2, subject: "Mathematics", teacherId: "U002", room: "201", schoolId: "SCH001" },
  { id: "R009", classId: "C007", day: "Tuesday", period: 3, subject: "English", teacherId: "U004", room: "201", schoolId: "SCH001" },
];

export const ANNOUNCEMENTS: Announcement[] = [
  { id: "N001", title: "Annual Day Celebration", content: "Annual day will be held on June 15th. All students and parents are cordially invited.", audience: "all", priority: "high", publishDate: "2026-05-26", createdAt: "2026-05-25", schoolId: "SCH001" },
  { id: "N002", title: "Exam Schedule — Grade 10 Final", content: "Grade 10 final exam starts from June 20th.", audience: "students", priority: "high", publishDate: "2026-05-20", createdAt: "2026-05-19", schoolId: "SCH001" },
  { id: "N003", title: "Parent-Teacher Meeting", content: "Parent-teacher meeting is scheduled for May 30th.", audience: "parents", priority: "medium", publishDate: "2026-05-18", createdAt: "2026-05-17", schoolId: "SCH001" },
  { id: "N004", title: "Staff Training Workshop", content: "Workshop on new teaching methodology on June 5th.", audience: "staff", priority: "low", publishDate: "2026-05-15", createdAt: "2026-05-14", schoolId: "SCH001" },
];

export const CALENDAR_EVENTS: CalendarEvent[] = [
  { id: "E001", title: "School Reopening", description: "Summer break ends", date: "2026-01-15", type: "academic", schoolId: "SCH001" },
  { id: "E002", title: "Sports Day", description: "Annual sports competition", date: "2026-03-20", type: "general", schoolId: "SCH001" },
  { id: "E003", title: "First Terminal Exam", description: "Exam starts", date: "2026-02-10", type: "academic", schoolId: "SCH001" },
  { id: "E004", title: "Parent-Teacher Meeting", description: "PTM for all grades", date: "2026-05-30", type: "general", schoolId: "SCH001" },
  { id: "E005", title: "Summer Vacation", description: "Summer break begins", date: "2026-07-01", type: "academic", schoolId: "SCH001" },
];

export const EXAMS: Exam[] = [
  { id: "EX001", name: "First Terminal Exam", applicableClassIds: ["C001", "C002", "C003", "C004", "C005", "C006", "C007", "C008", "C009"], startDate: "2026-02-10", endDate: "2026-02-20", subjects: [{ name: "Mathematics", fullMarks: 100, passMarks: 40 }, { name: "Science", fullMarks: 100, passMarks: 40 }, { name: "English", fullMarks: 100, passMarks: 40 }], schoolId: "SCH001" },
  { id: "EX002", name: "Final Exam", applicableClassIds: ["C007", "C008", "C009"], startDate: "2026-06-20", endDate: "2026-06-30", subjects: [{ name: "Mathematics", fullMarks: 100, passMarks: 40 }, { name: "Science", fullMarks: 100, passMarks: 40 }, { name: "English", fullMarks: 100, passMarks: 40 }, { name: "Social Studies", fullMarks: 100, passMarks: 40 }], schoolId: "SCH001" },
];

export const EXAM_MARKS: ExamMarks[] = [
  { id: "EM001", examId: "EX001", studentId: "STU-601", subjectMarks: { Mathematics: 85, Science: 78, English: 92 }, schoolId: "SCH001" },
  { id: "EM002", examId: "EX001", studentId: "STU-602", subjectMarks: { Mathematics: 72, Science: 65, English: 81 }, schoolId: "SCH001" },
  { id: "EM003", examId: "EX001", studentId: "STU-603", subjectMarks: { Mathematics: 95, Science: 88, English: 90 }, schoolId: "SCH001" },
  { id: "EM004", examId: "EX001", studentId: "STU-604", subjectMarks: { Mathematics: 45, Science: 52, English: 38 }, schoolId: "SCH001" },
];

export const ASSIGNMENTS: Assignment[] = [
  { id: "AS001", title: "Algebra Practice Set", description: "Solve problems 1-20 from Chapter 5", classId: "C007", subject: "Mathematics", teacherId: "U002", dueDate: "2026-06-05", createdAt: "2026-05-26", schoolId: "SCH001" },
  { id: "AS002", title: "Essay on Climate Change", description: "Write a 500-word essay on climate change and its impact.", classId: "C009", subject: "English", teacherId: "U004", dueDate: "2026-06-10", fileUrl: "", createdAt: "2026-05-25", schoolId: "SCH001" },
  { id: "AS003", title: "Lab Report: Photosynthesis", description: "Submit the lab report on photosynthesis experiment.", classId: "C008", subject: "Science", teacherId: "U003", dueDate: "2026-06-07", createdAt: "2026-05-24", schoolId: "SCH001" },
];

export const SUBMISSIONS: AssignmentSubmission[] = [
  { id: "SUB001", assignmentId: "AS001", studentId: "STU-601", response: "Submitted PDF", submittedAt: "2026-06-03", reviewed: true, score: 85, comment: "Good work", schoolId: "SCH001" },
  { id: "SUB002", assignmentId: "AS001", studentId: "STU-603", response: "Submitted PDF", submittedAt: "2026-06-04", reviewed: false, schoolId: "SCH001" },
];

export const FEE_RECORDS: FeeRecord[] = [
  { id: "FR001", studentId: "STU-601", amount: 12500, paid: 12500, status: "Paid", date: "2026-05-01", schoolId: "SCH001" },
  { id: "FR002", studentId: "STU-603", amount: 12500, paid: 0, status: "Due", date: "-", schoolId: "SCH001" },
  { id: "FR003", studentId: "STU-602", amount: 10500, paid: 10500, status: "Paid", date: "2026-04-28", schoolId: "SCH001" },
  { id: "FR004", studentId: "STU-604", amount: 11000, paid: 0, status: "Due", date: "-", schoolId: "SCH001" },
  { id: "FR005", studentId: "STU-605", amount: 9500, paid: 9500, status: "Paid", date: "2026-04-30", schoolId: "SCH001" },
];

export const PARENT_STUDENT: ParentStudent[] = [
  { parentId: "U009", studentId: "STU-601" },
  { parentId: "U009", studentId: "STU-603" },
];

export const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const PERIODS = [1, 2, 3, 4, 5, 6];
export const CLASSES_LIST = ["Nursery", "LKG", "UKG", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Grade 10"];
export const SECTIONS = ["Section A", "Section B", "Section C", "Section D"];
export const BATCHES = ["2080", "2081", "2082", "2083", "2084", "2085"];
