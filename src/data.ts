import type {
  User, Student, Teacher, StaffMember, AttendanceRecord, ClassGroup,
  Intake, LeaveRequest, RoutineSlot, Announcement, CalendarEvent,
  Exam, ExamMarks, Assignment, AssignmentSubmission, FeeRecord, ParentStudent, Inquiry, DeviceLog,
  Subject, FeeType, GradingScale, ReferenceDatum, SchoolConfig,
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
  { id: "T001", userId: "U002", name: "Ram Prasad KC", email: "ram@school.edu", phone: "9800000001", subjectSpecialization: "Mathematics", assignedClassIds: ["C001", "C004", "C007"], joined: "2080-01-01", status: "Active", schoolId: "SCH001" },
  { id: "T002", userId: "U003", name: "Sunita Maharjan", email: "sunita@school.edu", phone: "9800000002", subjectSpecialization: "Science", assignedClassIds: ["C002", "C005", "C008"], joined: "2080-01-01", status: "Active", schoolId: "SCH001" },
  { id: "T003", userId: "U004", name: "Kamala Adhikari", email: "kamala@school.edu", phone: "9800000003", subjectSpecialization: "English", assignedClassIds: ["C003", "C006", "C009"], joined: "2080-01-01", status: "Active", schoolId: "SCH001" },
];

export const STAFF: StaffMember[] = [
  {
    id: "S001", userId: "U005", name: "Gopal Shrestha", email: "gopal@school.edu", phone: "9800000004",
    role: "accountant", department: "Finance", joined: "2080-01-01", status: "Active", schoolId: "SCH001",
    employeeCode: "EMP001", title: "Mr.", gender: "Male", dob: "2040-05-15", bloodGroup: "O+",
    nationality: "Nepali", religion: "Hindu", ethnicGroup: "Shrestha", motherTongue: "Nepali",
    maritalStatus: "Married", designation: "Senior Accountant", jobType: "Permanent",
    subDesignation: "", subDepartment: "Accounts", branch: "Main", level: "Senior",
    hireDate: "2080-01-01", salary: "45000", paymentMethod: "Bank Transfer",
    highestQualification: "BBA", experienceYears: "5", specialization: "Accounting",
    citizenshipNumber: "45-01-23456789", panNumber: "123456789",
    permanentAddress: "Biratnagar, Morang", temporaryAddress: "",
    nameNepali: "गोपाल श्रेष्ठ", officialEmail: "gopal@school.edu.np", smsNumber: "9800000004",
    username: "gopal.shrestha", avatar: "", residencyType: "Local", staffType: "Non-Teaching",
    assignedClassIds: [],
  },
  {
    id: "S002", userId: "U006", name: "Binod Karmacharya", email: "binod@school.edu", phone: "9800000005",
    role: "librarian", department: "Library", joined: "2080-01-01", status: "Active", schoolId: "SCH001",
    employeeCode: "EMP002", title: "Mr.", gender: "Male", dob: "2042-08-20", bloodGroup: "A+",
    nationality: "Nepali", religion: "Hindu", ethnicGroup: "Karmacharya", motherTongue: "Nepali",
    maritalStatus: "Unmarried", designation: "Librarian", jobType: "Permanent",
    subDesignation: "", subDepartment: "", branch: "Main", level: "Junior",
    hireDate: "2080-06-01", salary: "35000", paymentMethod: "Bank Transfer",
    highestQualification: "B.Lib.Sc", experienceYears: "3", specialization: "Library Science",
    citizenshipNumber: "45-02-34567890", panNumber: "234567890",
    permanentAddress: "Dharan, Sunsari", temporaryAddress: "",
    nameNepali: "बिनोद कर्माचार्य", officialEmail: "binod@school.edu.np", smsNumber: "9800000005",
    username: "binod.karmacharya", avatar: "", residencyType: "Local", staffType: "Non-Teaching",
    assignedClassIds: [],
  },
  {
    id: "S003", userId: "", name: "Sita Acharya", email: "sita.acharya@school.edu", phone: "9812345678",
    role: "front_desk", department: "Administration", joined: "2081-04-01", status: "Active", schoolId: "SCH001",
    employeeCode: "EMP003", title: "Mrs.", gender: "Female", dob: "2045-12-10", bloodGroup: "B+",
    nationality: "Nepali", religion: "Hindu", ethnicGroup: "Acharya", motherTongue: "Nepali",
    maritalStatus: "Married", designation: "Front Desk Officer", jobType: "Contract",
    subDesignation: "", subDepartment: "Reception", branch: "Main", level: "Junior",
    hireDate: "2081-04-01", salary: "25000", paymentMethod: "Cash",
    highestQualification: "BA", experienceYears: "2", specialization: "Administration",
    citizenshipNumber: "45-03-45678901", panNumber: "345678901",
    permanentAddress: "Itahari, Sunsari", temporaryAddress: "",
    nameNepali: "सीता अचार्य", officialEmail: "sita@school.edu.np", smsNumber: "9812345678",
    username: "sita.acharya", avatar: "", residencyType: "Local", staffType: "Teaching",
    assignedClassIds: ["C001", "C002", "C003"],
  },
];

