import { TrendingUp, TrendingDown, GraduationCap, Users, DollarSign, AlertCircle, CreditCard, Bell, UserCheck, Calendar, ChevronRight } from "lucide-react";
import { STUDENTS, TEACHERS, FEE_RECORDS, ATTENDANCE } from "../../data";
import Header from "../../layouts/Header";

const RECENT_ACTIVITY = [
  { text: "New student enrolled: Aarav Sharma", time: "2 min ago", type: "success" },
  { text: "Fee collected from Priya Thapa — NPR 12,500", time: "15 min ago", type: "info" },
  { text: "Notice posted: Annual Day Celebration", time: "1 hr ago", type: "info" },
  { text: "Exam schedule updated for Grade 10", time: "3 hrs ago", type: "warning" },
  { text: "Staff leave approved: Sunita Maharjan", time: "5 hrs ago", type: "success" },
];

const QUICK_ACTIONS = [
  { label: "Enroll New Student", icon: GraduationCap, colors: "text-indigo-600 bg-indigo-50" },
  { label: "Collect Fee", icon: CreditCard, colors: "text-emerald-600 bg-emerald-50" },
  { label: "Post Notice", icon: Bell, colors: "text-amber-600 bg-amber-50" },
  { label: "Add Staff", icon: UserCheck, colors: "text-violet-600 bg-violet-50" },
  { label: "Schedule Exam", icon: Calendar, colors: "text-sky-600 bg-sky-50" },
];

const activityDot = (t: string) =>
  ({ success: "bg-emerald-500", info: "bg-blue-500", warning: "bg-amber-500", error: "bg-red-500" })[t];

export default function AdminDashboard() {
  const totalStudents = STUDENTS.length;
  const totalTeachers = TEACHERS.length;
  const feesCollected = FEE_RECORDS.reduce((s, r) => s + r.paid, 0);
  const pendingDues = FEE_RECORDS.filter((r) => r.status === "Due").reduce((s, r) => s + (r.amount - r.paid), 0);

  const attCounts = ATTENDANCE.reduce<Record<string, number>>((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {});
  const totalAtt = ATTENDANCE.length;

  const statCards = [
    { label: "Total Students", value: String(totalStudents), change: "+2", up: true, icon: GraduationCap, bg: "bg-indigo-50", ic: "text-indigo-600" },
    { label: "Teachers", value: String(totalTeachers), change: "0", up: true, icon: Users, bg: "bg-violet-50", ic: "text-violet-600" },
    { label: "Fees Collected", value: `NPR ${feesCollected.toLocaleString()}`, change: "+8%", up: true, icon: DollarSign, bg: "bg-emerald-50", ic: "text-emerald-600" },
    { label: "Pending Dues", value: `NPR ${pendingDues.toLocaleString()}`, change: "-5%", up: false, icon: AlertCircle, bg: "bg-amber-50", ic: "text-amber-600" },
  ];

  const attItems = [
    { label: "Present", count: attCounts["Present"] || 0, pct: totalAtt ? Math.round(((attCounts["Present"] || 0) / totalAtt) * 100) : 0, bar: "bg-emerald-500" },
    { label: "Absent", count: attCounts["Absent"] || 0, pct: totalAtt ? Math.round(((attCounts["Absent"] || 0) / totalAtt) * 100) : 0, bar: "bg-red-400" },
    { label: "Late", count: attCounts["Late"] || 0, pct: totalAtt ? Math.round(((attCounts["Late"] || 0) / totalAtt) * 100) : 0, bar: "bg-amber-400" },
    { label: "Leave", count: attCounts["Leave"] || 0, pct: totalAtt ? Math.round(((attCounts["Leave"] || 0) / totalAtt) * 100) : 0, bar: "bg-slate-300" },
  ];

  return (
    <div>
      <Header title="Dashboard" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map(({ label, value, change, up, icon: Icon, bg, ic }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-100 p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}>
                <Icon size={17} className={ic} />
              </div>
              <span className={`flex items-center gap-1 text-xs font-medium ${up ? "text-emerald-600" : "text-red-500"}`}>
                {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {change}
              </span>
            </div>
            <p className="text-2xl font-semibold text-slate-800">{value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-700">Recent Activity</h2>
            <button className="text-xs text-indigo-600 hover:text-indigo-800">View all</button>
          </div>
          <div className="space-y-3">
            {RECENT_ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${activityDot(a.type)}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-600">{a.text}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {QUICK_ACTIONS.map(({ label, icon: Icon, colors }) => (
              <button key={label} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 text-left transition-colors group">
                <div className={`w-8 h-8 rounded-lg ${colors} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={15} />
                </div>
                <span className="text-sm text-slate-600 group-hover:text-slate-800">{label}</span>
                <ChevronRight size={14} className="ml-auto text-slate-300 group-hover:text-slate-500" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 bg-white rounded-xl border border-slate-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-700">Today's Attendance</h2>
          <span className="text-xs text-slate-400">May 26, 2026</span>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {attItems.map(({ label, count, pct, bar }) => (
            <div key={label} className="text-center">
              <div className="h-1.5 rounded-full bg-slate-100 mb-2">
                <div className={`h-full rounded-full ${bar}`} style={{ width: `${pct}%` }} />
              </div>
              <p className="text-lg font-semibold text-slate-800">{count}</p>
              <p className="text-xs text-slate-400">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
