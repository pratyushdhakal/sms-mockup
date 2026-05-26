import { useState } from "react";
import { FileText, Plus, X, CheckCircle } from "lucide-react";
import { ASSIGNMENTS, SUBMISSIONS, TEACHERS } from "../../data";
import type { Assignment } from "../../types";

const STUDENT_CLASS_ID = "C003";
const STUDENT_ID = "STU-601";

export default function StudentAssignments() {
  const assignments = ASSIGNMENTS.filter((a) => a.classId === STUDENT_CLASS_ID);
  const [submissions, setSubmissions] = useState(SUBMISSIONS);
  const [selected, setSelected] = useState<Assignment | null>(null);
  const [showForm, setShowForm] = useState<Assignment | null>(null);
  const [form, setForm] = useState({ response: "", fileUrl: "" });

  function getTeacherName(teacherId: string): string {
    const teacher = TEACHERS.find((t) => t.userId === teacherId);
    return teacher?.name ?? "—";
  }

  function isSubmitted(assignmentId: string): boolean {
    return submissions.some((s) => s.assignmentId === assignmentId && s.studentId === STUDENT_ID);
  }

  function handleSubmit() {
    if (!showForm || !form.response) return;
    const newSub = {
      id: `SUB${Date.now()}`,
      assignmentId: showForm.id,
      studentId: STUDENT_ID,
      response: form.response,
      fileUrl: form.fileUrl || undefined,
      submittedAt: new Date().toISOString().split("T")[0],
      reviewed: false,
      schoolId: "SCH001",
    };
    setSubmissions((prev) => [...prev, newSub]);
    setShowForm(null);
    setForm({ response: "", fileUrl: "" });
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-800">Assignments</h1>
        <p className="text-sm text-slate-400 mt-0.5">Class assignments and submissions</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {assignments.map((a) => {
          const submitted = isSubmitted(a.id);
          return (
            <div
              key={a.id}
              className="bg-white rounded-xl border border-slate-100 p-4 hover:shadow-sm transition-shadow cursor-pointer"
              onClick={() => setSelected(a)}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                  <FileText size={18} className="text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-800 text-sm">{a.title}</h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        submitted
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {submitted ? "Submitted" : "Pending"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {a.subject} · {getTeacherName(a.teacherId)} · Due: {a.dueDate}
                  </p>
                </div>
                {!submitted && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowForm(a);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    <Plus size={12} /> Submit
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {assignments.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-6">No assignments found.</p>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="font-semibold text-slate-800">{selected.title}</h2>
              <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <X size={16} className="text-slate-500" />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <span className="text-xs font-medium text-slate-500">Subject</span>
                <p className="text-sm text-slate-700">{selected.subject}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500">Teacher</span>
                <p className="text-sm text-slate-700">{getTeacherName(selected.teacherId)}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500">Due Date</span>
                <p className="text-sm text-slate-700">{selected.dueDate}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500">Description</span>
                <p className="text-sm text-slate-600 mt-1">{selected.description}</p>
              </div>
              {isSubmitted(selected.id) && (
                <div className="flex items-center gap-2 text-sm text-emerald-600">
                  <CheckCircle size={14} />
                  You have submitted this assignment
                </div>
              )}
            </div>
            <div className="flex justify-end px-5 pb-5">
              <button onClick={() => setSelected(null)} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="font-semibold text-slate-800">Submit: {showForm.title}</h2>
              <button onClick={() => setShowForm(null)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <X size={16} className="text-slate-500" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Response</label>
                <textarea
                  rows={4}
                  value={form.response}
                  onChange={(e) => setForm((f) => ({ ...f, response: e.target.value }))}
                  placeholder="Enter your response…"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">File URL (optional)</label>
                <input
                  type="text"
                  value={form.fileUrl}
                  onChange={(e) => setForm((f) => ({ ...f, fileUrl: e.target.value }))}
                  placeholder="https://example.com/file.pdf"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 px-5 pb-5">
              <button onClick={() => setShowForm(null)} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">
                Cancel
              </button>
              <button onClick={handleSubmit} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