export const STUDENTS: Student[] = [
  { id: "STU-601", name: "Yuwansh Magar", classId: "C003", section: "Section A", rollNumber: "1", batch: "2083", phone: "9800000006", email: "yuwansh@email.com", fee: "Paid", status: "Active", dob: "2075-05-15", gender: "Male", bloodGroup: "O+", nationality: "Nepali", religion: "Hindu", motherTongue: "Nepali", ethnicGroup: "Magar", permanentAddress: "Biratnagar, Morang", temporaryAddress: "", fatherName: "Hari Magar", fatherOccupation: "Teacher", motherName: "Sita Magar", motherOccupation: "Housewife", guardianName: "Hari Magar", guardianContact: "9800000012", guardianRelation: "Father", parentEmail: "parent@email.com", previousSchool: "", admissionDate: "2083-01-01", schoolId: "SCH001", userId: "U007" },
  { id: "STU-602", name: "Bijan Shakya", classId: "C003", section: "Section A", rollNumber: "2", batch: "2083", phone: "9800000007", email: "bijan@email.com", fee: "Paid", status: "Active", dob: "2075-08-20", gender: "Male", bloodGroup: "A+", nationality: "Nepali", religion: "Buddhist", motherTongue: "Nepali", ethnicGroup: "Shakya", permanentAddress: "Dharan, Sunsari", temporaryAddress: "", fatherName: "Rajan Shakya", fatherOccupation: "Business", motherName: "Anita Shakya", motherOccupation: "Housewife", guardianName: "Rajan Shakya", guardianContact: "9800000013", guardianRelation: "Father", parentEmail: "", previousSchool: "", admissionDate: "2083-01-01", schoolId: "SCH001", userId: "U008" },
  { id: "STU-603", name: "Aarav Sharma", classId: "C004", section: "Section A", rollNumber: "1", batch: "2083", phone: "9800000009", email: "aarav@email.com", fee: "Paid", status: "Active", dob: "2074-03-10", gender: "Male", bloodGroup: "B+", nationality: "Nepali", religion: "Hindu", motherTongue: "Nepali", ethnicGroup: "Sharma", permanentAddress: "Itahari, Sunsari", temporaryAddress: "", fatherName: "Ramesh Sharma", fatherOccupation: "Engineer", motherName: "Pooja Sharma", motherOccupation: "Nurse", guardianName: "Ramesh Sharma", guardianContact: "9800000014", guardianRelation: "Father", parentEmail: "", previousSchool: "Sunshine School", admissionDate: "2083-01-01", schoolId: "SCH001", userId: "U010" },
  { id: "STU-604", name: "Priya Thapa", classId: "C007", section: "Section A", rollNumber: "5", batch: "2083", phone: "9800000010", email: "priya@email.com", fee: "Partial", status: "Active", dob: "2065-12-25", gender: "Female", bloodGroup: "AB+", nationality: "Nepali", religion: "Hindu", motherTongue: "Nepali", ethnicGroup: "Thapa", permanentAddress: "Urlabari, Morang", temporaryAddress: "", fatherName: "Krishna Thapa", fatherOccupation: "Farmer", motherName: "Maya Thapa", motherOccupation: "Housewife", guardianName: "Krishna Thapa", guardianContact: "9800000015", guardianRelation: "Father", parentEmail: "", previousSchool: "Everest Academy", admissionDate: "2083-01-01", schoolId: "SCH001", userId: "U011" },
];

