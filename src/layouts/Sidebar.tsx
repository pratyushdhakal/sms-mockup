import type { UserRole } from "../types";
import {
  LayoutDashboard, GraduationCap, Users, BookOpen, CreditCard,
  ClipboardList, Bell, BarChart3, LogOut, Menu,
  UserCheck, Calendar, BookMarked, FileText, Fingerprint,
  School2, type LucideIcon,
} from "lucide-react";

export type NavItem = { id: string; label: string; icon: LucideIcon };

const ALL_NAV: Record<string, NavItem[]> = {
  admin: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "students", label: "All Students", icon: GraduationCap },
    { id: "add-student", label: "Add Student", icon: UserCheck },
    { id: "intakes", label: "Intakes", icon: BookMarked },
    { id: "teachers", label: "Teachers", icon: Users },
    { id: "staff", label: "Staff", icon: Users },
    { id: "attendance", label: "Attendance", icon: Fingerprint },
    { id: "leave", label: "Leave Requests", icon: FileText },
    { id: "routine", label: "Routine Builder", icon: Calendar },
    { id: "exams", label: "Exams", icon: ClipboardList },
    { id: "results", label: "Exam Results", icon: BarChart3 },
    { id: "assignments", label: "Assignments", icon: BookOpen },
    { id: "notices", label: "Announcements", icon: Bell },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "id-cards", label: "ID Cards", icon: CreditCard },
    { id: "fees", label: "Fee Management", icon: CreditCard },
    { id: "reports", label: "Reports", icon: BarChart3 },
  ],
  teacher: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "my-classes", label: "My Classes", icon: BookOpen },
    { id: "mark-attendance", label: "Mark Attendance", icon: Fingerprint },
    { id: "my-routine", label: "My Routine", icon: Calendar },
    { id: "assignments", label: "Assignments", icon: BookMarked },
    { id: "exam-entry", label: "Exam Entry", icon: ClipboardList },
    { id: "my-attendance", label: "My Attendance", icon: UserCheck },
    { id: "my-leave", label: "Leave Requests", icon: FileText },
    { id: "notices", label: "Announcements", icon: Bell },
    { id: "calendar", label: "Calendar", icon: Calendar },
  ],
  staff: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "my-attendance", label: "My Attendance", icon: UserCheck },
    { id: "my-leave", label: "Leave Requests", icon: FileText },
    { id: "notices", label: "Announcements", icon: Bell },
    { id: "calendar", label: "Calendar", icon: Calendar },
  ],
  student: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "my-attendance", label: "My Attendance", icon: UserCheck },
    { id: "my-routine", label: "My Routine", icon: Calendar },
    { id: "assignments", label: "Assignments", icon: BookMarked },
    { id: "my-results", label: "My Results", icon: BarChart3 },
    { id: "my-leave", label: "Leave Requests", icon: FileText },
    { id: "notices", label: "Announcements", icon: Bell },
    { id: "calendar", label: "Calendar", icon: Calendar },
  ],
  parent: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "child-summary", label: "Child Summary", icon: GraduationCap },
    { id: "child-attendance", label: "Child Attendance", icon: UserCheck },
    { id: "child-results", label: "Child Results", icon: BarChart3 },
    { id: "child-assignments", label: "Child Assignments", icon: BookMarked },
    { id: "fee-history", label: "Fee History", icon: CreditCard },
    { id: "notices", label: "Announcements", icon: Bell },
    { id: "calendar", label: "Calendar", icon: Calendar },
  ],
};

interface SidebarProps {
  role: UserRole;
  active: string;
  setActive: (id: string) => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  onLogout: () => void;
}

export default function Sidebar({ role, active, setActive, collapsed, setCollapsed, onLogout }: SidebarProps) {
  const navItems = ALL_NAV[role] || [];

  return (
    <aside className={`flex flex-col bg-slate-900 text-slate-300 transition-all duration-200 ${collapsed ? "w-16" : "w-56"} min-h-screen flex-shrink-0`}>
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-800">
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <School2 size={16} className="text-white" />
        </div>
        {!collapsed && (
          <span className="font-semibold text-white text-sm leading-tight">
            Vidya
            <br />
            <span className="text-indigo-400 font-normal text-xs capitalize">{role}</span>
          </span>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="ml-auto text-slate-500 hover:text-slate-300 transition-colors">
          <Menu size={16} />
        </button>
      </div>

      <nav className="flex-1 py-4 space-y-0.5 px-2 overflow-y-auto">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
              active === id ? "bg-indigo-600 text-white" : "hover:bg-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            <Icon size={17} className="flex-shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </button>
        ))}
      </nav>

      <div className="px-2 pb-4 border-t border-slate-800 pt-4">
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-all">
          <LogOut size={17} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
