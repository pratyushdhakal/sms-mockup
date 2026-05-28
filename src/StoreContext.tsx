import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Inquiry, Intake, Student, User, ParentStudent, AttendanceRecord, DeviceLog } from "./types";
import {
  INQUIRIES as DATA_INQUIRIES,
  INTAKES as DATA_INTAKES,
  STUDENTS as DATA_STUDENTS,
  MOCK_USERS,
  PARENT_STUDENT as DATA_PARENT_STUDENT,
  CLASS_GROUPS,
  ATTENDANCE as DATA_ATTENDANCE,
  DEVICE_LOGS as DATA_DEVICE_LOGS,
} from "./data";

let nextStuNum = 700;
let nextUserNum = 20;

function genId(prefix: string, num: number): string {
  return `${prefix}-${String(num).padStart(3, "0")}`;
}

interface EnrollResult {
  student: Student;
  studentUser: User;
  parentUser: User;
}

interface StoreState {
  inquiries: Inquiry[];
  setInquiries: React.Dispatch<React.SetStateAction<Inquiry[]>>;
  intakes: Intake[];
  setIntakes: React.Dispatch<React.SetStateAction<Intake[]>>;
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  parentStudent: ParentStudent[];
  setParentStudent: React.Dispatch<React.SetStateAction<ParentStudent[]>>;
  attendanceRecords: AttendanceRecord[];
  setAttendanceRecords: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>;
  deviceLogs: DeviceLog[];
  setDeviceLogs: React.Dispatch<React.SetStateAction<DeviceLog[]>>;

  enrollInquiry: (inquiryId: string, intakeId: string, rollNumber: string, classGroupId: string) => EnrollResult | null;
}

const StoreContext = createContext<StoreState | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [inquiries, setInquiries] = useState<Inquiry[]>(DATA_INQUIRIES);
  const [intakes, setIntakes] = useState<Intake[]>(DATA_INTAKES);
  const [students, setStudents] = useState<Student[]>(DATA_STUDENTS);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [parentStudent, setParentStudent] = useState<ParentStudent[]>(DATA_PARENT_STUDENT);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(DATA_ATTENDANCE);
  const [deviceLogs, setDeviceLogs] = useState<DeviceLog[]>(DATA_DEVICE_LOGS);

  const enrollInquiry = useCallback((
    inquiryId: string,
    intakeId: string,
    rollNumber: string,
    classGroupId: string
  ): EnrollResult | null => {
    const inquiry = inquiries.find((i) => i.id === inquiryId);
    const intake = intakes.find((i) => i.id === intakeId);
    if (!inquiry || !intake) return null;

    if (inquiry.status !== "contacted") return null;
    if (intake.status !== "open") return null;

    const classGroup = CLASS_GROUPS.find((c) => c.id === classGroupId);
    if (!classGroup) return null;

    if (intake.enrolled >= intake.capacity) return null;

    const stuNum = nextStuNum++;
    const userIdNum = nextUserNum++;

    const studentId = genId("STU", stuNum);
    const studentUserId = genId("U", userIdNum);
    const parentUserId = genId("U", userIdNum + 1);
    nextUserNum += 2;

    const studentUser: User = {
      id: studentUserId,
      type: "student",
      email: inquiry.candidateName.toLowerCase().replace(/\s+/g, ".") + "." + studentId.toLowerCase() + "@school.com",
      password: "student",
      name: inquiry.candidateName,
      phone: inquiry.candidateMobile || "98XXXXXXXX",
      schoolId: "SCH001",
      active: true,
    };

    const parentName = inquiry.inquirerName;
    const parentUser: User = {
      id: parentUserId,
      type: "parent",
      email: "parent." + parentName.toLowerCase().replace(/\s+/g, ".") + "@school.com",
      password: "parent",
      name: parentName,
      phone: inquiry.inquirerMobile || "98XXXXXXXX",
      schoolId: "SCH001",
      active: true,
    };

    const student: Student = {
      id: studentId,
      name: inquiry.candidateName,
      classId: classGroupId,
      section: classGroup.section,
      rollNumber,
      batch: intake.academicYear,
      intakeId,
      phone: inquiry.candidateMobile || "98XXXXXXXX",
      email: inquiry.candidateEmail || studentUser.email,
      fee: "Due",
      status: "Active",
      dob: inquiry.candidateDob,
      gender: inquiry.candidateGender,
      bloodGroup: "",
      nationality: "",
      religion: "",
      motherTongue: "",
      ethnicGroup: "",
      permanentAddress: inquiry.permanentAddress,
      temporaryAddress: inquiry.temporaryAddress,
      fatherName: inquiry.relationship === "Father" ? inquiry.inquirerName : "",
      fatherOccupation: "",
      motherName: inquiry.relationship === "Mother" ? inquiry.inquirerName : "",
      motherOccupation: "",
      guardianName: inquiry.inquirerName,
      guardianContact: inquiry.inquirerMobile,
      guardianRelation: inquiry.relationship,
      parentEmail: inquiry.inquirerEmail,
      previousSchool: "",
      admissionDate: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      schoolId: "SCH001",
      userId: studentUserId,
    };

    setUsers((prev) => [...prev, studentUser, parentUser]);
    setStudents((prev) => [student, ...prev]);
    setParentStudent((prev) => [...prev, { parentId: parentUserId, studentId: student.id }]);
    setIntakes((prev) => prev.map((i) => (i.id === intakeId ? { ...i, enrolled: i.enrolled + 1 } : i)));
    setInquiries((prev) => prev.map((i) => (i.id === inquiryId ? { ...i, status: "converted" as const } : i)));

    return { student, studentUser, parentUser };
  }, [inquiries, intakes]);

  return (
    <StoreContext.Provider
      value={{
        inquiries, setInquiries,
        intakes, setIntakes,
        students, setStudents,
        users, setUsers,
        parentStudent, setParentStudent,
        attendanceRecords, setAttendanceRecords,
        deviceLogs, setDeviceLogs,
        enrollInquiry,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore(): StoreState {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
