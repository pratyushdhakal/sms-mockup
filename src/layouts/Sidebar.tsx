import { type UserRole } from "../types";
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
  Tag,
  ChevronLeft,
  ChevronDown,
  FileQuestion,
  DoorOpen,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

export type NavItem = { id: string; label: string; icon: LucideIcon };

type NavGroup = {
  label: string;
  icon: LucideIcon;
  items: NavItem[];
};

type NavEntry =
  | { type: "single"; item: NavItem }
  | { type: "group"; group: NavGroup };

const ALL_NAV: Record<string, NavEntry[]> = {
  admin: [
    { type: "single", item: { id: "dashboard", label: "Dashboard", icon: LayoutDashboard } },
    { type: "single", item: { id: "inquiry", label: "Inquiries", icon: FileQuestion } },
    { type: "single", item: { id: "admissions", label: "Admissions", icon: DoorOpen } },
    { type: "single", item: { id: "intakes", label: "Batch Management", icon: BookMarked } },
    {
      type: "group",
      group: {
        label: "Students",
        icon: GraduationCap,
        items: [
          { id: "students", label: "All Students", icon: GraduationCap },
          { id: "id-cards", label: "ID Cards", icon: CreditCard },
        ],
      },
    },
    {
      type: "group",
      group: {
        label: "Staff",
        icon: Users,
        items: [
          { id: "teachers", label: "Teachers", icon: Users },
          { id: "staff", label: "Staff", icon: Users },
        ],
      },
    },
    {
      type: "group",
      group: {
        label: "Attendance & Leave",
        icon: Fingerprint,
        items: [
          { id: "attendance", label: "Attendance", icon: Fingerprint },
          { id: "leave", label: "Leave Requests", icon: FileText },
        ],
      },
    },
    {
      type: "group",
      group: {
        label: "Academic",
        icon: BookOpen,
        items: [
          { id: "assignments", label: "Assignments", icon: BookOpen },
          { id: "routine", label: "Routine Builder", icon: Calendar },
          { id: "calendar", label: "Calendar", icon: Calendar },
        ],
      },
    },
    {
      type: "group",
      group: {
        label: "Exams & Results",
        icon: ClipboardList,
        items: [
          { id: "exams", label: "Exams", icon: ClipboardList },
          { id: "results", label: "Exam Results", icon: BarChart3 },
        ],
      },
    },
    { type: "single", item: { id: "notices", label: "Announcements", icon: Bell } },
    { type: "single", item: { id: "fees", label: "Fee Management", icon: CreditCard } },
  ],
  teacher: [
    { type: "single", item: { id: "dashboard", label: "Dashboard", icon: LayoutDashboard } },
    { type: "single", item: { id: "my-classes", label: "My Classes", icon: BookOpen } },
    { type: "single", item: { id: "mark-attendance", label: "Mark Attendance", icon: Fingerprint } },
    { type: "single", item: { id: "my-routine", label: "My Routine", icon: Calendar } },
    { type: "single", item: { id: "assignments", label: "Assignments", icon: BookMarked } },
    { type: "single", item: { id: "exam-entry", label: "Exam Entry", icon: ClipboardList } },
    { type: "single", item: { id: "my-attendance", label: "My Attendance", icon: UserCheck } },
    { type: "single", item: { id: "my-leave", label: "Leave Requests", icon: FileText } },
    { type: "single", item: { id: "notices", label: "Announcements", icon: Bell } },
    { type: "single", item: { id: "calendar", label: "Calendar", icon: Calendar } },
  ],
  staff: [
    { type: "single", item: { id: "dashboard", label: "Dashboard", icon: LayoutDashboard } },
    { type: "single", item: { id: "inquiry", label: "Inquiries", icon: FileQuestion } },
    { type: "single", item: { id: "intakes", label: "Intakes", icon: BookMarked } },
    { type: "single", item: { id: "my-attendance", label: "My Attendance", icon: UserCheck } },
    { type: "single", item: { id: "my-leave", label: "Leave Requests", icon: FileText } },
    { type: "single", item: { id: "notices", label: "Announcements", icon: Bell } },
    { type: "single", item: { id: "calendar", label: "Calendar", icon: Calendar } },
  ],
  student: [
    { type: "single", item: { id: "dashboard", label: "Dashboard", icon: LayoutDashboard } },
    { type: "single", item: { id: "my-attendance", label: "My Attendance", icon: UserCheck } },
    { type: "single", item: { id: "my-routine", label: "My Routine", icon: Calendar } },
    { type: "single", item: { id: "assignments", label: "Assignments", icon: BookMarked } },
    { type: "single", item: { id: "my-results", label: "My Results", icon: BarChart3 } },
    { type: "single", item: { id: "my-leave", label: "Leave Requests", icon: FileText } },
    { type: "single", item: { id: "notices", label: "Announcements", icon: Bell } },
    { type: "single", item: { id: "calendar", label: "Calendar", icon: Calendar } },
  ],
  parent: [
    { type: "single", item: { id: "dashboard", label: "Dashboard", icon: LayoutDashboard } },
    { type: "single", item: { id: "child-summary", label: "Child Summary", icon: GraduationCap } },
    { type: "single", item: { id: "child-attendance", label: "Child Attendance", icon: UserCheck } },
    { type: "single", item: { id: "child-results", label: "Child Results", icon: BarChart3 } },
    { type: "single", item: { id: "child-assignments", label: "Child Assignments", icon: BookMarked } },
    { type: "single", item: { id: "fee-history", label: "Fee History", icon: CreditCard } },
    { type: "single", item: { id: "notices", label: "Announcements", icon: Bell } },
    { type: "single", item: { id: "calendar", label: "Calendar", icon: Calendar } },
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

function NavGroup({
  group,
  active,
  collapsed,
  expanded,
  onToggle,
  onSelect,
}: {
  group: NavGroup;
  active: string;
  collapsed: boolean;
  expanded: boolean;
  onToggle: () => void;
  onSelect: (id: string) => void;
}) {
  const GroupIcon = group.icon;
  const hasActiveChild = group.items.some((item) => item.id === active);

  if (collapsed) {
    return (
      <div
        className={cn(
          "w-full flex items-center justify-center px-3 py-2 rounded-md text-sm transition-all duration-150",
          hasActiveChild
            ? "bg-sidebar-accent/80 text-sidebar-accent-foreground"
            : "text-sidebar-foreground/60"
        )}
      >
        <GroupIcon size={17} className={cn("shrink-0", hasActiveChild && "text-white")} />
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={onToggle}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-150 relative",
          hasActiveChild
            ? "bg-sidebar-accent/80 text-sidebar-accent-foreground font-semibold shadow-sm"
            : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/30"
        )}
      >
        {hasActiveChild && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-white/60 rounded-full" />
        )}
        <GroupIcon size={17} className={cn("shrink-0", hasActiveChild && "text-white")} />
        <span className="flex-1 truncate text-left">{group.label}</span>
        <ChevronDown
          size={14}
          className={cn(
            "shrink-0 transition-transform duration-200",
            expanded ? "rotate-0" : "-rotate-90",
            hasActiveChild ? "text-white/70" : "text-sidebar-foreground/40"
          )}
        />
      </button>
      {expanded && (
        <div className="ml-4 pl-2 border-l border-sidebar-border/50 mt-0.5 space-y-0.5">
          {group.items.map((item) => (
            <NavButton
              key={item.id}
              item={item}
              active={active === item.id}
              collapsed={false}
              onClick={() => onSelect(item.id)}
            />
          ))}
        </div>
      )}
    </div>
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
  const navEntries = ALL_NAV[role] || [];

  const getGroupKey = (group: NavGroup) => group.label;

  const groupContainsActive = (label: string) =>
    navEntries.some(
      (entry) =>
        entry.type === "group" &&
        getGroupKey(entry.group) === label &&
        entry.group.items.some((item) => item.id === active)
    );

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    for (const entry of navEntries) {
      if (entry.type === "group") {
        const key = getGroupKey(entry.group);
        if (entry.group.items.some((item) => item.id === active)) {
          initial.add(key);
        }
      }
    }
    return initial;
  });

  const toggleGroup = (label: string) => {
    if (groupContainsActive(label)) return;
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const isGroupExpanded = (label: string) =>
    groupContainsActive(label) || expandedGroups.has(label);

  const flatItems = navEntries.flatMap((entry) =>
    entry.type === "single" ? [entry.item] : entry.group.items
  );

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
          <ChevronLeft
            size={15}
            className={cn("transition-transform duration-200", collapsed && "rotate-180")}
          />
        </button>
      </div>

      <nav className="flex-1 py-3 space-y-0.5 px-2 overflow-y-auto">
        {collapsed
          ? flatItems.map((item) => (
              <NavButton
                key={item.id}
                item={item}
                active={active === item.id}
                collapsed={true}
                onClick={() => setActive(item.id)}
              />
            ))
          : navEntries.map((entry) => {
              if (entry.type === "single") {
                return (
                  <NavButton
                    key={entry.item.id}
                    item={entry.item}
                    active={active === entry.item.id}
                    collapsed={false}
                    onClick={() => setActive(entry.item.id)}
                  />
                );
              }
              return (
                <NavGroup
                  key={getGroupKey(entry.group)}
                  group={entry.group}
                  active={active}
                  collapsed={false}
                  expanded={isGroupExpanded(getGroupKey(entry.group))}
                  onToggle={() => toggleGroup(getGroupKey(entry.group))}
                  onSelect={setActive}
                />
              );
            })}
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
