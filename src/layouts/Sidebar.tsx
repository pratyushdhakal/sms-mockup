import type { UserRole } from "../types";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CreditCard,
  ClipboardList,
  Bell,
  BarChart3,
  LogOut,
  UserCheck,
  Calendar,
  BookMarked,
  FileText,
  Fingerprint,
  School2,
  ChevronLeft,
  FileQuestion,
  DoorOpen,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export type NavItem = { id: string; label: string; icon: LucideIcon };

const ALL_NAV: Record<string, NavItem[]> = {
  admin: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "inquiry", label: "Inquiries", icon: FileQuestion },
    { id: "admissions", label: "Admissions", icon: DoorOpen },
    { id: "intakes", label: "Batch Management", icon: BookMarked },
    { id: "students", label: "All Students", icon: GraduationCap },
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
    { id: "inquiry", label: "Inquiries", icon: FileQuestion },
    { id: "intakes", label: "Intakes", icon: BookMarked },
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

function NavButton({
  active,
  collapsed,
  item,
  onClick,
}: {
  active: boolean;
  collapsed: boolean;
  item: NavItem;
  onClick: () => void;
}) {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-150 relative",
        active
          ? "bg-sidebar-accent/80 text-sidebar-accent-foreground font-semibold shadow-sm"
          : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/30"
      )}
    >
      {active && !collapsed && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-white/60 rounded-full" />
      )}
      <Icon size={17} className={cn("shrink-0", active && "text-white")} />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </button>
  );
}

export default function Sidebar({
  role,
  active,
  setActive,
  collapsed,
  setCollapsed,
  onLogout,
}: SidebarProps) {
  const navItems = ALL_NAV[role] || [];

  return (
    <aside
      className={cn(
        "flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-200",
        collapsed ? "w-16" : "w-56",
        "min-h-screen shrink-0"
      )}
    >
      <div className="flex items-center gap-3 px-4 h-14 border-b border-sidebar-border shrink-0">
        <div className="w-7 h-7 bg-sidebar-primary rounded-lg flex items-center justify-center shrink-0">
          <School2 size={15} className="text-sidebar-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="font-semibold text-sm leading-tight text-sidebar-foreground">
            Vidya
            <span className="text-sidebar-foreground/50 font-normal text-xs capitalize block">
              {role}
            </span>
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-sidebar-foreground/40 hover:text-sidebar-foreground transition-colors"
        >
          <ChevronLeft size={15} className={cn("transition-transform duration-200", collapsed && "rotate-180")} />
        </button>
      </div>

      <nav className="flex-1 py-3 space-y-0.5 px-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavButton
            key={item.id}
            item={item}
            active={active === item.id}
            collapsed={collapsed}
            onClick={() => setActive(item.id)}
          />
        ))}
      </nav>

      <Separator className="bg-sidebar-border" />

      <div className="p-2">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all"
        >
          <LogOut size={17} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
