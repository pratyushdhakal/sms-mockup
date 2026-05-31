import { TEACHERS, DAYS, PERIODS } from "../../data";
import { useStore } from "../../StoreContext";

const STUDENT_CLASS_ID = "C003";

export default function StudentRoutine() {
  const { routineSlots } = useStore();
  const slots = routineSlots.filter((s) => s.classId === STUDENT_CLASS_ID);

  function getTeacherName(teacherId: string): string {
    const teacher = TEACHERS.find((t) => t.userId === teacherId);
    return teacher?.name ?? "—";
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-800">My Routine</h1>
        <p className="text-sm text-slate-400 mt-0.5">Weekly timetable</p>
      </div>

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
