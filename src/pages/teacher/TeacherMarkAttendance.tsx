import { useState } from "react";
import { Check } from "lucide-react";
import { TEACHERS, CLASS_GROUPS } from "../../data";
import type { AttendanceRecord, AttendanceStatus } from "../../types";
import { useStore } from "../../StoreContext";
import Header from "../../layouts/Header";

export default function TeacherMarkAttendance() {
  const { setAttendanceRecords, students } = useStore();
  const storeTeachers = useStore().teachers;
  const teacherList = storeTeachers.length > 0 ? storeTeachers : TEACHERS;
  const teacher = teacherList[0];
  const myClasses = CLASS_GROUPS.filter((c) => teacher?.assignedClassIds?.includes(c.id) ?? false);
  const [selectedClass, setSelectedClass] = useState(myClasses[0]?.id || "");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [statuses, setStatuses] = useState<Record<string, AttendanceStatus>>({});
  const [saved, setSaved] = useState(false);

  const studentsInClass = students.filter((s) => s.classId === selectedClass);

  function markAllPresent() {
    const all: Record<string, AttendanceStatus> = {};
    studentsInClass.forEach((s) => { all[s.id] = "Present"; });
    setStatuses(all);
  }

  function handleSave() {
    const today = date;
    const newRecords: AttendanceRecord[] = studentsInClass.map((s) => ({
      id: `ATT-${Date.now()}-${s.id}`,
      userId: s.userId || s.id,
      date: today,
      status: statuses[s.id] || "Present",
      source: "manual",
      markedBy: teacher?.userId || "",
      schoolId: "SCH001",
    }));
    if (newRecords.length === 0) return;
    setAttendanceRecords((prev) => [...prev, ...newRecords]);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <Header title="Mark Attendance" subtitle="Record student attendance" />

      <div className="bg-white rounded-xl border border-slate-100 p-5">
        <div className="flex flex-wrap items-center gap-4 mb-5">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Class</label>
            <select value={selectedClass} onChange={(e) => { setSelectedClass(e.target.value); setStatuses({}); }} className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 bg-white">
              {myClasses.map((c) => (
                <option key={c.id} value={c.id}>{c.name} ({c.section})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-700">Students</h3>
          <div className="flex items-center gap-2">
            <button onClick={markAllPresent} className="flex items-center gap-1 px-3 py-1.5 text-xs bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 font-medium">
              <Check size={12} /> Mark All Present
            </button>
            <button onClick={handleSave} className="flex items-center gap-1 px-3 py-1.5 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">
              Save Attendance
            </button>
          </div>
        </div>

        {saved && (
          <div className="mb-4 flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 text-xs rounded-lg">
            <Check size={13} /> Attendance saved successfully.
          </div>
        )}

        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-xs font-medium text-slate-400 px-3 py-2">Student</th>
              <th className="text-left text-xs font-medium text-slate-400 px-3 py-2">Roll</th>
              <th className="text-left text-xs font-medium text-slate-400 px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {studentsInClass.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50/50">
                <td className="px-3 py-2 text-sm text-slate-700">{s.name}</td>
                <td className="px-3 py-2 text-sm text-slate-500">{s.rollNumber}</td>
                <td className="px-3 py-2">
                  <select
                    value={statuses[s.id] || "Present"}
                    onChange={(e) => setStatuses((prev) => ({ ...prev, [s.id]: e.target.value as AttendanceStatus }))}
                    className="px-2 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 bg-white"
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Late">Late</option>
                    <option value="Leave">Leave</option>
                  </select>
                </td>
              </tr>
            ))}
            {studentsInClass.length === 0 && (
              <tr>
                <td colSpan={3} className="px-3 py-6 text-center text-sm text-slate-400">No students in this class.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