export const ATTENDANCE: AttendanceRecord[] = [
  { id: "AT001", userId: "U007", date: "2083-02-01", status: "Present", source: "manual", markedBy: "U001", schoolId: "SCH001" },
  { id: "AT002", userId: "U008", date: "2083-02-01", status: "Present", source: "manual", markedBy: "U001", schoolId: "SCH001" },
  { id: "AT003", userId: "U010", date: "2083-02-01", status: "Present", source: "manual", markedBy: "U001", schoolId: "SCH001" },
  { id: "AT004", userId: "U011", date: "2083-02-01", status: "Late", source: "manual", markedBy: "U001", schoolId: "SCH001" },
  { id: "AT005", userId: "U002", date: "2083-02-01", status: "Present", source: "device", markedBy: "U001", schoolId: "SCH001" },
  { id: "AT006", userId: "U003", date: "2083-02-01", status: "Present", source: "device", markedBy: "U001", schoolId: "SCH001" },
  { id: "AT007", userId: "U004", date: "2083-02-01", status: "Present", source: "device", markedBy: "U001", schoolId: "SCH001" },
  { id: "AT008", userId: "U005", date: "2083-02-01", status: "Present", source: "device", markedBy: "U001", schoolId: "SCH001" },
  { id: "AT009", userId: "U007", date: "2083-02-02", status: "Present", source: "device", markedBy: "U001", schoolId: "SCH001" },
  { id: "AT010", userId: "U008", date: "2083-02-02", status: "Present", source: "device", markedBy: "U001", schoolId: "SCH001" },
  { id: "AT011", userId: "U010", date: "2083-02-02", status: "Absent", source: "manual", markedBy: "U001", schoolId: "SCH001" },
  { id: "AT012", userId: "U011", date: "2083-02-02", status: "Present", source: "device", markedBy: "U001", schoolId: "SCH001" },
  { id: "AT013", userId: "U002", date: "2083-02-02", status: "Present", source: "device", markedBy: "U001", schoolId: "SCH001" },
  { id: "AT014", userId: "U003", date: "2083-02-02", status: "Present", source: "device", markedBy: "U001", schoolId: "SCH001" },
  { id: "AT015", userId: "U004", date: "2083-02-02", status: "Present", source: "device", markedBy: "U001", schoolId: "SCH001" },
  { id: "AT016", userId: "U005", date: "2083-02-02", status: "Present", source: "device", markedBy: "U001", schoolId: "SCH001" },
  { id: "AT017", userId: "U007", date: "2083-02-03", status: "Present", source: "device", markedBy: "U001", schoolId: "SCH001" },
  { id: "AT018", userId: "U008", date: "2083-02-03", status: "Late", source: "device", markedBy: "U001", schoolId: "SCH001" },
  { id: "AT019", userId: "U010", date: "2083-02-03", status: "Present", source: "manual", markedBy: "U001", schoolId: "SCH001" },
  { id: "AT020", userId: "U011", date: "2083-02-03", status: "Present", source: "device", markedBy: "U001", schoolId: "SCH001" },
  { id: "AT021", userId: "U002", date: "2083-02-03", status: "Present", source: "device", markedBy: "U001", schoolId: "SCH001" },
  { id: "AT022", userId: "U003", date: "2083-02-03", status: "Leave", source: "manual", markedBy: "U001", schoolId: "SCH001" },
  { id: "AT023", userId: "U004", date: "2083-02-03", status: "Present", source: "device", markedBy: "U001", schoolId: "SCH001" },
  { id: "AT024", userId: "U005", date: "2083-02-03", status: "Present", source: "device", markedBy: "U001", schoolId: "SCH001" },
  { id: "AT025", userId: "U007", date: "2083-02-04", status: "Absent", source: "manual", markedBy: "U001", schoolId: "SCH001" },
  { id: "AT026", userId: "U008", date: "2083-02-04", status: "Present", source: "device", markedBy: "U001", schoolId: "SCH001" },
  { id: "AT027", userId: "U010", date: "2083-02-04", status: "Present", source: "device", markedBy: "U001", schoolId: "SCH001" },
  { id: "AT028", userId: "U011", date: "2083-02-04", status: "Present", source: "device", markedBy: "U001", schoolId: "SCH001" },
  { id: "AT029", userId: "U002", date: "2083-02-04", status: "Present", source: "device", markedBy: "U001", schoolId: "SCH001" },
  { id: "AT030", userId: "U003", date: "2083-02-04", status: "Present", source: "device", markedBy: "U001", schoolId: "SCH001" },
  { id: "AT031", userId: "U004", date: "2083-02-04", status: "Present", source: "device", markedBy: "U001", schoolId: "SCH001" },
  { id: "AT032", userId: "U005", date: "2083-02-04", status: "Absent", source: "manual", markedBy: "U001", schoolId: "SCH001" },
  { id: "AT033", userId: "U007", date: "2083-02-05", status: "Present", source: "device", markedBy: "U001", schoolId: "SCH001" },
  { id: "AT034", userId: "U008", date: "2083-02-05", status: "Present", source: "device", markedBy: "U001", schoolId: "SCH001" },
  { id: "AT035", userId: "U010", date: "2083-02-05", status: "Present", source: "device", markedBy: "U001", schoolId: "SCH001" },
  { id: "AT036", userId: "U011", date: "2083-02-05", status: "Present", source: "device", markedBy: "U001", schoolId: "SCH001" },
  { id: "AT037", userId: "U002", date: "2083-02-05", status: "Present", source: "device", markedBy: "U001", schoolId: "SCH001" },
  { id: "AT038", userId: "U003", date: "2083-02-05", status: "Present", source: "device", markedBy: "U001", schoolId: "SCH001" },
  { id: "AT039", userId: "U004", date: "2083-02-05", status: "Present", source: "device", markedBy: "U001", schoolId: "SCH001" },
  { id: "AT040", userId: "U005", date: "2083-02-05", status: "Present", source: "device", markedBy: "U001", schoolId: "SCH001" },
];

