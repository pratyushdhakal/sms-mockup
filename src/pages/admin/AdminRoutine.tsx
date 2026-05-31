import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { CLASS_GROUPS, TEACHERS, MOCK_USERS } from "../../data";
import type { RoutineSlot } from "../../types";
import { useStore } from "../../StoreContext";
import { useNavigate } from "../../NavContext";
import Header from "../../layouts/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateRoutine } from "../../components/CreateRoutine";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8];

function getTeacherName(teacherId: string) {
  const t = TEACHERS.find((t) => t.userId === teacherId);
  if (t) return t.name;
  return MOCK_USERS.find((u) => u.id === teacherId)?.name || teacherId;
}

export default function AdminRoutine() {
  const { navigate } = useNavigate();
  const { routineSlots: slots, setRoutineSlots: setSlots } = useStore();
  const [tab, setTab] = useState("list");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [modal, setModal] = useState<{ open: boolean; day: string; period: number; slot?: RoutineSlot }>({ open: false, day: "", period: 0 });

  const [form, setForm] = useState({ subject: "", teacherId: "", room: "", isHoliday: false });

  const uniqueSections = [...new Set(CLASS_GROUPS.map((c) => c.section))];

  function openAdd(day: string, period: number) {
    const existing = slots.find((s) => s.classId === selectedClass && s.day === day && s.period === period);
    if (existing) {
      setForm({ subject: existing.subject, teacherId: existing.teacherId, room: existing.room, isHoliday: existing.isHoliday || false });
      setModal({ open: true, day, period, slot: existing });
    } else {
      setForm({ subject: "", teacherId: "", room: "", isHoliday: false });
      setModal({ open: true, day, period });
    }
  }

  function handleSave() {
    if (!form.subject && !form.isHoliday) return;
    if (!form.teacherId && !form.isHoliday) return;
    if (!form.room && !form.isHoliday) return;
    if (modal.slot) {
      setSlots((prev) => prev.map((s) => s.id === modal.slot!.id ? { ...s, subject: form.subject, teacherId: form.teacherId, room: form.room, isHoliday: form.isHoliday } : s));
    } else {
      const newSlot: RoutineSlot = {
        id: `R${String(slots.length + 1).padStart(3, "0")}`,
        classId: selectedClass,
        day: modal.day,
        period: modal.period,
        subject: form.isHoliday ? "Holiday" : form.subject,
        teacherId: form.isHoliday ? "" : form.teacherId,
        room: form.isHoliday ? "" : form.room,
        schoolId: "SCH001",
        isHoliday: form.isHoliday,
      };
      setSlots((prev) => [...prev, newSlot]);
    }
    setModal({ open: false, day: "", period: 0 });
  }

  function handleDelete(e: React.MouseEvent, slot: RoutineSlot) {
    e.stopPropagation();
    if (confirm("Delete this slot?")) {
      setSlots((prev) => prev.filter((s) => s.id !== slot.id));
    }
  }

  const filteredSlots = slots.filter((s) => {
    if (selectedClass && s.classId !== selectedClass) return false;
    if (selectedTeacher && s.teacherId !== selectedTeacher) return false;
    if (selectedDay && s.day !== selectedDay) return false;
    if (selectedSection) {
      const cls = CLASS_GROUPS.find((c) => c.id === s.classId);
      if (cls?.section !== selectedSection) return false;
    }
    return true;
  });

  function getSlot(day: string, period: number) {
    return filteredSlots.find((s) => s.day === day && s.period === period);
  }

  function handleCreated(classId: string) {
    setSelectedClass(classId);
    setTab("list");
  }

  return (
    <div>
      <Header title="Class Routine" subtitle="Weekly timetable management" />
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="list">Routine List</TabsTrigger>
          <TabsTrigger value="create">Create Routine</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <div className="bg-white rounded-xl border border-slate-100">
            <div className="p-4 border-b border-slate-100 flex flex-wrap gap-3">
              <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 bg-white">
                <option value="">All Classes</option>
                {CLASS_GROUPS.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} ({c.section})</option>
                ))}
              </select>
              <select value={selectedTeacher} onChange={(e) => setSelectedTeacher(e.target.value)} className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 bg-white">
                <option value="">All Teachers</option>
                {TEACHERS.map((t) => (
                  <option key={t.userId} value={t.userId}>{t.name}</option>
                ))}
              </select>
              <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)} className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 bg-white">
                <option value="">All Days</option>
                {DAYS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 bg-white">
                <option value="">All Sections</option>
                {uniqueSections.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
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
                          <td key={day} onClick={() => {
                            if (!selectedClass) return;
                            openAdd(day, period);
                          }} className={`p-1.5 border border-slate-100 min-w-[140px] h-20 align-top cursor-pointer hover:bg-indigo-50/30 transition-colors relative group ${!selectedClass ? 'cursor-default' : ''}`}>
                            {slot ? (
                              <div className={`rounded-lg p-2 h-full ${slot.isHoliday ? 'bg-red-50 border border-red-200' : 'bg-indigo-50'}`}>
                                <div className="flex items-start justify-between">
                                  <div>
                                    {slot.isHoliday ? (
                                      <p className="text-xs font-semibold text-red-600">Holiday / Off</p>
                                    ) : (
                                      <>
                                        <p className="text-xs font-semibold text-indigo-700">{slot.subject}</p>
                                        <button onClick={() => navigate("teachers")} className="text-xs text-slate-500 mt-0.5 hover:text-primary transition-colors block">
                                          {getTeacherName(slot.teacherId)}
                                        </button>
                                        <p className="text-xs text-slate-400">Room {slot.room}</p>
                                      </>
                                    )}
                                  </div>
                                  <button onClick={(e) => handleDelete(e, slot)} className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-red-100 text-red-500 transition-opacity">
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center h-full opacity-0 group-hover:opacity-100 transition-opacity">
                                <Plus size={16} className="text-indigo-400" />
                              </div>
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
        </TabsContent>
        <TabsContent value="create">
          <CreateRoutine onSaved={handleCreated} />
        </TabsContent>
      </Tabs>

      {modal.open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-800">{modal.slot ? "Edit Slot" : "Add Slot"}</h2>
              <button onClick={() => setModal({ open: false, day: "", period: 0 })} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <X size={16} className="text-slate-500" />
              </button>
            </div>
            <div className="text-xs text-slate-400 mb-4">{modal.day} — Period {modal.period}</div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isHoliday" checked={form.isHoliday} onChange={(e) => setForm((prev) => ({ ...prev, isHoliday: e.target.checked }))} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                <label htmlFor="isHoliday" className="text-xs font-medium text-slate-500">Mark as Holiday / Off</label>
              </div>
              {!form.isHoliday && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Subject</label>
                    <input value={form.subject} onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))} placeholder="e.g. Mathematics" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Teacher</label>
                    <select value={form.teacherId} onChange={(e) => setForm((prev) => ({ ...prev, teacherId: e.target.value }))} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 bg-white">
                      <option value="">Select Teacher</option>
                      {TEACHERS.map((t) => (
                        <option key={t.userId} value={t.userId}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Room</label>
                    <input value={form.room} onChange={(e) => setForm((prev) => ({ ...prev, room: e.target.value }))} placeholder="e.g. 201" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setModal({ open: false, day: "", period: 0 })} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">{modal.slot ? "Update Slot" : "Add Slot"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
