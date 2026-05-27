import { useState } from "react";
import { AuthProvider, useAuth } from "./AuthContext";
import Sidebar from "./layouts/Sidebar";
import Login from "./pages/Login";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminTeachers from "./pages/admin/AdminTeachers";
import AdminStaff from "./pages/admin/AdminStaff";
import AdminIntakes from "./pages/admin/AdminIntakes";
import AdminAttendance from "./pages/admin/AdminAttendance";
import AdminLeave from "./pages/admin/AdminLeave";
import AdminRoutine from "./pages/admin/AdminRoutine";
import AdminAnnouncements from "./pages/admin/AdminAnnouncements";
import AdminCalendar from "./pages/admin/AdminCalendar";
import AdminExams from "./pages/admin/AdminExams";
import AdminResults from "./pages/admin/AdminResults";
import AdminAssignments from "./pages/admin/AdminAssignments";
import AdminIDCards from "./pages/admin/AdminIDCards";
import AdminFees from "./pages/admin/AdminFees";
import AdminReports from "./pages/admin/AdminReports";

import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherClasses from "./pages/teacher/TeacherClasses";
import TeacherMarkAttendance from "./pages/teacher/TeacherMarkAttendance";
import TeacherRoutine from "./pages/teacher/TeacherRoutine";
import TeacherAssignments from "./pages/teacher/TeacherAssignments";
import TeacherExamEntry from "./pages/teacher/TeacherExamEntry";
import TeacherMyAttendance from "./pages/teacher/TeacherMyAttendance";
import TeacherLeave from "./pages/teacher/TeacherLeave";
import TeacherAnnouncements from "./pages/teacher/TeacherAnnouncements";
import TeacherCalendar from "./pages/teacher/TeacherCalendar";

import StaffDashboard from "./pages/staff/StaffDashboard";
import StaffAttendance from "./pages/staff/StaffAttendance";
import StaffLeave from "./pages/staff/StaffLeave";
import StaffAnnouncements from "./pages/staff/StaffAnnouncements";
import StaffCalendar from "./pages/staff/StaffCalendar";

import StudentDashboard from "./pages/student/StudentDashboard";
import StudentAttendance from "./pages/student/StudentAttendance";
import StudentRoutine from "./pages/student/StudentRoutine";
import StudentAssignments from "./pages/student/StudentAssignments";
import StudentResults from "./pages/student/StudentResults";
import StudentLeave from "./pages/student/StudentLeave";
import StudentAnnouncements from "./pages/student/StudentAnnouncements";
import StudentCalendar from "./pages/student/StudentCalendar";

import ParentDashboard from "./pages/parent/ParentDashboard";
import ParentSummary from "./pages/parent/ParentSummary";
import ParentAttendance from "./pages/parent/ParentAttendance";
import ParentResults from "./pages/parent/ParentResults";
import ParentAssignments from "./pages/parent/ParentAssignments";
import ParentFees from "./pages/parent/ParentFees";
import ParentAnnouncements from "./pages/parent/ParentAnnouncements";
import ParentCalendar from "./pages/parent/ParentCalendar";

import type { UserRole } from "./types";

const PAGE_MAP: Record<string, Record<string, React.FC>> = {
  admin: {
    dashboard: AdminDashboard,
    students: AdminStudents,
    "add-student": AdminStudents,
    intakes: AdminIntakes,
    teachers: AdminTeachers,
    staff: AdminStaff,
    attendance: AdminAttendance,
    leave: AdminLeave,
    routine: AdminRoutine,
    exams: AdminExams,
    results: AdminResults,
    assignments: AdminAssignments,
    notices: AdminAnnouncements,
    calendar: AdminCalendar,
    "id-cards": AdminIDCards,
    fees: AdminFees,
    reports: AdminReports,
  },
  teacher: {
    dashboard: TeacherDashboard,
    "my-classes": TeacherClasses,
    "mark-attendance": TeacherMarkAttendance,
    "my-routine": TeacherRoutine,
    assignments: TeacherAssignments,
    "exam-entry": TeacherExamEntry,
    "my-attendance": TeacherMyAttendance,
    "my-leave": TeacherLeave,
    notices: TeacherAnnouncements,
    calendar: TeacherCalendar,
  },
  staff: {
    dashboard: StaffDashboard,
    "my-attendance": StaffAttendance,
    "my-leave": StaffLeave,
    notices: StaffAnnouncements,
    calendar: StaffCalendar,
  },
  student: {
    dashboard: StudentDashboard,
    "my-attendance": StudentAttendance,
    "my-routine": StudentRoutine,
    assignments: StudentAssignments,
    "my-results": StudentResults,
    "my-leave": StudentLeave,
    notices: StudentAnnouncements,
    calendar: StudentCalendar,
  },
  parent: {
    dashboard: ParentDashboard,
    "child-summary": ParentSummary,
    "child-attendance": ParentAttendance,
    "child-results": ParentResults,
    "child-assignments": ParentAssignments,
    "fee-history": ParentFees,
    notices: ParentAnnouncements,
    calendar: ParentCalendar,
  },
};

function AppShell() {
  const { user, logout } = useAuth();
  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  if (!user) return <Login />;

  const role = user.type as UserRole;
  const pages = PAGE_MAP[role];
  const PageComponent = pages?.[active] || pages?.dashboard;
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role={role} active={active} setActive={setActive} collapsed={collapsed} setCollapsed={setCollapsed} onLogout={logout} />
      <main className="flex-1 overflow-y-auto" style={{ maxHeight: "100vh" }}>
        <div className="p-6 max-w-7xl mx-auto">
          {PageComponent ? <PageComponent /> : <p className="text-muted-foreground text-sm">Page not found</p>}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