export const DEVICE_LOGS: DeviceLog[] = [
  { id: "DL001", userId: "U002", date: "2083-02-01", checkIn: "07:45", checkOut: "15:30", schoolId: "SCH001" },
  { id: "DL002", userId: "U003", date: "2083-02-01", checkIn: "07:50", checkOut: "15:45", schoolId: "SCH001" },
  { id: "DL003", userId: "U004", date: "2083-02-01", checkIn: "07:40", checkOut: "15:20", schoolId: "SCH001" },
  { id: "DL004", userId: "U005", date: "2083-02-01", checkIn: "08:00", checkOut: "16:30", schoolId: "SCH001" },
  { id: "DL005", userId: "U006", date: "2083-02-01", checkIn: "08:15", checkOut: "16:00", schoolId: "SCH001" },
  { id: "DL006", userId: "U007", date: "2083-02-01", checkIn: "07:55", checkOut: "14:30", schoolId: "SCH001" },
  { id: "DL007", userId: "U008", date: "2083-02-01", checkIn: "07:58", checkOut: "14:30", schoolId: "SCH001" },
  { id: "DL008", userId: "U010", date: "2083-02-01", checkIn: "07:50", checkOut: "14:30", schoolId: "SCH001" },
  { id: "DL009", userId: "U011", date: "2083-02-01", checkIn: "08:05", checkOut: "14:30", schoolId: "SCH001" },
  { id: "DL010", userId: "U002", date: "2083-02-02", checkIn: "07:42", checkOut: "15:25", schoolId: "SCH001" },
  { id: "DL011", userId: "U003", date: "2083-02-02", checkIn: "07:46", checkOut: "15:40", schoolId: "SCH001" },
  { id: "DL012", userId: "U004", date: "2083-02-02", checkIn: "07:38", checkOut: "15:15", schoolId: "SCH001" },
  { id: "DL013", userId: "U005", date: "2083-02-02", checkIn: "07:55", checkOut: "16:20", schoolId: "SCH001" },
  { id: "DL014", userId: "U006", date: "2083-02-02", checkIn: "08:10", checkOut: "16:00", schoolId: "SCH001" },
  { id: "DL015", userId: "U007", date: "2083-02-02", checkIn: "07:50", checkOut: "14:30", schoolId: "SCH001" },
  { id: "DL016", userId: "U008", date: "2083-02-02", checkIn: "07:55", checkOut: "14:30", schoolId: "SCH001" },
  { id: "DL017", userId: "U011", date: "2083-02-02", checkIn: "07:48", checkOut: "14:30", schoolId: "SCH001" },
  { id: "DL018", userId: "U002", date: "2083-02-03", checkIn: "07:48", checkOut: "15:35", schoolId: "SCH001" },
  { id: "DL019", userId: "U004", date: "2083-02-03", checkIn: "07:42", checkOut: "15:20", schoolId: "SCH001" },
  { id: "DL020", userId: "U005", date: "2083-02-03", checkIn: "07:58", checkOut: "16:25", schoolId: "SCH001" },
  { id: "DL021", userId: "U006", date: "2083-02-03", checkIn: "08:12", checkOut: "16:00", schoolId: "SCH001" },
  { id: "DL022", userId: "U007", date: "2083-02-03", checkIn: "07:52", checkOut: "14:30", schoolId: "SCH001" },
  { id: "DL023", userId: "U008", date: "2083-02-03", checkIn: "08:02", checkOut: "14:30", schoolId: "SCH001" },
  { id: "DL024", userId: "U010", date: "2083-02-03", checkIn: "07:55", checkOut: "14:30", schoolId: "SCH001" },
  { id: "DL025", userId: "U011", date: "2083-02-03", checkIn: "07:50", checkOut: "14:30", schoolId: "SCH001" },
];

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

export const LEAVE_REQUESTS: LeaveRequest[] = [
  { id: "LR001", userId: "U002", startDate: "2083-02-10", endDate: "2083-02-11", type: "sick", reason: "Fever and cold", status: "approved", adminNote: "Take rest. Covered by substitute.", schoolId: "SCH001" },
  { id: "LR002", userId: "U003", startDate: "2083-02-15", endDate: "2083-02-15", type: "casual", reason: "Personal family matter", status: "pending", schoolId: "SCH001" },
  { id: "LR003", userId: "U004", startDate: "2083-02-20", endDate: "2083-02-22", type: "annual", reason: "Going to hometown for festival", status: "approved", adminNote: "Enjoy the festival!", schoolId: "SCH001" },
  { id: "LR004", userId: "U005", startDate: "2083-01-25", endDate: "2083-01-25", type: "sick", reason: "Dental appointment", status: "approved", adminNote: "Approved.", schoolId: "SCH001" },
  { id: "LR005", userId: "U007", startDate: "2083-02-04", endDate: "2083-02-04", type: "sick", reason: "Not feeling well", status: "approved", adminNote: "Rest at home.", schoolId: "SCH001" },
  { id: "LR006", userId: "U010", startDate: "2083-02-02", endDate: "2083-02-02", type: "casual", reason: "Family function", status: "approved", adminNote: "Approved.", schoolId: "SCH001" },
  { id: "LR007", userId: "U006", startDate: "2083-02-18", endDate: "2083-02-19", type: "casual", reason: "Personal errand", status: "pending", schoolId: "SCH001" },
  { id: "LR008", userId: "U011", startDate: "2083-02-12", endDate: "2083-02-12", type: "sick", reason: "Eye checkup", status: "approved", adminNote: "Bring medical report.", schoolId: "SCH001" },
];

