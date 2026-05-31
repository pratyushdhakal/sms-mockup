import { GraduationCap, Users, CalendarCheck, Clock, BookOpen, ClipboardCheck, FileText } from "lucide-react";
import { TEACHERS, STUDENTS, CLASS_GROUPS, ATTENDANCE, LEAVE_REQUESTS } from "../../data";
import { useStore } from "../../StoreContext";
import Header from "../../layouts/Header";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function TeacherDashboard() {
  const teacher = TEACHERS[0];
  const myClasses = CLASS_GROUPS.filter((c) => teacher.assignedClassIds.includes(c.id));
  const myStudentIds = STUDENTS.filter((s) => teacher.assignedClassIds.includes(s.classId)).map((s) => s.userId).filter(Boolean);
  const totalStudents = STUDENTS.filter((s) => teacher.assignedClassIds.includes(s.classId)).length;

  const todayStr = new Date().toISOString().split("T")[0];
  const todayAtt = ATTENDANCE.filter((a) => myStudentIds.includes(a.userId) && a.date === todayStr);
  const presentCount = todayAtt.filter((a) => a.status === "Present").length;
  const attPct = totalStudents ? Math.round((presentCount / totalStudents) * 100) : 0;

  const pendingLeaves = LEAVE_REQUESTS.filter((l) => l.userId === "U002" && l.status === "pending").length;

  const { routineSlots } = useStore();
  const todayDay = DAY_NAMES[new Date().getDay()];
  const todaySlots = routineSlots.filter((s) => s.teacherId === "U002" && s.day === todayDay);
  const classMap = Object.fromEntries(CLASS_GROUPS.map((c) => [c.id, c.name]));

  const statCards = [
    { label: "My Classes", value: String(myClasses.length), icon: GraduationCap, bg: "bg-indigo-50", ic: "text-indigo-600" },
    { label: "Total Students", value: String(totalStudents), icon: Users, bg: "bg-violet-50", ic: "text-violet-600" },
    { label: "Today's Attendance", value: `${attPct}%`, icon: CalendarCheck, bg: "bg-emerald-50", ic: "text-emerald-600" },
    { label: "Pending Leave", value: String(pendingLeaves), icon: Clock, bg: "bg-amber-50", ic: "text-amber-600" },
  ];

  const quickLinks = [
    { label: "Mark Attendance", icon: ClipboardCheck, colors: "text-indigo-600 bg-indigo-50" },
    { label: "My Routine", icon: BookOpen, colors: "text-emerald-600 bg-emerald-50" },
    { label: "Assignments", icon: FileText, colors: "text-violet-600 bg-violet-50" },
  ];

  return (
    <div>
      <Header title="Dashboard" userName="Ram Prasad KC" userRole="Teacher" />

      <div className="bg-indigo-50 rounded-xl p-5 mb-6">
        <h2 className="text-lg font-semibold text-indigo-800">Welcome back, Ram Prasad KC</h2>
        <p className="text-sm text-indigo-600 mt-1">Here's your overview for today.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map(({ label, value, icon: Icon, bg, ic }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-100 p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}>
                <Icon size={17} className={ic} />
              </div>
            </div>
            <p className="text-2xl font-semibold text-slate-800">{value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">My Schedule — {todayDay}</h2>
          {todaySlots.length === 0 ? (
            <p className="text-sm text-slate-400">No classes scheduled today.</p>
          ) : (
            <div className="space-y-2">
              {todaySlots
                .sort((a, b) => a.period - b.period)
                .map((slot) => (
                  <div key={slot.id} className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700">
                      {slot.period}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{slot.subject}</p>
                      <p className="text-xs text-slate-500">{classMap[slot.classId] || slot.classId} · Room {slot.room}</p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Quick Links</h2>
          <div className="space-y-2">
            {quickLinks.map(({ label, icon: Icon, colors }) => (
              <button key={label} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 text-left transition-colors group">
                <div className={`w-8 h-8 rounded-lg ${colors} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={15} />
                </div>
                <span className="text-sm text-slate-600 group-hover:text-slate-800">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
