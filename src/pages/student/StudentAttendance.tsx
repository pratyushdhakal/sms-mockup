import { CheckCircle, XCircle, Clock, CalendarClock, Calendar } from "lucide-react";
import { ATTENDANCE } from "../../data";

const STUDENT_USER_ID = "U007";

const statusBadge = (s: string) => {
  const m: Record<string, string> = {
    Present: "bg-emerald-50 text-emerald-700",
    Absent: "bg-red-50 text-red-700",
    Late: "bg-amber-50 text-amber-700",
    Leave: "bg-blue-50 text-blue-700",
  };
  return m[s] ?? "bg-slate-100 text-slate-600";
};

const sourceBadge = (s: string) =>
  s === "device"
    ? "bg-sky-50 text-sky-700"
    : "bg-slate-50 text-slate-600";

export default function StudentAttendance() {
  const records = ATTENDANCE.filter((a) => a.userId === STUDENT_USER_ID);

  const present = records.filter((a) => a.status === "Present").length;
  const absent = records.filter((a) => a.status === "Absent").length;
  const late = records.filter((a) => a.status === "Late").length;
  const leave = records.filter((a) => a.status === "Leave").length;

  const stats = [
    { label: "Present", value: present, icon: CheckCircle, color: "text-emerald-600 bg-emerald-50" },
    { label: "Absent", value: absent, icon: XCircle, color: "text-red-600 bg-red-50" },
    { label: "Late", value: late, icon: Clock, color: "text-amber-600 bg-amber-50" },
    { label: "Leave", value: leave, icon: CalendarClock, color: "text-blue-600 bg-blue-50" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-800">My Attendance</h1>
        <p className="text-sm text-slate-400 mt-0.5">Attendance records</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-100 p-4">
            <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center mb-3`}>
              <Icon size={17} />
            </div>
            <p className="text-2xl font-semibold text-slate-800">{value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <div className="flex items-center gap-2 p-4 border-b border-slate-100">
          <Calendar size={15} className="text-slate-400" />
          <span className="text-sm text-slate-500">{records.length} records</span>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              {["Date", "Status", "Source"].map((h) => (
                <th key={h} className="text-left text-xs font-medium text-slate-400 px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {records.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-sm text-slate-600">{r.date}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge(r.status)}`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sourceBadge(r.source)}`}>
                    {r.source}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {records.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-6">No attendance records found.</p>
        )}
      </div>
    </div>
  );
}
