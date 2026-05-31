import { DAYS, PERIODS } from "../../data";
import { useAuth } from "../../AuthContext";
import { useStore } from "../../StoreContext";
import Header from "../../layouts/Header";

export default function StudentRoutine() {
  const { currentStudent } = useAuth();
  const { routineSlots, teachers } = useStore();
  const classId = currentStudent?.classId || "";
  const slots = routineSlots.filter((s) => s.classId === classId);

  function getTeacherName(teacherId: string): string {
    const teacher = teachers.find((t) => t.userId === teacherId);
    return teacher?.name ?? "—";
  }

  return (
    <div>
      <Header title="My Routine" subtitle="Weekly timetable" userName={currentStudent?.name} userRole="Student" />

      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="text-left text-xs font-medium text-slate-400 px-4 py-3">Period</th>
              {DAYS.filter((d) => d !== "Friday" && d !== "Saturday").map((day) => (
                <th key={day} className="text-left text-xs font-medium text-slate-400 px-4 py-3">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {PERIODS.map((period) => (
              <tr key={period} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-slate-500">Period {period}</td>
                {DAYS.filter((d) => d !== "Friday" && d !== "Saturday").map((day) => {
                  const slot = slots.find((s) => s.day === day && s.period === period);
                  return (
                    <td key={`${day}-${period}`} className="px-4 py-3">
                      {slot ? (
                        <div>
                          <p className="text-sm font-medium text-slate-700">{slot.subject}</p>
                          <p className="text-xs text-slate-400">{getTeacherName(slot.teacherId)} · {slot.room}</p>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
