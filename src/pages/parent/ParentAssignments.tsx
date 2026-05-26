import { useState } from "react";
import { FileText, CheckCircle, Clock } from "lucide-react";
import { STUDENTS, CLASS_GROUPS, ASSIGNMENTS, SUBMISSIONS, TEACHERS, PARENT_STUDENT } from "../../data";

const PARENT_ID = "U009";

export default function ParentAssignments() {
  const children = STUDENTS.filter((s) =>
    PARENT_STUDENT.filter((ps) => ps.parentId === PARENT_ID).some((ps) => ps.studentId === s.id)
  );

  const [selectedStudent, setSelectedStudent] = useState<string>(children[0]?.id ?? "");

  const currentStudent = children.find((s) => s.id === selectedStudent) ?? children[0];

  const assignments = ASSIGNMENTS.filter((a) => a.classId === currentStudent?.classId);

  function isSubmitted(assignmentId: string): boolean {
    return SUBMISSIONS.some((s) => s.assignmentId === assignmentId && s.studentId === currentStudent?.id);
  }

  function getTeacherName(teacherId: string): string {
    const teacher = TEACHERS.find((t) => t.userId === teacherId);
    return teacher?.name ?? "—";
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-800">Assignments</h1>
        <p className="text-sm text-slate-400 mt-0.5">Class assignments and submission status</p>
      </div>

      <div className="mb-6">
        <label className="block text-xs font-medium text-slate-500 mb-1.5">Select Child</label>
        <select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 bg-white"
        >
          {children.map((child) => {
            const cg = CLASS_GROUPS.find((c) => c.id === child.classId);
            return (
              <option key={child.id} value={child.id}>
                {child.name} — {cg?.name ?? child.classId}
              </option>
            );
          })}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              {["Title", "Subject", "Due Date", "Status"].map((h) => (
                <th key={h} className="text-left text-xs font-medium text-slate-400 px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {assignments.map((a) => {
              const submitted = isSubmitted(a.id);
              return (
                <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-slate-400" />
                      <span className="text-sm font-medium text-slate-700">{a.title}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{getTeacherName(a.teacherId)}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{a.subject}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <Clock size={13} className="text-slate-400" />
                      {a.dueDate}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 w-fit ${
                        submitted
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {submitted ? <CheckCircle size={11} /> : <Clock size={11} />}
                      {submitted ? "Submitted" : "Pending"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {assignments.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-6">No assignments found.</p>
        )}
      </div>
    </div>
  );
}
