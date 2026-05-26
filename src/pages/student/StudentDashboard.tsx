import { CheckCircle, CalendarClock, ArrowRight, BookOpen, FileText, GraduationCap } from "lucide-react";
import { ATTENDANCE, CLASS_GROUPS, ASSIGNMENTS, EXAMS } from "../../data";

const STUDENT_USER_ID = "U007";
const STUDENT_NAME = "Yuwansh Magar";
const STUDENT_CLASS_ID = "C003";

export default function StudentDashboard() {
  const classGroup = CLASS_GROUPS.find((c) => c.id === STUDENT_CLASS_ID);
  const className = classGroup ? `${classGroup.name} — ${classGroup.section}` : "—";

  const myAttendance = ATTENDANCE.filter((a) => a.userId === STUDENT_USER_ID);
  const presentCount = myAttendance.filter((a) => a.status === "Present").length;
  const attendancePct = myAttendance.length > 0 ? Math.round((presentCount / myAttendance.length) * 100) : 0;

  const classAssignments = ASSIGNMENTS.filter((a) => a.classId === STUDENT_CLASS_ID);
  const pendingAssignments = classAssignments.length;

  const upcomingExams = EXAMS.filter((e) => e.applicableClassIds.includes(STUDENT_CLASS_ID)).length;

  const quickLinks = [
    { label: "My Attendance", icon: CalendarClock },
    { label: "My Routine", icon: BookOpen },
    { label: "Assignments", icon: FileText },
    { label: "My Results", icon: GraduationCap },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-800">Welcome, {STUDENT_NAME}</h1>
        <p className="text-sm text-slate-400 mt-0.5">{className}</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center mb-3">
            <CheckCircle size={17} className="text-emerald-600" />
          </div>
          <p className="text-2xl font-semibold text-slate-800">{attendancePct}%</p>
          <p className="text-xs text-slate-400 mt-0.5">My Attendance</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center mb-3">
            <FileText size={17} className="text-amber-600" />
          </div>
          <p className="text-2xl font-semibold text-slate-800">{pendingAssignments}</p>
          <p className="text-xs text-slate-400 mt-0.5">Pending Assignments</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center mb-3">
            <CalendarClock size={17} className="text-indigo-600" />
          </div>
          <p className="text-2xl font-semibold text-slate-800">{upcomingExams}</p>
          <p className="text-xs text-slate-400 mt-0.5">Upcoming Exams</p>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-slate-700 mb-3">Quick Links</h2>
        <div className="grid grid-cols-2 gap-3">
          {quickLinks.map(({ label, icon: Icon }) => (
            <a
              key={label}
              href="#"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-slate-100 bg-white hover:bg-slate-50 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                <Icon size={15} className="text-indigo-600" />
              </div>
              <span className="text-sm text-slate-600 group-hover:text-slate-800">{label}</span>
              <ArrowRight size={14} className="ml-auto text-slate-300 group-hover:text-slate-500" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
