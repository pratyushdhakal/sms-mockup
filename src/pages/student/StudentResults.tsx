import { Award, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "../../AuthContext";
import { useStore } from "../../StoreContext";
import Header from "../../layouts/Header";

function getGrade(pct: number): string {
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B+";
  if (pct >= 60) return "B";
  if (pct >= 50) return "C+";
  if (pct >= 40) return "C";
  return "D";
}

export default function StudentResults() {
  const { currentStudent } = useAuth();
  const { exams, examMarks } = useStore();
  const classId = currentStudent?.classId || "";
  const studentId = currentStudent?.id || "";

  const relevantExams = exams.filter(
    (e) => e.applicableClassIds.includes(classId)
  );

  return (
    <div>
      <Header title="My Results" subtitle="Exam results and performance" userName={currentStudent?.name} userRole="Student" />

      <div className="grid grid-cols-1 gap-6">
        {relevantExams.map((exam) => {
          const marks = examMarks.find((m) => m.examId === exam.id && m.studentId === studentId);
          let totalMarks = 0;
          let totalFullMarks = 0;

          return (
            <div key={exam.id} className="bg-white rounded-xl border border-slate-100 overflow-hidden">
              <div className="flex items-center gap-3 p-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <Award size={18} className="text-indigo-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-800 text-sm">{exam.name}</h2>
                  <p className="text-xs text-slate-400">{exam.startDate} — {exam.endDate}</p>
                </div>
              </div>

              {marks ? (
                <div>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/50">
                        {["Subject", "Marks", "Full Marks", "Pass Marks", "Percentage", "Grade", "Result"].map((h) => (
                          <th key={h} className="text-left text-xs font-medium text-slate-400 px-4 py-3">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {exam.subjects.map((subj) => {
                        const obtained = marks.subjectMarks[subj.name] ?? 0;
                        const pct = Math.round((obtained / subj.fullMarks) * 100);
                        const passed = obtained >= subj.passMarks;
                        totalMarks += obtained;
                        totalFullMarks += subj.fullMarks;
                        return (
                          <tr key={subj.name} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-4 py-3 text-sm font-medium text-slate-700">{subj.name}</td>
                            <td className="px-4 py-3 text-sm text-slate-600">{obtained}</td>
                            <td className="px-4 py-3 text-sm text-slate-600">{subj.fullMarks}</td>
                            <td className="px-4 py-3 text-sm text-slate-600">{subj.passMarks}</td>
                            <td className="px-4 py-3 text-sm text-slate-600">{pct}%</td>
                            <td className="px-4 py-3">
                              <span className="text-sm font-semibold text-indigo-600">{getGrade(pct)}</span>
                            </td>
                            <td className="px-4 py-3">
                              {passed ? (
                                <span className="flex items-center gap-1 text-xs text-emerald-600">
                                  <CheckCircle size={12} /> Pass
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-xs text-red-600">
                                  <XCircle size={12} /> Fail
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div className="bg-slate-50/50 border-t border-slate-100 p-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <span className="text-xs text-slate-400">Total</span>
                        <p className="text-sm font-semibold text-slate-800">{totalMarks}/{totalFullMarks}</p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400">Overall Percentage</span>
                        <p className="text-sm font-semibold text-slate-800">
                          {totalFullMarks > 0 ? Math.round((totalMarks / totalFullMarks) * 100) : 0}%
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400">Overall Grade</span>
                        <p className="text-sm font-semibold text-indigo-600">
                          {totalFullMarks > 0 ? getGrade((totalMarks / totalFullMarks) * 100) : "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-400 text-center py-6">No marks recorded yet.</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
