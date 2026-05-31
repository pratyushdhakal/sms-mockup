import { useState } from "react";
import { Check } from "lucide-react";
import { TEACHERS, CLASS_GROUPS } from "../../data";
import type { Exam } from "../../types";
import { useStore } from "../../StoreContext";
import Header from "../../layouts/Header";

export default function TeacherExamEntry() {
  const store = useStore();
  const teacherList = store.teachers.length > 0 ? store.teachers : TEACHERS;
  const teacher = teacherList[0];
  const examsList = store.exams;
  const availableExams = examsList.filter((e) =>
    e.applicableClassIds.some((cid) => teacher?.assignedClassIds?.includes(cid))
  );
  const [selectedExam, setSelectedExam] = useState<Exam | null>(availableExams[0] || null);
  const [selectedClass, setSelectedClass] = useState(teacher?.assignedClassIds?.[0] || "");
  const [marks, setMarks] = useState<Record<string, Record<string, number>>>({});
  const [saved, setSaved] = useState(false);

  const availableClasses = CLASS_GROUPS.filter(
    (c) => teacher?.assignedClassIds?.includes(c.id) && selectedExam?.applicableClassIds.includes(c.id)
  );

  const studentsInClass = store.students.filter((s) => s.classId === selectedClass);

  function setMarksForStudent(studentId: string, subject: string, value: string) {
    const num = value === "" ? 0 : Number(value);
    setMarks((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], [subject]: num },
    }));
  }

  function totalMarks(studentId: string) {
    if (!selectedExam) return 0;
    return selectedExam.subjects.reduce((sum, sub) => sum + ((marks[studentId]?.[sub.name]) || 0), 0);
  }

  function fullMarks() {
    if (!selectedExam) return 0;
    return selectedExam.subjects.reduce((sum, sub) => sum + sub.fullMarks, 0);
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <Header title="Exam Entry" subtitle="Record student exam marks" />

      <div className="bg-white rounded-xl border border-slate-100 p-5">
        <div className="flex flex-wrap items-center gap-4 mb-5">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Exam</label>
            <select
              value={selectedExam?.id || ""}
              onChange={(e) => {
                const exam = availableExams.find((ex) => ex.id === e.target.value) || null;
                setSelectedExam(exam);
                if (exam) {
                  const firstCommon = teacher.assignedClassIds.find((cid) => exam.applicableClassIds.includes(cid));
                  if (firstCommon) setSelectedClass(firstCommon);
                }
              }}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 bg-white"
            >
              {availableExams.map((ex) => (
                <option key={ex.id} value={ex.id}>{ex.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Class</label>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 bg-white">
              {availableClasses.map((c) => (
                <option key={c.id} value={c.id}>{c.name} ({c.section})</option>
              ))}
            </select>
          </div>
        </div>

        {saved && (
          <div className="mb-4 flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 text-xs rounded-lg">
            <Check size={13} /> Marks saved successfully.
          </div>
        )}

        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-xs font-medium text-slate-400 px-3 py-2">Student</th>
              <th className="text-left text-xs font-medium text-slate-400 px-3 py-2">Roll</th>
              {selectedExam?.subjects.map((sub) => (
                <th key={sub.name} className="text-left text-xs font-medium text-slate-400 px-3 py-2">{sub.name} ({sub.fullMarks})</th>
              ))}
              <th className="text-left text-xs font-medium text-slate-400 px-3 py-2">Total</th>
              <th className="text-left text-xs font-medium text-slate-400 px-3 py-2">%</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {studentsInClass.map((s) => {
              const total = totalMarks(s.id);
              const fm = fullMarks();
              return (
                <tr key={s.id} className="hover:bg-slate-50/50">
                  <td className="px-3 py-2 text-sm text-slate-700">{s.name}</td>
                  <td className="px-3 py-2 text-sm text-slate-500">{s.rollNumber}</td>
                  {selectedExam?.subjects.map((sub) => (
                    <td key={sub.name} className="px-3 py-2">
                      <input
                        type="number"
                        value={marks[s.id]?.[sub.name] ?? ""}
                        onChange={(e) => setMarksForStudent(s.id, sub.name, e.target.value)}
                        className="w-20 px-2 py-1 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
                      />
                    </td>
                  ))}
                  <td className="px-3 py-2 text-sm font-medium text-slate-700">{total}</td>
                  <td className="px-3 py-2 text-sm text-slate-600">{fm ? `${Math.round((total / fm) * 100)}%` : "-"}</td>
                </tr>
              );
            })}
            {studentsInClass.length === 0 && (
              <tr>
                <td colSpan={selectedExam ? selectedExam.subjects.length + 4 : 4} className="px-3 py-6 text-center text-sm text-slate-400">No students in this class.</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex justify-end mt-4">
          <button onClick={handleSave} className="flex items-center gap-1 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">
            Save Marks
          </button>
        </div>
      </div>
    </div>
  );
}
