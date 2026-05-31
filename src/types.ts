export type UserRole = "admin" | "teacher" | "staff" | "student" | "parent";

export interface User {
  id: string;
  type: UserRole;
  email: string;
  password: string;
  name: string;
  phone: string;
  schoolId: string;
  avatar?: string;
  active: boolean;
}

export interface Student {
  id: string;
  name: string;
  classId: string;
  section: string;
  rollNumber: string;
  batch: string;
  phone: string;
  email: string;
  fee: FeeStatus;
  status: ActiveStatus;
  dob: string;
  gender: string;
  bloodGroup: string;
  nationality: string;
  religion: string;
  motherTongue: string;
  ethnicGroup: string;
  permanentAddress: string;
  temporaryAddress: string;
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  motherOccupation: string;
  guardianName: string;
  guardianContact: string;
  guardianRelation: string;
  parentEmail: string;
  previousSchool: string;
  admissionDate: string;
  schoolId: string;
  intakeId?: string;
  userId?: string;
}

export interface Teacher {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  subjectSpecialization: string;
  assignedClassIds: string[];
  joined: string;
  status: ActiveStatus;
  schoolId: string;
  // New fields
  title?: string;
  gender?: string;
  dob?: string;
  bloodGroup?: string;
  nationality?: string;
  religion?: string;
  ethnicGroup?: string;
  motherTongue?: string;
  maritalStatus?: string;
  designation?: string;
  jobType?: string;
  subDesignation?: string;
  department?: string;
  subDepartment?: string;
  branch?: string;
  level?: string;
  hireDate?: string;
  salary?: string;
  paymentMethod?: string;
  highestQualification?: string;
  experienceYears?: string;
  citizenshipNumber?: string;
  panNumber?: string;
  permanentAddress?: string;
  temporaryAddress?: string;
}

export interface StaffMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  department: string;
  joined: string;
  status: ActiveStatus;
  schoolId: string;
  // New fields
  employeeCode?: string;
  title?: string;
  gender?: string;
  dob?: string;
  bloodGroup?: string;
  nationality?: string;
  religion?: string;
  ethnicGroup?: string;
  motherTongue?: string;
  maritalStatus?: string;
  designation?: string;
  jobType?: string;
  subDesignation?: string;
  subDepartment?: string;
  branch?: string;
  level?: string;
  hireDate?: string;
  salary?: string;
  paymentMethod?: string;
  highestQualification?: string;
  experienceYears?: string;
  specialization?: string;
  citizenshipNumber?: string;
  panNumber?: string;
  permanentAddress?: string;
  temporaryAddress?: string;
  nameNepali?: string;
  officialEmail?: string;
  smsNumber?: string;
  username?: string;
  avatar?: string;
  residencyType?: string;
  staffType?: string;
  assignedClassIds?: string[];
}

export type StaffRole = "accountant" | "librarian" | "front_desk" | "admin_assistant" | "security" | "cleaner" | "other";

export type FeeStatus = "Paid" | "Due" | "Partial";
export type ActiveStatus = "Active" | "Inactive";
export type InquiryStatus = "new" | "contacted" | "converted" | "lost";

export interface Inquiry {
  id: string;
  inquirerName: string;
  inquirerEmail: string;
  inquirerMobile: string;
  inquirerPhone: string;
  relationship: string;
  candidateTitle?: string;
  candidateName?: string;
  candidateGender: string;
  candidateDob: string;
  candidateMobile: string;
  candidatePhone: string;
  candidateEmail: string;
  contactMethod: string;
  permanentAddress: string;
  temporaryAddress: string;
  inquiryType: string;
  description: string;
  outcome: string;
  assignedTo: string;
  outcomeDetails: string;
  status: InquiryStatus;
  createdAt: string;
  createdBy: string;
  schoolId: string;
}
export type AttendanceStatus = "Present" | "Absent" | "Late" | "Leave";
export type AttendanceSource = "manual" | "device";
export type LeaveType = "sick" | "casual" | "annual" | "maternity" | "paternity" | "unpaid";
export type LeaveStatus = "pending" | "approved" | "rejected";
export type AnnouncementAudience = "all" | "students" | "teachers" | "staff" | "parents";
export type Priority = "high" | "medium" | "low";

export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string;
  status: AttendanceStatus;
  source: AttendanceSource;
  markedBy: string;
  schoolId: string;
}

export interface DeviceLog {
  id: string;
  userId: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  schoolId: string;
}

export interface ClassGroup {
  id: string;
  name: string;
  section: string;
  teacherId: string;
  room: string;
  schoolId: string;
}

export interface Intake {
  id: string;
  name: string;
  academicYear: string;
  grade: string;
  capacity: number;
  enrolled: number;
  status: "open" | "closed";
  schoolId: string;
}

export interface LeaveRequest {
  id: string;
  userId: string;
  startDate: string;
  endDate: string;
  type: LeaveType;
  reason: string;
  status: LeaveStatus;
  adminNote?: string;
  schoolId: string;
}

export interface RoutineSlot {
  id: string;
  classId: string;
  day: string;
  period: number;
  subject: string;
  teacherId: string;
  room: string;
  schoolId: string;
  isHoliday?: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  audience: AnnouncementAudience;
  priority: Priority;
  publishDate: string;
  createdAt: string;
  schoolId: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  type: "general" | "academic";
  schoolId: string;
}

export interface Exam {
  id: string;
  name: string;
  applicableClassIds: string[];
  startDate: string;
  endDate: string;
  subjects: ExamSubject[];
  schoolId: string;
}

export interface ExamSubject {
  name: string;
  fullMarks: number;
  passMarks: number;
}

export interface ExamMarks {
  id: string;
  examId: string;
  studentId: string;
  subjectMarks: Record<string, number>;
  schoolId: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  classId: string;
  subject: string;
  teacherId: string;
  dueDate: string;
  batch: string; // Added batch
  fileUrl?: string;
  createdAt: string;
  schoolId: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  response: string;
  fileUrl?: string;
  submittedAt: string;
  score?: number;
  reviewed: boolean;
  comment?: string;
  schoolId: string;
}

export interface FeeRecord {
  id: string;
  studentId: string;
  amount: number;
  paid: number;
  status: FeeStatus;
  date: string;
  schoolId: string;
}

export interface ParentStudent {
  parentId: string;
  studentId: string;
}
