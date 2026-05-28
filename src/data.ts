import type {
  User, Student, Teacher, StaffMember, AttendanceRecord, ClassGroup,
  Intake, LeaveRequest, RoutineSlot, Announcement, CalendarEvent,
  Exam, ExamMarks, Assignment, AssignmentSubmission, FeeRecord, ParentStudent, Inquiry, DeviceLog,
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

export const TEACHERS: Teacher[] = [];

export const STAFF: StaffMember[] = [];

export const STUDENTS: Student[] = [];

export const ATTENDANCE: AttendanceRecord[] = [];

export const DEVICE_LOGS: DeviceLog[] = [];

export const INTAKES: Intake[] = [
  { id: "I001", name: "Nursery Intake 2083", academicYear: "2083", grade: "Nursery", capacity: 40, enrolled: 0, status: "open", schoolId: "SCH001" },
  { id: "I002", name: "LKG Intake 2083", academicYear: "2083", grade: "LKG", capacity: 30, enrolled: 0, status: "open", schoolId: "SCH001" },
  { id: "I003", name: "Class 1 Intake 2083", academicYear: "2083", grade: "Class 1", capacity: 50, enrolled: 0, status: "open", schoolId: "SCH001" },
  { id: "I004", name: "Grade 4 Intake 2083", academicYear: "2083", grade: "Class 4", capacity: 45, enrolled: 0, status: "open", schoolId: "SCH001" },
];

export const INQUIRIES: Inquiry[] = [
  {
    id: "INQ-001", inquirerName: "Hari Poudel", inquirerEmail: "hari@email.com", inquirerMobile: "9800980260", inquirerPhone: "", relationship: "Father",
    candidateTitle: "Mr.", candidateName: "Aayush Poudel", candidateGender: "Male", candidateDob: "Jestha 15, 2075", candidateMobile: "", candidatePhone: "", candidateEmail: "", contactMethod: "Phone",
    permanentAddress: "Sundarharaicha, Morang", temporaryAddress: "",
    inquiryType: "New Admission", description: "Looking to enroll son in Class 4", outcome: "", assignedTo: "U005", outcomeDetails: "",
    status: "new", createdAt: "Baisakh 28, 2083", createdBy: "U005", schoolId: "SCH001",
  },
  {
    id: "INQ-002", inquirerName: "Sita Acharya", inquirerEmail: "sita@email.com", inquirerMobile: "9812345678", inquirerPhone: "", relationship: "Mother",
    candidateTitle: "Miss", candidateName: "Anjana Acharya", candidateGender: "Female", candidateDob: "Chaitra 10, 2076", candidateMobile: "", candidatePhone: "", candidateEmail: "", contactMethod: "Walk-in",
    permanentAddress: "Biratnagar, Morang", temporaryAddress: "",
    inquiryType: "New Admission", description: "Interested in Nursery admission", outcome: "", assignedTo: "U005", outcomeDetails: "",
    status: "new", createdAt: "Jestha 1, 2083", createdBy: "U005", schoolId: "SCH001",
  },
  {
    id: "INQ-003", inquirerName: "Ramesh Koirala", inquirerEmail: "ramesh@email.com", inquirerMobile: "9845678901", inquirerPhone: "", relationship: "Father",
    candidateTitle: "Mr.", candidateName: "Sagar Koirala", candidateGender: "Male", candidateDob: "Mangsir 5, 2074", candidateMobile: "", candidatePhone: "", candidateEmail: "", contactMethod: "Phone",
    permanentAddress: "Itahari, Sunsari", temporaryAddress: "",
    inquiryType: "New Admission", description: "Looking for Class 1 admission", outcome: "", assignedTo: "U005", outcomeDetails: "",
    status: "new", createdAt: "Jestha 3, 2083", createdBy: "U005", schoolId: "SCH001",
  },
  {
    id: "INQ-004", inquirerName: "Maya Gurung", inquirerEmail: "maya@email.com", inquirerMobile: "9856789012", inquirerPhone: "", relationship: "Mother",
    candidateTitle: "Miss", candidateName: "Riya Gurung", candidateGender: "Female", candidateDob: "Baisakh 20, 2076", candidateMobile: "", candidatePhone: "", candidateEmail: "", contactMethod: "Walk-in",
    permanentAddress: "Dharan, Sunsari", temporaryAddress: "",
    inquiryType: "New Admission", description: "Wants to enroll daughter in LKG", outcome: "", assignedTo: "U005", outcomeDetails: "",
    status: "new", createdAt: "Jestha 5, 2083", createdBy: "U005", schoolId: "SCH001",
  },
  {
    id: "INQ-005", inquirerName: "Krishna Thapa", inquirerEmail: "krishna@email.com", inquirerMobile: "9867890123", inquirerPhone: "", relationship: "Father",
    candidateTitle: "Mr.", candidateName: "Amar Thapa", candidateGender: "Male", candidateDob: "Poush 12, 2073", candidateMobile: "", candidatePhone: "", candidateEmail: "", contactMethod: "Referral",
    permanentAddress: "Urlabari, Morang", temporaryAddress: "",
    inquiryType: "New Admission", description: "Referred by neighbor, interested in Class 4", outcome: "", assignedTo: "U005", outcomeDetails: "",
    status: "new", createdAt: "Jestha 7, 2083", createdBy: "U005", schoolId: "SCH001",
  },
];

export const LEAVE_REQUESTS: LeaveRequest[] = [];

export const ROUTINE_SLOTS: RoutineSlot[] = [];

export const ANNOUNCEMENTS: Announcement[] = [
  { id: "N001", title: "Admissions Open for 2083", content: "Admissions are now open for Nursery through Grade 4 for the academic year 2083. Visit the school office for details.", audience: "all", priority: "high", publishDate: "2026-05-01", createdAt: "2026-04-28", schoolId: "SCH001" },
];

export const CALENDAR_EVENTS: CalendarEvent[] = [
  { id: "E001", title: "School Reopening", description: "New academic year begins", date: "2026-04-15", type: "academic", schoolId: "SCH001" },
  { id: "E002", title: "Admission Deadline", description: "Last date for admission applications", date: "2026-06-30", type: "academic", schoolId: "SCH001" },
  { id: "E003", title: "First Day of Classes", description: "Regular classes begin", date: "2026-07-01", type: "academic", schoolId: "SCH001" },
];

export const EXAMS: Exam[] = [
  { 
    id: "EXM001", 
    name: "First Terminal Exam 2083", 
    applicableClassIds: ["C007", "C008", "C009"], 
    startDate: "2083-04-01", 
    endDate: "2083-04-10", 
    subjects: [
      { name: "Mathematics", fullMarks: 100, passMarks: 40 },
      { name: "Science", fullMarks: 100, passMarks: 40 },
      { name: "English", fullMarks: 100, passMarks: 40 }
    ], 
    schoolId: "SCH001" 
  },
];

export const EXAM_MARKS: ExamMarks[] = [
  { 
    id: "MK001", 
    examId: "EXM001", 
    studentId: "STU001", 
    subjectMarks: { "Mathematics": 85, "Science": 90, "English": 78 }, 
    schoolId: "SCH001" 
  },
];

export const ASSIGNMENTS: Assignment[] = [];

export const SUBMISSIONS: AssignmentSubmission[] = [];

export const FEE_RECORDS: FeeRecord[] = [];

export const PARENT_STUDENT: ParentStudent[] = [];

export const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const PERIODS = [1, 2, 3, 4, 5, 6];
export const PUBLISHED_RESULTS: Record<string, boolean> = {};

export function setPublishedResult(key: string, value: boolean) {
  PUBLISHED_RESULTS[key] = value;
}

export const CLASSES_LIST = ["Nursery", "LKG", "UKG", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Grade 10"];
export const SECTIONS = ["Section A", "Section B", "Section C", "Section D"];
export const BATCHES = ["2080", "2081", "2082", "2083", "2084", "2085"];
