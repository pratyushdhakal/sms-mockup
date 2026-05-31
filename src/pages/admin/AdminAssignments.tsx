import { useState, useMemo } from "react";
import { Eye, X, Star } from "lucide-react";
import { ASSIGNMENTS as DATA_ASSIGNMENTS, SUBMISSIONS, STUDENTS, CLASS_GROUPS, TEACHERS, CLASSES_LIST, SECTIONS, BATCHES, SUBJECTS } from "../../data";
import type { Assignment, AssignmentSubmission } from "../../types";
import Header from "../../layouts/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddAssignment } from "@/components/AddAssignment";
import { CategoryManager } from "@/components/CategoryManager";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [filterClass, setFilterClass] = useState("all");
  const [filterBatch, setFilterBatch] = useState("all");
  const [filterSection, setFilterSection] = useState("all");
  const [filterSubject, setFilterSubject] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredAssignments = useMemo(() => {
    return assignments.filter((a) => {
      const classGroup = CLASS_GROUPS.find((c) => c.id === a.classId);
      const matchClass = filterClass === "all" || classGroup?.name === filterClass;
      const matchSection = filterSection === "all" || classGroup?.section === filterSection;
      const matchSubject = filterSubject === "all" || a.subject === filterSubject;
      const matchBatch = filterBatch === "all" || a.batch === filterBatch;
      return matchClass && matchSection && matchSubject && matchBatch;
    });
  }, [assignments, filterClass, filterBatch, filterSection, filterSubject]);
  
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

  const allSubmissions = useMemo(
    () =>
      submissions.map((s) => {
        const assignment = assignments.find((a) => a.id === s.assignmentId);
        return { ...s, assignment };
      }),
    [submissions, assignments]
  );

  const recentAssignments = useMemo(
    () => [...assignments].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5),
    [assignments]
  );

  const ledgerData = useMemo(
    () =>
      assignments.map((a) => {
        const subs = submissions.filter((s) => s.assignmentId === a.id);
        const reviewed = subs.filter((s) => s.reviewed).length;
        const pending = subs.filter((s) => !s.reviewed).length;
        return { ...a, totalSubs: subs.length, reviewed, pending };
      }),
    [assignments, submissions]
  );

  const staffLedger = useMemo(() => {
    const map = new Map<
      string,
      { teacherName: string; assignments: typeof ledgerData; totalSubs: number; totalReviewed: number; totalPending: number }
    >();
    for (const a of ledgerData) {
      const tid = a.teacherId;
      if (!map.has(tid))
        map.set(tid, { teacherName: getTeacherName(tid), assignments: [], totalSubs: 0, totalReviewed: 0, totalPending: 0 });
      const entry = map.get(tid)!;
      entry.assignments.push(a);
      entry.totalSubs += a.totalSubs;
      entry.totalReviewed += a.reviewed;
      entry.totalPending += a.pending;
    }
    return Array.from(map.values());
  }, [ledgerData]);

  return (
    <div>
      <Header title="Assignments" subtitle="Manage and review assignments" />
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="mb-4 flex flex-wrap">
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="create">Add/View</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="submitted">Submitted Assignments</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="ledger">Ledger</TabsTrigger>
          <TabsTrigger value="staff-ledger">Staff Ledger</TabsTrigger>
          <TabsTrigger value="student-assignment">Student's Assignment</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <div className="flex gap-4 mb-4">
            <Select value={filterBatch} onValueChange={setFilterBatch}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Batch" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Batches</SelectItem>
                {BATCHES.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterClass} onValueChange={setFilterClass}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Class" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {CLASSES_LIST.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterSection} onValueChange={setFilterSection}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Section" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sections</SelectItem>
                {SECTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterSubject} onValueChange={setFilterSubject}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Subject" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {SUBJECTS.map(s => <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
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
                {filteredAssignments.map((a) => {
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
        </TabsContent>
        <TabsContent value="create">
          <AddAssignment />
        </TabsContent>
        <TabsContent value="categories">
          <CategoryManager />
        </TabsContent>
        <TabsContent value="submitted">
          <div className="bg-white rounded-xl border border-slate-100">
            <div className="p-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-700">Submitted Assignments</h2>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  {["Student", "Assignment", "Class", "Submitted", "Score", "Status"].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-slate-400 px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {allSubmissions.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 text-sm font-medium text-slate-700">{getStudentName(s.studentId)}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{s.assignment?.title || "-"}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{s.assignment ? getClassName(s.assignment.classId) : "-"}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{s.submittedAt}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-700">{s.reviewed ? s.score : "-"}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        s.reviewed ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                      }`}>{s.reviewed ? "Reviewed" : "Pending"}</span>
                    </td>
                  </tr>
                ))}
                {allSubmissions.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-400">No submissions yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
        <TabsContent value="recent">
          <div className="bg-white rounded-xl border border-slate-100">
            <div className="p-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-700">Recently Created Assignments</h2>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  {["Title", "Class", "Subject", "Teacher", "Created", "Due Date"].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-slate-400 px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentAssignments.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 text-sm font-medium text-slate-700">{a.title}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{getClassName(a.classId)}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{a.subject}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{getTeacherName(a.teacherId)}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{a.createdAt}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{a.dueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        <TabsContent value="ledger">
          <div className="bg-white rounded-xl border border-slate-100">
            <div className="p-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-700">Assignment Ledger</h2>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  {["Title", "Class", "Subject", "Teacher", "Due Date", "Total Subs", "Reviewed", "Pending"].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-slate-400 px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {ledgerData.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 text-sm font-medium text-slate-700">{a.title}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{getClassName(a.classId)}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{a.subject}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{getTeacherName(a.teacherId)}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{a.dueDate}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-700">{a.totalSubs}</td>
                    <td className="px-4 py-3 text-sm text-emerald-600 font-medium">{a.reviewed}</td>
                    <td className="px-4 py-3 text-sm text-amber-600 font-medium">{a.pending}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        <TabsContent value="staff-ledger">
          <div className="space-y-4">
            {staffLedger.map((teacher) => (
              <div key={teacher.teacherName} className="bg-white rounded-xl border border-slate-100">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-700">{teacher.teacherName}</h2>
                  <span className="text-xs text-slate-500">
                    {teacher.totalSubs} subs | {teacher.totalReviewed} reviewed | {teacher.totalPending} pending
                  </span>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      {["Title", "Class", "Subject", "Due Date", "Total Subs", "Reviewed", "Pending"].map((h) => (
                        <th key={h} className="text-left text-xs font-medium text-slate-400 px-4 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {teacher.assignments.map((a: any) => (
                      <tr key={a.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 text-sm font-medium text-slate-700">{a.title}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{getClassName(a.classId)}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{a.subject}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{a.dueDate}</td>
                        <td className="px-4 py-3 text-sm font-medium text-slate-700">{a.totalSubs}</td>
                        <td className="px-4 py-3 text-sm text-emerald-600 font-medium">{a.reviewed}</td>
                        <td className="px-4 py-3 text-sm text-amber-600 font-medium">{a.pending}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="student-assignment">
          <div className="bg-white rounded-xl border border-slate-100">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-700">Student's Assignment</h2>
              <div className="flex items-center gap-2">
                <Select value={filterBatch} onValueChange={setFilterBatch}>
                  <SelectTrigger className="w-[140px] h-8"><SelectValue placeholder="Batch" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Batches</SelectItem>
                    {BATCHES.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={filterClass} onValueChange={setFilterClass}>
                  <SelectTrigger className="w-[140px] h-8"><SelectValue placeholder="Class" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {CLASSES_LIST.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  {["Student", "Class", "Pending Assignments", "Submitted", "Reviewed", "Avg Score"].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-slate-400 px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {(() => {
                  const classFiltered = filterClass === "all" ? STUDENTS : STUDENTS.filter(s => CLASS_GROUPS.find(c => c.id === s.classId)?.name === filterClass);
                  const batchFiltered = filterBatch === "all" ? classFiltered : classFiltered.filter(s => s.batch === filterBatch);
                  return batchFiltered.map((student) => {
                    const studentSubs = submissions.filter((s) => s.studentId === student.id);
                    const pending = studentSubs.filter((s) => !s.reviewed).length;
                    const submitted = studentSubs.length;
                    const reviewed = studentSubs.filter((s) => s.reviewed);
                    const avgScore = reviewed.length > 0 ? Math.round(reviewed.reduce((sum, r) => sum + (r.score || 0), 0) / reviewed.length) : 0;
                    return (
                      <tr key={student.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 text-sm font-medium text-slate-700">{student.name}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{getClassName(student.classId)}</td>
                        <td className="px-4 py-3 text-sm text-amber-600 font-medium">{pending}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{submitted}</td>
                        <td className="px-4 py-3 text-sm text-emerald-600 font-medium">{reviewed.length}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{avgScore || "-"}</td>
                      </tr>
                    );
                  });
                })()}
                {STUDENTS.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-400">No students found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

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
