import { ROUTINE_SLOTS, CLASS_GROUPS } from "../../data";
import Header from "../../layouts/Header";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
const PERIODS = [1, 2, 3, 4, 5, 6];

export default function TeacherRoutine() {
  const mySlots = ROUTINE_SLOTS.filter((s) => s.teacherId === "U002");
  const classMap = Object.fromEntries(CLASS_GROUPS.map((c) => [c.id, { name: c.name, section: c.section }]));

  function getSlot(day: string, period: number) {
    return mySlots.find((s) => s.day === day && s.period === period);
  }

  return (
    <div>
      <Header title="My Routine" subtitle="Your weekly timetable" />

      <div className="bg-white rounded-xl border border-slate-100">
        <div className="p-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700">Weekly Timetable</h2>
        </div>
        <div className="overflow-x-auto p-4">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left text-xs font-medium text-slate-400 p-2 w-16">Period</th>
                {DAYS.map((day) => (
                  <th key={day} className="text-left text-xs font-medium text-slate-400 p-2">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERIODS.map((period) => (
                <tr key={period}>
                  <td className="text-xs text-slate-400 p-2 font-medium">{period}</td>
                  {DAYS.map((day) => {
                    const slot = getSlot(day, period);
                    return (
                      <td key={day} className="p-1.5 border border-slate-100 min-w-[150px] h-20 align-top">
                        {slot ? (
                          <div className="bg-indigo-50 rounded-lg p-2 h-full">
                            <p className="text-xs font-semibold text-indigo-700">{slot.subject}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{classMap[slot.classId]?.name || slot.classId}</p>
                            <p className="text-xs text-slate-400">Room {slot.room}</p>
                          </div>
                        ) : (
                          <div className="h-full" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {mySlots.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-12">No routine assigned to you yet.</p>
        )}
      </div>
    </div>
  );
}
