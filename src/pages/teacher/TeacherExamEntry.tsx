import { useState, useEffect } from "react";
import { Check, AlertCircle } from "lucide-react";
import { CLASS_GROUPS } from "../../data";
import type { Exam, ExamMarks } from "../../types";
import { useStore } from "../../StoreContext";
import { useAuth } from "../../AuthContext";
import Header from "../../layouts/Header";

export default function TeacherExamEntry() {
  const store = useStore();
  const { currentTeacher } = useAuth();
  const teacher = currentTeacher;
  const examsList = store.exams;
  const availableExams = examsList.filter((e) =>
    e.applicableClassIds.some((cid) => teacher?.assignedClassIds?.includes(cid))
  );
  const [selectedExam, setSelectedExam] = useState<Exam | null>(availableExams[0] || null);
  const [selectedClass, setSelectedClass] = useState(teacher?.assignedClassIds?.[0] || "");
  const [marks, setMarks] = useState<Record<string, Record<string, number>>>({});
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({});
  const [saved, setSaved] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const availableClasses = CLASS_GROUPS.filter(
    (c) => teacher?.assignedClassIds?.includes(c.id) && selectedExam?.applicableClassIds.includes(c.id)
  );

  const studentsInClass = store.students.filter((s) => s.classId === selectedClass);
  const hasValidationErrors = Object.values(errors).some((subs) => Object.keys(subs).length > 0);

  const selectionKey = `${selectedExam?.id}-${selectedClass}`;

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (!selectedExam || !selectedClass) return;
    const existingMarksMap: Record<string, Record<string, number>> = {};
    const existingRecords = store.examMarks.filter((m) => m.examId === selectedExam.id);
    for (const record of existingRecords) {
      const student = store.students.find((s) => s.id === record.studentId);
      if (student && student.classId === selectedClass) {
        existingMarksMap[record.studentId] = { ...record.subjectMarks };
      }
    }
    setMarks(existingMarksMap);
    setErrors({});
    setSaveMsg("");
    /* eslint-enable react-hooks/set-state-in-effect */
    // Only re-initialize when exam or class changes, not when store updates
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectionKey]);

  function setMarksForStudent(studentId: string, subject: string, value: string) {
    const num = value === "" ? 0 : Number(value);
    setMarks((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], [subject]: num },
    }));
    setErrors((prev) => {
      const studentErrors = prev[studentId] ? { ...prev[studentId] } : {};
      delete studentErrors[subject];
      if (Object.keys(studentErrors).length === 0) {
        const next = { ...prev };
        delete next[studentId];
        return next;
      }
      return { ...prev, [studentId]: studentErrors };
    });
  }

  function totalMarks(studentId: string) {
    if (!selectedExam) return 0;
    return selectedExam.subjects.reduce((sum, sub) => sum + ((marks[studentId]?.[sub.name]) || 0), 0);
  }

  function fullMarksTotal() {
    if (!selectedExam) return 0;
    return selectedExam.subjects.reduce((sum, sub) => sum + sub.fullMarks, 0);
  }

  function validate(): boolean {
    const newErrors: Record<string, Record<string, string>> = {};
    if (!selectedExam) return false;
    for (const student of studentsInClass) {
      const studentMarks = marks[student.id];
      if (!studentMarks) continue;
      for (const sub of selectedExam.subjects) {
        const val = studentMarks[sub.name];
        if (val === undefined) continue;
        if (val < 0) {
          newErrors[student.id] = { ...newErrors[student.id], [sub.name]: `Negative` };
        } else if (val > sub.fullMarks) {
          newErrors[student.id] = { ...newErrors[student.id], [sub.name]: `Max ${sub.fullMarks}` };
        }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSave() {
    if (!selectedExam || !teacher) return;

    if (!validate()) {
      setSaveMsg("Fix errors before saving");
      return;
    }

    let nextNum = store.examMarks.reduce((max, m) => {
      const num = parseInt(m.id.replace("MK", ""), 10);
      return isNaN(num) ? max : Math.max(max, num);
    }, 900) + 1;

    const updatedMarks: ExamMarks[] = store.examMarks.filter(
      (m) => !(m.examId === selectedExam.id && studentsInClass.some((s) => s.id === m.studentId))
    );

    let savedCount = 0;
    for (const student of studentsInClass) {
      const studentMarks = marks[student.id];
      if (!studentMarks) continue;

      const subjectMarks: Record<string, number> = {};
      for (const sub of selectedExam.subjects) {
        const val = studentMarks[sub.name];
        if (val !== undefined) {
          subjectMarks[sub.name] = val;
        }
      }
      if (Object.keys(subjectMarks).length === 0) continue;

      updatedMarks.push({
        id: `MK${nextNum++}`,
        examId: selectedExam.id,
        studentId: student.id,
        subjectMarks,
        schoolId: "SCH001",
      });
      savedCount++;
    }

    store.setExamMarks(updatedMarks);
    setSaved(true);
    setSaveMsg(`Saved marks for ${savedCount} student${savedCount !== 1 ? "s" : ""}.`);
    setTimeout(() => { setSaved(false); setSaveMsg(""); }, 3000);
  }

  const fm = fullMarksTotal();

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
                  const firstCommon = teacher?.assignedClassIds.find((cid) => exam.applicableClassIds.includes(cid));
                  if (firstCommon) setSelectedClass(firstCommon);
                }
              }}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 bg-white"
            >
              {availableExams.length === 0 && <option value="">No exams available</option>}
              {availableExams.map((ex) => (
                <option key={ex.id} value={ex.id}>{ex.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Class</label>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 bg-white">
              {availableClasses.length === 0 && <option value="">No classes</option>}
              {availableClasses.map((c) => (
                <option key={c.id} value={c.id}>{c.name} ({c.section})</option>
              ))}
            </select>
          </div>
          {selectedExam && (
            <div className="text-xs text-slate-400 ml-auto">
              {studentsInClass.length} student{studentsInClass.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>

        {saved && saveMsg && (
          <div className="mb-4 flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 text-xs rounded-lg">
            <Check size={13} /> {saveMsg}
          </div>
        )}

        {hasValidationErrors && (
          <div className="mb-4 flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 text-xs rounded-lg">
            <AlertCircle size={13} /> Some marks have errors. Fix them before saving.
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left text-xs font-medium text-slate-400 px-3 py-2">Student</th>
                <th className="text-left text-xs font-medium text-slate-400 px-3 py-2">Roll</th>
                {selectedExam?.subjects.map((sub) => (
                  <th key={sub.name} className="text-left text-xs font-medium text-slate-400 px-3 py-2 whitespace-nowrap">{sub.name}<br /><span className="text-[10px] text-slate-300">FM:{sub.fullMarks} PM:{sub.passMarks}</span></th>
                ))}
                <th className="text-left text-xs font-medium text-slate-400 px-3 py-2">Total</th>
                <th className="text-left text-xs font-medium text-slate-400 px-3 py-2">%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {studentsInClass.map((s) => {
                const total = totalMarks(s.id);
                const pct = fm ? Math.round((total / fm) * 100) : 0;
                const studentErrors = errors[s.id] || {};
                const hasStudentError = Object.keys(studentErrors).length > 0;
                return (
                  <tr key={s.id} className={`hover:bg-slate-50/50 ${hasStudentError ? "bg-red-50/30" : ""}`}>
                    <td className="px-3 py-2 text-sm text-slate-700">{s.name}</td>
                    <td className="px-3 py-2 text-sm text-slate-500">{s.rollNumber}</td>
                    {selectedExam?.subjects.map((sub) => {
                      const cellError = studentErrors[sub.name];
                      return (
                        <td key={sub.name} className="px-3 py-2">
                          <input
                            type="number"
                            min={0}
                            max={sub.fullMarks}
                            value={marks[s.id]?.[sub.name] ?? ""}
                            onChange={(e) => setMarksForStudent(s.id, sub.name, e.target.value)}
                            className={`w-20 px-2 py-1 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 ${cellError ? "border-red-400 bg-red-50" : "border-slate-200"}`}
                          />
                          {cellError && <p className="text-[10px] text-red-500 mt-0.5">{cellError}</p>}
                        </td>
                      );
                    })}
                    <td className="px-3 py-2 text-sm font-medium text-slate-700">{total}</td>
                    <td className={`px-3 py-2 text-sm ${pct < 40 ? "text-red-500" : "text-slate-600"}`}>{fm ? `${pct}%` : "-"}</td>
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
        </div>

        <div className="flex justify-end mt-4">
          <button onClick={handleSave} className="flex items-center gap-1 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50" disabled={studentsInClass.length === 0}>
            <Check size={15} /> Save Marks
          </button>
        </div>
      </div>
    </div>
  );
}
