import { useState } from "react";
import { EXAMS, EXAM_MARKS, STUDENTS, CLASS_GROUPS } from "../../data";
import type { ExamMarks, Student } from "../../types";
import Header from "../../layouts/Header";

function getGrade(pct: number): string {
  if (pct >= 90) return "A";
  if (pct >= 75) return "B";
  if (pct >= 60) return "C";
  if (pct >= 40) return "D";
  return "F";
}

function getPassFail(pct: number): string {
  return pct >= 40 ? "Pass" : "Fail";
}

function getClassName(classId: string): string {
  return CLASS_GROUPS.find((c) => c.id === classId)?.name || classId;
}

interface StudentResult {
  student: Student;
  marks: ExamMarks | undefined;
  subjectScores: Record<string, number | null>;
  total: number;
  percentage: number;
  grade: string;
  passFail: string;
  classRank: number;
}

export default function AdminResults() {
  const [selectedExamId, setSelectedExamId] = useState(EXAMS[0]?.id || "");
  const [published, setPublished] = useState(false);

  const exam = EXAMS.find((e) => e.id === selectedExamId);
  const subjects = exam?.subjects || [];

  const studentsInExam = STUDENTS.filter((s) =>
    exam?.applicableClassIds.includes(s.classId)
  );

  const results: StudentResult[] = studentsInExam.map((student) => {
    const marks = EXAM_MARKS.find((m) => m.examId === selectedExamId && m.studentId === student.id);
    const subjectScores: Record<string, number | null> = {};
    let total = 0;
    let subjectCount = 0;

    for (const sub of subjects) {
      const score = marks ? marks.subjectMarks[sub.name] ?? null : null;
      subjectScores[sub.name] = score;
      if (score !== null) {
        total += score;
        subjectCount++;
      }
    }

    const totalFull = subjects.reduce((sum, s) => sum + s.fullMarks, 0);
    const percentage = totalFull > 0 ? Math.round((total / totalFull) * 100) : 0;

    return {
      student,
      marks,
      subjectScores,
      total,
      percentage,
      grade: getGrade(percentage),
      passFail: getPassFail(percentage),
      classRank: 0,
    };
  });

  results.sort((a, b) => b.total - a.total);
  results.forEach((r, i) => {
    r.classRank = i + 1;
  });

  return (
    <div>
      <Header title="Results" subtitle="View and manage exam results" />

      <div className="bg-white rounded-xl border border-slate-100">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-semibold text-slate-700">Marksheet</h2>
            <select
              value={selectedExamId}
              onChange={(e) => setSelectedExamId(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
            >
              {EXAMS.map((e) => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setPublished((p) => !p)}
            className={`px-3 py-2 text-sm rounded-lg font-medium ${
              published
                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            {published ? "Published" : "Publish Results"}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">#</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">Student Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">Class</th>
                {subjects.map((sub) => (
                  <th key={sub.name} className="px-3 py-3 text-center text-xs font-medium text-slate-400">
                    {sub.name}
                  </th>
                ))}
                <th className="px-3 py-3 text-center text-xs font-medium text-slate-400">Total</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-slate-400">Percentage</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-slate-400">Grade</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-slate-400">Pass/Fail</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-slate-400">Rank</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {results.map((r, idx) => (
                <tr key={r.student.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 text-xs text-slate-400">{idx + 1}</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-700">{r.student.name}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{getClassName(r.student.classId)}</td>
                  {subjects.map((sub) => (
                    <td key={sub.name} className="px-3 py-3 text-sm text-center text-slate-700">
                      {r.subjectScores[sub.name] !== null && r.subjectScores[sub.name] !== undefined
                        ? r.subjectScores[sub.name]
                        : "-"}
                    </td>
                  ))}
                  <td className="px-3 py-3 text-sm text-center font-medium text-slate-700">{r.total}</td>
                  <td className="px-3 py-3 text-sm text-center text-slate-700">{r.percentage}%</td>
                  <td className="px-3 py-3 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      r.grade === "A" ? "bg-emerald-50 text-emerald-700" :
                      r.grade === "B" ? "bg-blue-50 text-blue-700" :
                      r.grade === "C" ? "bg-amber-50 text-amber-700" :
                      r.grade === "D" ? "bg-orange-50 text-orange-700" :
                      "bg-red-50 text-red-700"
                    }`}>{r.grade}</span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      r.passFail === "Pass" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                    }`}>{r.passFail}</span>
                  </td>
                  <td className="px-3 py-3 text-sm text-center font-medium text-slate-700">{r.classRank}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