export const ROUTINE_SLOTS: RoutineSlot[] = [
  // Grade 10 A (C007) — Ram Prasad KC (U002) is the class teacher
  { id: "R001", classId: "C007", day: "Sunday", period: 1, subject: "Mathematics", teacherId: "U002", room: "201", schoolId: "SCH001" },
  { id: "R002", classId: "C007", day: "Sunday", period: 2, subject: "Science", teacherId: "U003", room: "201", schoolId: "SCH001" },
  { id: "R003", classId: "C007", day: "Sunday", period: 3, subject: "English", teacherId: "U004", room: "201", schoolId: "SCH001" },
  { id: "R004", classId: "C007", day: "Monday", period: 1, subject: "English", teacherId: "U004", room: "201", schoolId: "SCH001" },
  { id: "R005", classId: "C007", day: "Monday", period: 2, subject: "Mathematics", teacherId: "U002", room: "201", schoolId: "SCH001" },
  { id: "R006", classId: "C007", day: "Monday", period: 3, subject: "Science", teacherId: "U003", room: "201", schoolId: "SCH001" },
  { id: "R007", classId: "C007", day: "Tuesday", period: 1, subject: "Nepali", teacherId: "U004", room: "Lab", schoolId: "SCH001" },
  { id: "R008", classId: "C007", day: "Tuesday", period: 2, subject: "Mathematics", teacherId: "U002", room: "201", schoolId: "SCH001" },
  { id: "R009", classId: "C007", day: "Tuesday", period: 3, subject: "Science", teacherId: "U003", room: "Lab", schoolId: "SCH001" },
  { id: "R010", classId: "C007", day: "Wednesday", period: 1, subject: "Mathematics", teacherId: "U002", room: "201", schoolId: "SCH001" },
  { id: "R011", classId: "C007", day: "Wednesday", period: 2, subject: "English", teacherId: "U004", room: "201", schoolId: "SCH001" },
  { id: "R012", classId: "C007", day: "Wednesday", period: 3, subject: "Nepali", teacherId: "U004", room: "201", schoolId: "SCH001" },
  { id: "R013", classId: "C007", day: "Thursday", period: 1, subject: "Science", teacherId: "U003", room: "Lab", schoolId: "SCH001" },
  { id: "R014", classId: "C007", day: "Thursday", period: 2, subject: "Mathematics", teacherId: "U002", room: "201", schoolId: "SCH001" },
  { id: "R015", classId: "C007", day: "Thursday", period: 3, subject: "English", teacherId: "U004", room: "201", schoolId: "SCH001" },
  // UKG (C003) — Kamala Adhikari (U004) is the class teacher
  { id: "R016", classId: "C003", day: "Sunday", period: 1, subject: "English", teacherId: "U004", room: "103", schoolId: "SCH001" },
  { id: "R017", classId: "C003", day: "Sunday", period: 2, subject: "Mathematics", teacherId: "U004", room: "103", schoolId: "SCH001" },
  { id: "R018", classId: "C003", day: "Monday", period: 1, subject: "Nepali", teacherId: "U004", room: "103", schoolId: "SCH001" },
  { id: "R019", classId: "C003", day: "Monday", period: 2, subject: "English", teacherId: "U004", room: "103", schoolId: "SCH001" },
  { id: "R020", classId: "C003", day: "Tuesday", period: 1, subject: "Mathematics", teacherId: "U004", room: "103", schoolId: "SCH001" },
  { id: "R021", classId: "C003", day: "Tuesday", period: 2, subject: "Nepali", teacherId: "U004", room: "103", schoolId: "SCH001" },
  { id: "R022", classId: "C003", day: "Wednesday", period: 1, subject: "English", teacherId: "U004", room: "103", schoolId: "SCH001" },
  { id: "R023", classId: "C003", day: "Wednesday", period: 2, subject: "Mathematics", teacherId: "U004", room: "103", schoolId: "SCH001" },
  { id: "R024", classId: "C003", day: "Thursday", period: 1, subject: "Nepali", teacherId: "U004", room: "103", schoolId: "SCH001" },
  { id: "R025", classId: "C003", day: "Thursday", period: 2, subject: "English", teacherId: "U004", room: "103", schoolId: "SCH001" },
  // Nursery (C001) — Ram Prasad KC (U002)
  { id: "R026", classId: "C001", day: "Sunday", period: 1, subject: "English", teacherId: "U002", room: "101", schoolId: "SCH001" },
  { id: "R027", classId: "C001", day: "Sunday", period: 2, subject: "Mathematics", teacherId: "U002", room: "101", schoolId: "SCH001" },
  { id: "R028", classId: "C001", day: "Monday", period: 1, subject: "Nepali", teacherId: "U002", room: "101", schoolId: "SCH001" },
  { id: "R029", classId: "C001", day: "Monday", period: 2, subject: "English", teacherId: "U002", room: "101", schoolId: "SCH001" },
  { id: "R030", classId: "C001", day: "Tuesday", period: 1, subject: "Mathematics", teacherId: "U002", room: "101", schoolId: "SCH001" },
  { id: "R031", classId: "C001", day: "Tuesday", period: 2, subject: "Nepali", teacherId: "U002", room: "101", schoolId: "SCH001" },
  // Class 1 (C004) — Ram Prasad KC (U002)
  { id: "R032", classId: "C004", day: "Sunday", period: 1, subject: "Science", teacherId: "U002", room: "104", schoolId: "SCH001" },
  { id: "R033", classId: "C004", day: "Sunday", period: 2, subject: "Mathematics", teacherId: "U002", room: "104", schoolId: "SCH001" },
  { id: "R034", classId: "C004", day: "Monday", period: 1, subject: "Mathematics", teacherId: "U002", room: "104", schoolId: "SCH001" },
  { id: "R035", classId: "C004", day: "Monday", period: 2, subject: "Science", teacherId: "U002", room: "104", schoolId: "SCH001" },
  // Grade 10 B (C008) — Sunita Maharjan (U003)
  { id: "R036", classId: "C008", day: "Sunday", period: 1, subject: "Science", teacherId: "U003", room: "202", schoolId: "SCH001" },
  { id: "R037", classId: "C008", day: "Sunday", period: 2, subject: "Mathematics", teacherId: "U003", room: "202", schoolId: "SCH001" },
  { id: "R038", classId: "C008", day: "Monday", period: 1, subject: "English", teacherId: "U003", room: "202", schoolId: "SCH001" },
  { id: "R039", classId: "C008", day: "Monday", period: 2, subject: "Science", teacherId: "U003", room: "Lab", schoolId: "SCH001" },
  // Class 3 (C006) — Kamala Adhikari (U004)
  { id: "R040", classId: "C006", day: "Sunday", period: 1, subject: "English", teacherId: "U004", room: "106", schoolId: "SCH001" },
  { id: "R041", classId: "C006", day: "Sunday", period: 2, subject: "Mathematics", teacherId: "U004", room: "106", schoolId: "SCH001" },
  { id: "R042", classId: "C006", day: "Monday", period: 1, subject: "Nepali", teacherId: "U004", room: "106", schoolId: "SCH001" },
  { id: "R043", classId: "C006", day: "Monday", period: 2, subject: "English", teacherId: "U004", room: "106", schoolId: "SCH001" },
];

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

