import { useState } from "react";
import { Eye, X, Star } from "lucide-react";
import { ASSIGNMENTS as DATA_ASSIGNMENTS, SUBMISSIONS, STUDENTS, CLASS_GROUPS, TEACHERS } from "../../data";
import type { Assignment, AssignmentSubmission } from "../../types";
import Header from "../../layouts/Header";

function getClassName(id: string) {
  return CLASS_GROUPS.find((c) => c.id === id)?.name || id;
}

function getTeacherName(id: string) {
  return TEACHERS.find((t) => t.userId === id)?.name || id;
}

function getStudentName(id: string) {
  return STUDENTS.find((s) => s.id === id)?.name || id;
}

function getClassForStudent(id: string) {
  const s = STUDENTS.find((st) => st.id === id);
  return s ? getClassName(s.classId) : "";
}

export default function AdminAssignments() {
  const [assignments] = useState<Assignment[]>(DATA_ASSIGNMENTS);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [reviewModal, setReviewModal] = useState<{ submission: AssignmentSubmission } | null>(null);
  const [reviewScore, setReviewScore] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(SUBMISSIONS);

  function getSubmissionsForAssignment(assignmentId: string) {
    return submissions.filter((s) => s.assignmentId === assignmentId);
  }

  function handleReview() {
    if (!reviewModal) return;
    const score = Number(reviewScore);
    if (isNaN(score)) return;
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === reviewModal.submission.id
          ? { ...s, score, comment: reviewComment, reviewed: true }
          : s
      )
    );
    setReviewModal(null);
    setReviewScore("");
    setReviewComment("");
  }

  function openReview(sub: AssignmentSubmission) {
    setReviewModal({ submission: sub });
    setReviewScore(sub.score?.toString() || "");
    setReviewComment(sub.comment || "");
  }

  return (
    <div>
      <Header title="Assignments" subtitle="Manage and review assignments" />

      <div className="bg-white rounded-xl border border-slate-100">
        <div className="p-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700">All Assignments</h2>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              {["Title", "Class", "Subject", "Teacher", "Due Date", "Submissions", "Actions"].map((h) => (
                <th key={h} className="text-left text-xs font-medium text-slate-400 px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {assignments.map((a) => {
              const subs = getSubmissionsForAssignment(a.id);
              const isExpanded = expandedId === a.id;
              return (
                <>
                  <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-slate-700">{a.title}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{getClassName(a.classId)}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{a.subject}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{getTeacherName(a.teacherId)}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{a.dueDate}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{subs.length}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : a.id)}
                        className="flex items-center gap-1 px-2.5 py-1.5 text-xs bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 font-medium"
                      >
                        <Eye size={13} /> View
                      </button>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr key={`${a.id}-sub`}>
                      <td colSpan={7} className="px-4 py-3 bg-slate-50/50">
                        {subs.length === 0 ? (
                          <p className="text-xs text-slate-400 py-2">No submissions yet.</p>
                        ) : (
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-slate-200">
                                <th className="text-left text-xs font-medium text-slate-400 px-3 py-2">Student</th>
                                <th className="text-left text-xs font-medium text-slate-400 px-3 py-2">Class</th>
                                <th className="text-left text-xs font-medium text-slate-400 px-3 py-2">Submitted</th>
                                <th className="text-left text-xs font-medium text-slate-400 px-3 py-2">Response</th>
                                <th className="text-left text-xs font-medium text-slate-400 px-3 py-2">Score</th>
                                <th className="text-left text-xs font-medium text-slate-400 px-3 py-2">Status</th>
                                <th className="text-left text-xs font-medium text-slate-400 px-3 py-2">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {subs.map((sub) => (
                                <tr key={sub.id}>
                                  <td className="px-3 py-2 text-xs text-slate-700">{getStudentName(sub.studentId)}</td>
                                  <td className="px-3 py-2 text-xs text-slate-500">{getClassForStudent(sub.studentId)}</td>
                                  <td className="px-3 py-2 text-xs text-slate-500">{sub.submittedAt}</td>
                                  <td className="px-3 py-2 text-xs text-slate-500">{sub.response}</td>
                                  <td className="px-3 py-2 text-xs font-medium text-slate-700">{sub.reviewed ? sub.score : "-"}</td>
                                  <td className="px-3 py-2">
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                      sub.reviewed ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                                    }`}>{sub.reviewed ? "Reviewed" : "Pending"}</span>
                                  </td>
                                  <td className="px-3 py-2">
                                    {!sub.reviewed && (
                                      <button onClick={() => openReview(sub)} className="flex items-center gap-1 px-2 py-1 text-xs bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 font-medium">
                                        <Star size={11} /> Review
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      {reviewModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-800">Review Submission</h2>
              <button onClick={() => { setReviewModal(null); setReviewScore(""); setReviewComment(""); }} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <X size={16} className="text-slate-500" />
              </button>
            </div>
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                Student: <span className="text-slate-700 font-medium">{getStudentName(reviewModal.submission.studentId)}</span>
              </p>
              <p className="text-xs text-slate-500">
                Response: <span className="text-slate-700 font-medium">{reviewModal.submission.response}</span>
              </p>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Score</label>
                <input type="number" value={reviewScore} onChange={(e) => setReviewScore(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Comment</label>
                <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} rows={3} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 resize-none" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => { setReviewModal(null); setReviewScore(""); setReviewComment(""); }} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
              <button onClick={handleReview} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Submit Review</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
