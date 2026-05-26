import { ATTENDANCE } from "../../data";
import Header from "../../layouts/Header";

const statusColor: Record<string, string> = {
  Present: "bg-emerald-50 text-emerald-700",
  Absent: "bg-red-50 text-red-700",
  Late: "bg-amber-50 text-amber-700",
  Leave: "bg-blue-50 text-blue-700",
};

export default function TeacherMyAttendance() {
  const records = ATTENDANCE.filter((a) => a.userId === "U002");

  const summary = records.reduce(
    (acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div>
      <Header title="My Attendance" subtitle="Your attendance records" />

      <div className="grid grid-cols-4 gap-4 mb-6">
        {["Present", "Absent", "Late", "Leave"].map((status) => (
          <div key={status} className="bg-white rounded-xl border border-slate-100 p-4 text-center">
            <p className="text-2xl font-semibold text-slate-800">{summary[status] || 0}</p>
            <p className="text-xs text-slate-400 mt-1">{status}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-100">
        <div className="p-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700">Attendance Records</h2>
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
              <tr key={r.id} className="hover:bg-slate-50/50">
                <td className="px-4 py-3 text-sm text-slate-700">{r.date}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[r.status]}`}>{r.status}</span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-500 capitalize">{r.source}</td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-sm text-slate-400">No attendance records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