export const ASSIGNMENTS: Assignment[] = [
  { id: "AS001", title: "Algebra Basics", description: "Solve 10 basic algebra problems from Chapter 2. Show all steps clearly.", classId: "C001", subject: "Mathematics", teacherId: "U002", dueDate: "2083-05-15", batch: "2083", createdAt: "2026-05-01T10:00:00Z", schoolId: "SCH001" },
  { id: "AS002", title: "Science Lab Report", description: "Write a lab report on the plant growth experiment. Include hypothesis, method, observations, and conclusion.", classId: "C004", subject: "Science", teacherId: "U002", dueDate: "2083-05-20", batch: "2083", createdAt: "2026-05-03T10:00:00Z", schoolId: "SCH001" },
  { id: "AS003", title: "Quadratic Equations", description: "Solve 15 quadratic equations using the quadratic formula. Submit all work on A4 paper.", classId: "C007", subject: "Mathematics", teacherId: "U002", dueDate: "2083-05-25", batch: "2083", createdAt: "2026-05-05T10:00:00Z", schoolId: "SCH001" },
  { id: "AS004", title: "Grammar Exercise", description: "Complete exercises 1-5 from the Grammar section of Unit 3. Identify nouns, verbs, and adjectives.", classId: "C002", subject: "English", teacherId: "U003", dueDate: "2083-05-18", batch: "2083", createdAt: "2026-05-02T10:00:00Z", schoolId: "SCH001" },
  { id: "AS005", title: "Chemical Reactions", description: "Write balanced equations for 10 chemical reactions. Identify the type of each reaction.", classId: "C008", subject: "Science", teacherId: "U003", dueDate: "2083-06-01", batch: "2083", createdAt: "2026-05-06T10:00:00Z", schoolId: "SCH001" },
  { id: "AS006", title: "Reading Comprehension", description: "Read the story 'The Honest Woodcutter' and answer the 5 questions at the end.", classId: "C003", subject: "English", teacherId: "U004", dueDate: "2083-05-22", batch: "2083", createdAt: "2026-05-04T10:00:00Z", schoolId: "SCH001" },
  { id: "AS007", title: "Addition Practice", description: "Complete 20 addition problems from the worksheet. Practice carrying over numbers.", classId: "C003", subject: "Mathematics", teacherId: "U004", dueDate: "2083-05-28", batch: "2083", createdAt: "2026-05-07T10:00:00Z", schoolId: "SCH001" },
  { id: "AS008", title: "Nepali Essay", description: "Write a 300-word essay on 'Mero Desh' (My Country) in Nepali.", classId: "C009", subject: "Nepali", teacherId: "U004", dueDate: "2083-06-05", batch: "2083", createdAt: "2026-05-08T10:00:00Z", schoolId: "SCH001" },
];

