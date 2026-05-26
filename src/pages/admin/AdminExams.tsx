import { useState } from "react";
import { Plus, X, Trash2 } from "lucide-react";
import { EXAMS as DATA_EXAMS, CLASS_GROUPS } from "../../data";
import type { Exam, ExamSubject } from "../../types";
import Header from "../../layouts/Header";

const INIT_SUBJECT = { name: "", fullMarks: 0, passMarks: 0 };

export default function AdminExams() {
  const [exams, setExams] = useState<Exam[]>(DATA_EXAMS);
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState("");
  const [formClasses, setFormClasses] = useState<string[]>([]);
  const [formStart, setFormStart] = useState("");
  const [formEnd, setFormEnd] = useState("");
  const [formSubjects, setFormSubjects] = useState<(ExamSubject & { _key: number })[]>([]);
  let subjKey = 0;

  function toggleClass(id: string) {
    setFormClasses((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  function addSubject() {
    setFormSubjects((prev) => [...prev, { ...INIT_SUBJECT, _key: ++subjKey }]);
  }

  function removeSubject(key: number) {
    setFormSubjects((prev) => prev.filter((s) => s._key !== key));
  }

  function updateSubject(key: number, field: keyof ExamSubject, value: string | number) {
    setFormSubjects((prev) =>
      prev.map((s) => (s._key === key ? { ...s, [field]: value } : s))
    );
  }

  function resetForm() {
    setFormName("");
    setFormClasses([]);
    setFormStart("");
    setFormEnd("");
    setFormSubjects([]);
  }

  function handleCreate() {
    if (!formName || !formStart || !formEnd || formClasses.length === 0 || formSubjects.length === 0) return;
    const newExam: Exam = {
      id: `EX${String(exams.length + 1).padStart(3, "0")}`,
      name: formName,
      applicableClassIds: formClasses,
      startDate: formStart,
      endDate: formEnd,
      subjects: formSubjects.map(({ _key, ...s }) => s),
      schoolId: "SCH001",
    };
    setExams((prev) => [newExam, ...prev]);
    resetForm();
    setShowForm(false);
  }

  const getClassNames = (ids: string[]) =>
    ids.map((id) => CLASS_GROUPS.find((c) => c.id === id)?.name || id).join(", ");

  return (
    <div>
      <Header title="Exams" subtitle="Manage exams and results" />

      <div className="bg-white rounded-xl border border-slate-100">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700">All Exams</h2>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <Plus size={14} /> Create Exam
          </button>
        </div>

        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {exams.map((exam) => (
            <div key={exam.id} className="border border-slate-100 rounded-xl p-4 hover:shadow-sm transition-shadow flex flex-col">
              <h3 className="text-sm font-semibold text-slate-800 mb-2">{exam.name}</h3>
              <div className="space-y-1.5 text-xs text-slate-500 mb-2">
                <p>Classes: <span className="text-slate-700 font-medium">{getClassNames(exam.applicableClassIds)}</span></p>
                <p>Date: <span className="text-slate-700 font-medium">{exam.startDate} — {exam.endDate}</span></p>
              </div>
              <div className="border-t border-slate-100 pt-2 mb-3">
                <p className="text-xs font-medium text-slate-500 mb-1.5">Subjects</p>
                {exam.subjects.map((sub) => (
                  <div key={sub.name} className="flex items-center justify-between text-xs text-slate-600 py-0.5">
                    <span>{sub.name}</span>
                    <span className="text-slate-400">FM: {sub.fullMarks} / PM: {sub.passMarks}</span>
                  </div>
                ))}
              </div>
              <div className="mt-auto flex gap-2">
                <button className="flex-1 px-3 py-1.5 text-xs bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 font-medium">
                  View Marks
                </button>
                <button className="flex-1 px-3 py-1.5 text-xs bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 font-medium">
                  Report Cards
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 flex-shrink-0">
              <h2 className="font-semibold text-slate-800">Create New Exam</h2>
              <button onClick={() => { resetForm(); setShowForm(false); }} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <X size={16} className="text-slate-500" />
              </button>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Exam Name</label>
                <input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="e.g. First Terminal Exam" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Applicable Classes</label>
                <div className="grid grid-cols-3 gap-2">
                  {CLASS_GROUPS.map((c) => (
                    <label key={c.id} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                      <input type="checkbox" checked={formClasses.includes(c.id)} onChange={() => toggleClass(c.id)} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                      {c.name} ({c.section})
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Start Date</label>
                  <input type="date" value={formStart} onChange={(e) => setFormStart(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">End Date</label>
                  <input type="date" value={formEnd} onChange={(e) => setFormEnd(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-slate-500">Subjects</label>
                  <button onClick={addSubject} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">+ Add Subject</button>
                </div>
                <div className="space-y-2">
                  {formSubjects.map((sub) => (
                    <div key={sub._key} className="flex items-center gap-2 bg-slate-50 rounded-lg p-2">
                      <input value={sub.name} onChange={(e) => updateSubject(sub._key, "name", e.target.value)} placeholder="Subject" className="flex-1 px-2 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500/30" />
                      <input value={sub.fullMarks || ""} onChange={(e) => updateSubject(sub._key, "fullMarks", Number(e.target.value))} type="number" placeholder="FM" className="w-16 px-2 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500/30" />
                      <input value={sub.passMarks || ""} onChange={(e) => updateSubject(sub._key, "passMarks", Number(e.target.value))} type="number" placeholder="PM" className="w-16 px-2 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500/30" />
                      <button onClick={() => removeSubject(sub._key)} className="text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-5 border-t border-slate-100 flex-shrink-0">
              <button onClick={() => { resetForm(); setShowForm(false); }} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
              <button onClick={handleCreate} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Create Exam</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
