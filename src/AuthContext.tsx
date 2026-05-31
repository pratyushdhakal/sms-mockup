import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { User, UserRole, Teacher, Student, StaffMember, ClassGroup } from "./types";
import { MOCK_USERS, TEACHERS, STUDENTS, STAFF, CLASS_GROUPS, PARENT_STUDENT } from "./data";

interface AuthState {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  hasRole: (...roles: UserRole[]) => boolean;
  currentTeacher: Teacher | null;
  currentStudent: Student | null;
  currentStaff: StaffMember | null;
  parentChildren: Student[];
  studentClass: ClassGroup | null;
}

const AuthContext = createContext<AuthState | null>(null);

function getCurrentTeacher(user: User | null): Teacher | null {
  if (!user || user.type !== "teacher") return null;
  return TEACHERS.find((t) => t.userId === user.id) || null;
}

function getCurrentStudent(user: User | null): Student | null {
  if (!user || user.type !== "student") return null;
  return STUDENTS.find((s) => s.userId === user.id) || null;
}

function getCurrentStaff(user: User | null): StaffMember | null {
  if (!user || user.type !== "staff") return null;
  return STAFF.find((s) => s.userId === user.id) || null;
}

function getParentChildren(user: User | null): Student[] {
  if (!user || user.type !== "parent") return [];
  const childIds = PARENT_STUDENT
    .filter((ps) => ps.parentId === user.id)
    .map((ps) => ps.studentId);
  return STUDENTS.filter((s) => childIds.includes(s.id));
}

function getStudentClass(student: Student | null): ClassGroup | null {
  if (!student) return null;
  return CLASS_GROUPS.find((c) => c.id === student.classId) || null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = sessionStorage.getItem("sms_user");
    return stored ? JSON.parse(stored) : null;
  });

  const currentTeacher = getCurrentTeacher(user);
  const currentStudent = getCurrentStudent(user);
  const currentStaff = getCurrentStaff(user);
  const parentChildren = getParentChildren(user);
  const studentClass = getStudentClass(currentStudent);

  const login = useCallback((email: string, password: string): boolean => {
    const found = MOCK_USERS.find((u) => u.email === email && u.password === password && u.active);
    if (found) {
      setUser(found);
      sessionStorage.setItem("sms_user", JSON.stringify(found));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem("sms_user");
  }, []);

  const hasRole = useCallback((...roles: UserRole[]): boolean => {
    return user ? roles.includes(user.type) : false;
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout, hasRole, currentTeacher, currentStudent, currentStaff, parentChildren, studentClass }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
