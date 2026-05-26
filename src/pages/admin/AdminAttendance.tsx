import { useState } from "react";
import { Check, Save } from "lucide-react";
import { ATTENDANCE, STUDENTS, CLASS_GROUPS, MOCK_USERS } from "../../data";
import type { AttendanceStatus } from "../../types";
import Header from "../../layouts/Header";

const TABS = ["Class Attendance", "Device Logs", "Staff Attendance", "My Attendance"] as const;
type Tab = (typeof TABS)[number];

const STATUSES: AttendanceStatus[] = ["Present", "Absent", "Late", "Leave"];

const statusBadge = (s: AttendanceStatus) => {
  const m: Record<AttendanceStatus, string> = { Present: "bg-emerald-50 text-emerald-700", Absent: "bg-red-50 text-red-700", Late: "bg-amber-50 text-amber-700", Leave: "bg-slate-100 text-slate-600" };
  return m[s];
};

function getUserName(id: string) {
  return MOCK_USERS.find((u) => u.id === id)?.name || id;
}

export default function AdminAttendance() {
  const [activeTab, setActiveTab] = useState<Tab>("Class Attendance");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceStatus>>({});

  const classStudents = STUDENTS.filter((s) => s.classId === selectedClass);

  function markAllPresent() {
    const map: Record<string, AttendanceStatus> = {};
    classStudents.forEach((s) => { if (s.userId) map[s.userId] = "Present"; });
    setAttendanceMap(map);
  }

  function setStudentStatus(userId: string, status: AttendanceStatus) {
    setAttendanceMap((prev) => ({ ...prev, [userId]: status }));
  }

  function saveAttendance() {
    console.log("Saving attendance...", { classId: selectedClass, date: selectedDate, records: attendanceMap });
  }

  const deviceLogs = ATTENDANCE.filter((a) => a.source === "device");

  const staffUsers = MOCK_USERS.filter((u) => u.type === "staff" || u.type === "teacher" || u.type === "admin");
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayStaffAttendance = staffUsers.map((u) => ({
    user: u,
    record: ATTENDANCE.find((a) => a.userId === u.id && a.date === todayStr),
  }));

  const myAttendance = ATTENDANCE.filter((a) => a.userId === "U001");

  return (
    <div>
      <Header title="Attendance" subtitle="Track and manage attendance" />

      <div className="bg-white rounded-xl border border-slate-100">
        <div className="flex border-b border-slate-100">
          {TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab ? "text-indigo-600 border-b-2 border-indigo-600" : "text-slate-400 hover:text-slate-600"}`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="p-4">
          {activeTab === "Class Attendance" && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <select value={selectedClass} onChange={(e) => { setSelectedClass(e.target.value); setAttendanceMap({}); }} className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 bg-white">
                  <option value="">Select Class</option>
                  {CLASS_GROUPS.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.section})</option>
                  ))}
                </select>
                <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />
                <button onClick={markAllPresent} disabled={!selectedClass} className="flex items-center gap-1.5 px-3 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 disabled:opacity-40">
                  <Check size={14} /> Mark All Present
                </button>
                <button onClick={saveAttendance} disabled={!selectedClass} className="flex items-center gap-1.5 px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-40 ml-auto">
                  <Save size={14} /> Save
                </button>
              </div>

              {selectedClass && classStudents.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left text-xs font-medium text-slate-400 px-3 py-2">Roll</th>
                      <th className="text-left text-xs font-medium text-slate-400 px-3 py-2">Name</th>
                      <th className="text-left text-xs font-medium text-slate-400 px-3 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {classStudents.map((s) => {
                      const userId = s.userId || "";
                      const status = attendanceMap[userId] || "Present";
                      return (
                        <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-3 py-2.5 text-xs text-slate-500">{s.rollNumber}</td>
                          <td className="px-3 py-2.5">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-semibold text-indigo-700">
                                {s.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                              </div>
                              <span className="text-sm text-slate-700">{s.name}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2.5">
                            <select value={status} onChange={(e) => setStudentStatus(userId, e.target.value as AttendanceStatus)} className={`text-xs px-2 py-1 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 ${statusBadge(status)}`}>
                              {STATUSES.map((st) => (
                                <option key={st} value={st}>{st}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : selectedClass ? (
                <p className="text-sm text-slate-400 text-center py-8">No students found in this class.</p>
              ) : (
                <p className="text-sm text-slate-400 text-center py-8">Select a class and date to mark attendance.</p>
              )}
            </div>
          )}

          {activeTab === "Device Logs" && (
            <div>
              <p className="text-xs text-slate-400 mb-3">Attendance records synced from biometric devices.</p>
              {deviceLogs.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left text-xs font-medium text-slate-400 px-3 py-2">User</th>
                      <th className="text-left text-xs font-medium text-slate-400 px-3 py-2">Date</th>
                      <th className="text-left text-xs font-medium text-slate-400 px-3 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {deviceLogs.map((a) => (
                      <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-3 py-2.5 text-sm text-slate-700">{getUserName(a.userId)}</td>
                        <td className="px-3 py-2.5 text-sm text-slate-600">{a.date}</td>
                        <td className="px-3 py-2.5">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge(a.status)}`}>{a.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-sm text-slate-400 text-center py-8">No device logs found.</p>
              )}
            </div>
          )}

          {activeTab === "Staff Attendance" && (
            <div>
              <p className="text-xs text-slate-400 mb-3">Today's attendance for staff & teachers — {todayStr}</p>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left text-xs font-medium text-slate-400 px-3 py-2">Name</th>
                    <th className="text-left text-xs font-medium text-slate-400 px-3 py-2">Role</th>
                    <th className="text-left text-xs font-medium text-slate-400 px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {todayStaffAttendance.map(({ user, record }) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-3 py-2.5 text-sm text-slate-700">{user.name}</td>
                      <td className="px-3 py-2.5 text-xs text-slate-500 capitalize">{user.type}</td>
                      <td className="px-3 py-2.5">
                        {record ? (
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge(record.status)}`}>{record.status}</span>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "My Attendance" && (
            <div>
              <p className="text-xs text-slate-400 mb-3">Attendance records for Admin (U001)</p>
              {myAttendance.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left text-xs font-medium text-slate-400 px-3 py-2">Date</th>
                      <th className="text-left text-xs font-medium text-slate-400 px-3 py-2">Status</th>
                      <th className="text-left text-xs font-medium text-slate-400 px-3 py-2">Source</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {myAttendance.map((a) => (
                      <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-3 py-2.5 text-sm text-slate-700">{a.date}</td>
                        <td className="px-3 py-2.5">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge(a.status)}`}>{a.status}</span>
                        </td>
                        <td className="px-3 py-2.5 text-xs text-slate-500 capitalize">{a.source}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-sm text-slate-400 text-center py-8">No attendance records found.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