export const SUBMISSIONS: AssignmentSubmission[] = [
  { id: "SUB1712345678901", assignmentId: "AS006", studentId: "STU-601", response: "The woodcutter was honest because he returned the golden axe to the goddess. He did not lie about losing it.", submittedAt: "2026-05-20T14:30:00Z", reviewed: false, schoolId: "SCH001" },
  { id: "SUB1712345678902", assignmentId: "AS007", studentId: "STU-601", response: "Completed all 20 addition problems. Answers: 45, 78, 123, 56, 89, 234, 67, 90, 345, 78, 456, 567, 89, 678, 90, 789, 123, 890, 234, 901.", submittedAt: "2026-05-26T09:15:00Z", score: 18, reviewed: true, comment: "Well done! Most answers correct. Check problems 7 and 14.", schoolId: "SCH001" },
  { id: "SUB1712345678903", assignmentId: "AS003", studentId: "STU-604", response: "Completed all 15 quadratic equations. Used quadratic formula throughout.", submittedAt: "2026-05-23T11:00:00Z", score: 85, reviewed: true, comment: "Good work. Some mistakes in equation 9 and 12.", schoolId: "SCH001" },
  { id: "SUB1712345678904", assignmentId: "AS003", studentId: "STU-603", response: "Solved 12 out of 15 equations. Could not solve equations 7, 10, and 14.", submittedAt: "2026-05-24T16:45:00Z", reviewed: false, schoolId: "SCH001" },
  { id: "SUB1712345678905", assignmentId: "AS006", studentId: "STU-602", response: "The moral of the story is honesty always wins. The woodcutter got all three axes because he told the truth.", submittedAt: "2026-05-21T10:00:00Z", score: 10, reviewed: true, comment: "Good understanding of the moral. Try to write in complete sentences.", schoolId: "SCH001" },
];

export const FEE_RECORDS: FeeRecord[] = [
  { id: "FR001", studentId: "STU-601", amount: 5000, paid: 5000, status: "Paid", date: "2083-02-05", schoolId: "SCH001" },
  { id: "FR002", studentId: "STU-601", amount: 1500, paid: 1500, status: "Paid", date: "2083-02-05", schoolId: "SCH001" },
  { id: "FR003", studentId: "STU-602", amount: 5000, paid: 5000, status: "Paid", date: "2083-02-06", schoolId: "SCH001" },
  { id: "FR004", studentId: "STU-602", amount: 500, paid: 500, status: "Paid", date: "2083-02-06", schoolId: "SCH001" },
  { id: "FR005", studentId: "STU-603", amount: 5500, paid: 5500, status: "Paid", date: "2083-02-03", schoolId: "SCH001" },
  { id: "FR006", studentId: "STU-603", amount: 1500, paid: 1500, status: "Paid", date: "2083-02-03", schoolId: "SCH001" },
  { id: "FR007", studentId: "STU-603", amount: 800, paid: 800, status: "Paid", date: "2083-02-03", schoolId: "SCH001" },
  { id: "FR008", studentId: "STU-604", amount: 7000, paid: 3500, status: "Partial", date: "2083-02-04", schoolId: "SCH001" },
  { id: "FR009", studentId: "STU-604", amount: 1000, paid: 0, status: "Due", date: "2083-02-04", schoolId: "SCH001" },
  { id: "FR010", studentId: "STU-604", amount: 1000, paid: 1000, status: "Paid", date: "2083-02-04", schoolId: "SCH001" },
  { id: "FR011", studentId: "STU-601", amount: 5000, paid: 0, status: "Due", date: "2083-03-01", schoolId: "SCH001" },
  { id: "FR012", studentId: "STU-602", amount: 1500, paid: 0, status: "Due", date: "2083-03-01", schoolId: "SCH001" },
  { id: "FR013", studentId: "STU-603", amount: 5500, paid: 0, status: "Due", date: "2083-03-01", schoolId: "SCH001" },
  { id: "FR014", studentId: "STU-604", amount: 7000, paid: 0, status: "Due", date: "2083-03-01", schoolId: "SCH001" },
];

export const PARENT_STUDENT: ParentStudent[] = [
  { parentId: "U009", studentId: "STU-601" },
];

export const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const PERIODS = [1, 2, 3, 4, 5, 6];
export const PUBLISHED_RESULTS: Record<string, boolean> = {};

export function setPublishedResult(key: string, value: boolean) {
  PUBLISHED_RESULTS[key] = value;
}

