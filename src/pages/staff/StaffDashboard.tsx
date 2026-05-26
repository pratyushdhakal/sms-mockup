import { CheckCircle, XCircle, Clock, CalendarClock, ArrowRight } from "lucide-react";
import { ATTENDANCE, LEAVE_REQUESTS } from "../../data";

const STAFF_USER_ID = "U005";
const STAFF_NAME = "Gopal Shrestha";

export default function StaffDashboard() {
  const myAttendance = ATTENDANCE.filter((a) => a.userId === STAFF_USER_ID);
  const presentCount = myAttendance.filter((a) => a.status === "Present").length;
  const attendancePct = myAttendance.length > 0 ? Math.round((presentCount / myAttendance.length) * 100) : 0;

  const pendingLeaves = LEAVE_REQUESTS.filter(
    (l) => l.userId === STAFF_USER_ID && l.status === "pending"
  ).length;

  const today = "2026-05-26";
  const todayRecord = myAttendance.find((a) => a.date === today);
  const todayStatus = todayRecord?.status ?? null;
  const todaySource = todayRecord?.source ?? null;

  const quickLinks = [
    { label: "My Attendance", icon: CalendarClock, href: "#" },
    { label: "Leave Requests", icon: Clock, href: "#" },
  ];

  const statusIcon = (s: string | null) => {
    if (s === "Present") return <CheckCircle size={20} className="text-emerald-500" />;
    if (s === "Absent") return <XCircle size={20} className="text-red-500" />;
    if (s === "Late") return <Clock size={20} className="text-amber-500" />;
    if (s === "Leave") return <CalendarClock size={20} className="text-blue-500" />;
    return <Clock size={20} className="text-slate-300" />;
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-800">Welcome, {STAFF_NAME}</h1>
        <p className="text-sm text-slate-400 mt-0.5">Staff Dashboard</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center mb-3">
            <CheckCircle size={17} className="text-indigo-600" />
          </div>
          <p className="text-2xl font-semibold text-slate-800">{attendancePct}%</p>
          <p className="text-xs text-slate-400 mt-0.5">My Attendance</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center mb-3">
            <Clock size={17} className="text-amber-600" />
          </div>
          <p className="text-2xl font-semibold text-slate-800">{pendingLeaves}</p>
          <p className="text-xs text-slate-400 mt-0.5">Pending Leave Requests</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-700">Today's Attendance</h2>
          <span className="text-xs text-slate-400">{today}</span>
        </div>
        <div className="flex items-center gap-3">
          {statusIcon(todayStatus)}
          <div>
            <p className="text-sm font-medium text-slate-700">
              {todayStatus ?? "No record"}
            </p>
            {todaySource && (
              <p className="text-xs text-slate-400">Source: {todaySource}</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-slate-700 mb-3">Quick Links</h2>
        <div className="grid grid-cols-2 gap-3">
          {quickLinks.map(({ label, icon: Icon, href }) => (
            <a
              key={label}
              href={href}
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
