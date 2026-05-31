import { useState } from "react";
import { FileText, Plus, X, CheckCircle, Star } from "lucide-react";
import type { Assignment, AssignmentSubmission } from "../../types";
import { useAuth } from "../../AuthContext";
import { useStore } from "../../StoreContext";
import Header from "../../layouts/Header";

export default function StudentAssignments() {
  const { currentStudent } = useAuth();
  const store = useStore();
  const student = currentStudent;
  const studentId = student?.id || "";
  const classId = student?.classId || "";
  const assignments = store.assignments.filter((a) => a.classId === classId);
  const [submissions, setSubmissions] = useState(store.assignmentSubmissions);
  const [selected, setSelected] = useState<Assignment | null>(null);
  const [showForm, setShowForm] = useState<Assignment | null>(null);
  const [form, setForm] = useState({ response: "", fileUrl: "" });

  function getTeacherName(teacherId: string): string {
    const teacher = store.teachers.find((t) => t.userId === teacherId);
    return teacher?.name ?? "—";
  }

  function getSubmission(assignmentId: string): AssignmentSubmission | undefined {
    return submissions.find((s) => s.assignmentId === assignmentId && s.studentId === studentId);
  }

  function isSubmitted(assignmentId: string): boolean {
    return !!getSubmission(assignmentId);
  }

  function handleSubmit() {
    if (!showForm || !form.response) return;
    const newSub = {
      id: `SUB${Date.now()}`,
      assignmentId: showForm.id,
      studentId,
      response: form.response,
      fileUrl: form.fileUrl || undefined,
      submittedAt: new Date().toISOString().split("T")[0],
      reviewed: false,
      schoolId: "SCH001",
    };
    setSubmissions((prev) => [...prev, newSub]);
    store.setAssignmentSubmissions((prev) => [...prev, newSub]);
    setShowForm(null);
    setForm({ response: "", fileUrl: "" });
  }

  return (
    <div>
      <Header title="Assignments" subtitle="Class assignments and submissions" userName={student?.name} userRole="Student" />

      <div className="grid grid-cols-1 gap-4">
        {assignments.map((a) => {
          const submitted = isSubmitted(a.id);
          const sub = getSubmission(a.id);
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
                          ? sub?.reviewed
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-sky-50 text-sky-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {submitted ? (sub?.reviewed ? "Graded" : "Submitted") : "Pending"}
                    </span>
                    {sub?.reviewed && sub.score != null && (
                      <span className="text-xs flex items-center gap-0.5 text-amber-600 font-medium">
                        <Star size={11} /> {sub.score}
                      </span>
                    )}
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
              {isSubmitted(selected.id) && (() => {
                const sub = getSubmission(selected.id);
                return (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-emerald-600">
                      <CheckCircle size={14} />
                      Submitted on {sub?.submittedAt}
                    </div>
                    {sub?.reviewed && (
                      <>
                        {sub.score != null && (
                          <div>
                            <span className="text-xs font-medium text-slate-500">Score</span>
                            <p className="text-lg font-bold text-amber-600 flex items-center gap-1">
                              <Star size={15} /> {sub.score}
                            </p>
                          </div>
                        )}
                        {sub.comment && (
                          <div>
                            <span className="text-xs font-medium text-slate-500">Teacher Comment</span>
                            <p className="text-sm text-slate-700 mt-0.5 bg-slate-50 rounded-lg p-3">{sub.comment}</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })()}
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