export const CLASSES_LIST = ["Nursery", "LKG", "UKG", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Grade 10"];
export const SECTIONS = ["Section A", "Section B", "Section C", "Section D"];
export const BATCHES = ["2080", "2081", "2082", "2083", "2084", "2085"];

export const SUBJECTS: Subject[] = [
  { id: "SUB01", name: "Mathematics", code: "MATH" },
  { id: "SUB02", name: "Science", code: "SCI" },
  { id: "SUB03", name: "English", code: "ENG" },
  { id: "SUB04", name: "Nepali", code: "NEP" },
  { id: "SUB05", name: "Social Studies", code: "SOC" },
  { id: "SUB06", name: "Computer Science", code: "COM" },
  { id: "SUB07", name: "Health & Physical Education", code: "HPE" },
  { id: "SUB08", name: "General Knowledge", code: "GK" },
  { id: "SUB09", name: "Science & Environment", code: "SCI-ENV" },
  { id: "SUB10", name: "Moral Education", code: "MORAL" },
];

export const FEE_TYPES: FeeType[] = [
  { id: "FT001", name: "Tuition Fee", amount: 5000, classId: "C001" },
  { id: "FT002", name: "Transport Fee", amount: 1500, classId: "C001" },
  { id: "FT003", name: "Library Fee", amount: 500, classId: "C001" },
  { id: "FT004", name: "Tuition Fee", amount: 5500, classId: "C004" },
  { id: "FT005", name: "Transport Fee", amount: 1500, classId: "C004" },
  { id: "FT006", name: "Computer Lab Fee", amount: 800, classId: "C004" },
  { id: "FT007", name: "Tuition Fee", amount: 7000, classId: "C007" },
  { id: "FT008", name: "Science Lab Fee", amount: 1000, classId: "C007" },
  { id: "FT009", name: "Exam Fee", amount: 1000, classId: "C007" },
  { id: "FT010", name: "Tuition Fee", amount: 4500, classId: "C002" },
];

export const GRADING_SCALES: GradingScale[] = [
  { id: "GS01", grade: "A+", minPercentage: 90, maxPercentage: 100 },
  { id: "GS02", grade: "A", minPercentage: 80, maxPercentage: 89 },
  { id: "GS03", grade: "B+", minPercentage: 70, maxPercentage: 79 },
  { id: "GS04", grade: "B", minPercentage: 60, maxPercentage: 69 },
  { id: "GS05", grade: "C+", minPercentage: 50, maxPercentage: 59 },
  { id: "GS06", grade: "C", minPercentage: 40, maxPercentage: 49 },
  { id: "GS07", grade: "D", minPercentage: 0, maxPercentage: 39 },
];

export const REFERENCE_DATA: ReferenceDatum[] = [
  { id: "REF001", type: "staff_role", value: "accountant" },
  { id: "REF002", type: "staff_role", value: "librarian" },
  { id: "REF003", type: "staff_role", value: "front_desk" },
  { id: "REF004", type: "staff_role", value: "admin_assistant" },
  { id: "REF005", type: "staff_role", value: "security" },
  { id: "REF006", type: "staff_role", value: "cleaner" },
  { id: "REF007", type: "staff_role", value: "other" },
  { id: "REF008", type: "leave_type", value: "sick" },
  { id: "REF009", type: "leave_type", value: "casual" },
  { id: "REF010", type: "leave_type", value: "annual" },
  { id: "REF011", type: "leave_type", value: "maternity" },
  { id: "REF012", type: "leave_type", value: "paternity" },
  { id: "REF013", type: "leave_type", value: "unpaid" },
  { id: "REF014", type: "gender", value: "Male" },
  { id: "REF015", type: "gender", value: "Female" },
  { id: "REF016", type: "gender", value: "Other" },
  { id: "REF017", type: "blood_group", value: "A+" },
  { id: "REF018", type: "blood_group", value: "A-" },
  { id: "REF019", type: "blood_group", value: "B+" },
  { id: "REF020", type: "blood_group", value: "B-" },
  { id: "REF021", type: "blood_group", value: "AB+" },
  { id: "REF022", type: "blood_group", value: "AB-" },
  { id: "REF023", type: "blood_group", value: "O+" },
  { id: "REF024", type: "blood_group", value: "O-" },
  { id: "REF025", type: "religion", value: "Hindu" },
  { id: "REF026", type: "religion", value: "Buddhist" },
  { id: "REF027", type: "religion", value: "Muslim" },
  { id: "REF028", type: "religion", value: "Christian" },
  { id: "REF029", type: "religion", value: "Other" },
  { id: "REF030", type: "ethnic_group", value: "Brahmin" },
  { id: "REF031", type: "ethnic_group", value: "Chhetri" },
  { id: "REF032", type: "ethnic_group", value: "Newar" },
  { id: "REF033", type: "ethnic_group", value: "Magar" },
  { id: "REF034", type: "ethnic_group", value: "Tharu" },
  { id: "REF035", type: "ethnic_group", value: "Tamang" },
  { id: "REF036", type: "ethnic_group", value: "Rai" },
  { id: "REF037", type: "ethnic_group", value: "Limbu" },
  { id: "REF038", type: "ethnic_group", value: "Gurung" },
  { id: "REF039", type: "ethnic_group", value: "Sherpa" },
  { id: "REF040", type: "ethnic_group", value: "Other" },
  { id: "REF041", type: "fee_status", value: "Paid" },
  { id: "REF042", type: "fee_status", value: "Due" },
  { id: "REF043", type: "fee_status", value: "Partial" },
  { id: "REF044", type: "audience", value: "all" },
  { id: "REF045", type: "audience", value: "students" },
  { id: "REF046", type: "audience", value: "teachers" },
  { id: "REF047", type: "audience", value: "staff" },
  { id: "REF048", type: "audience", value: "parents" },
  { id: "REF049", type: "residency_type", value: "Local" },
  { id: "REF050", type: "residency_type", value: "Resident" },
  { id: "REF051", type: "residency_type", value: "Non-Resident" },
  { id: "REF052", type: "staff_type", value: "Teaching" },
  { id: "REF053", type: "staff_type", value: "Non-Teaching" },
];

export const SCHOOL_CONFIG: SchoolConfig = {
  schoolName: "Vidya School",
  address: "Biratnagar, Morang, Nepal",
  phone: "9800980260",
  activeAcademicYear: "2083",
};

