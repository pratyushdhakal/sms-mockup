import { useState, useMemo } from "react";
import { Search, Eye, ArrowLeft } from "lucide-react";
import { EXAMS, EXAM_MARKS, STUDENTS, CLASS_GROUPS, PUBLISHED_RESULTS, setPublishedResult } from "../../data";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../../components/ui/table";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
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

interface ComboStat {
  key: string;
  examId: string;
  classId: string;
  examName: string;
  className: string;
  section: string;
  totalStudents: number;
  enteredCount: number;
  passedCount: number;
  failedCount: number;
  passPercent: number;
  isPublished: boolean;
}

export default function AdminResults() {
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "detail">("list");
  const [selected, setSelected] = useState<{ examId: string; classId: string } | null>(null);
  const [published, setPublished] = useState<Record<string, boolean>>(() => ({ ...PUBLISHED_RESULTS }));

  const combos = useMemo<ComboStat[]>(() => {
    return EXAMS.flatMap((exam) =>
      CLASS_GROUPS
        .filter((cg) => exam.applicableClassIds.includes(cg.id))
        .map((cg) => {
          const key = `${exam.id}-${cg.id}`;
          const students = STUDENTS.filter((s) => s.classId === cg.id);
          const marksEntries = students.map((s) => {
            const marks = EXAM_MARKS.find(
              (m) => m.examId === exam.id && m.studentId === s.id
            );
            return { student: s, marks };
          });
          const enteredCount = marksEntries.filter((m) => m.marks).length;
          const passedCount = marksEntries.filter((m) => {
            if (!m.marks) return false;
            return exam.subjects.every(
              (sub) => (m.marks!.subjectMarks[sub.name] ?? 0) >= sub.passMarks
            );
          }).length;
          return {
            key,
            examId: exam.id,
            classId: cg.id,
            examName: exam.name,
            className: cg.name,
            section: cg.section,
            totalStudents: students.length,
            enteredCount,
            passedCount,
            failedCount: enteredCount - passedCount,
            passPercent: enteredCount > 0 ? Math.round((passedCount / enteredCount) * 100) : 0,
            isPublished: published[key] ?? false,
          };
        })
    );
  }, [published]);

  const filtered = combos.filter(
    (c) =>
      c.examName.toLowerCase().includes(search.toLowerCase()) ||
      c.className.toLowerCase().includes(search.toLowerCase())
  );

  function togglePublish(key: string) {
    const next = !published[key];
    setPublished((prev) => ({ ...prev, [key]: next }));
    setPublishedResult(key, next);
  }

  if (view === "detail" && selected) {
    const exam = EXAMS.find((e) => e.id === selected.examId);
    const classGroup = CLASS_GROUPS.find((c) => c.id === selected.classId);
    const comboKey = `${selected.examId}-${selected.classId}`;
    const isPublished = published[comboKey] ?? false;
    const students = STUDENTS.filter((s) => s.classId === selected.classId);
    let totalFullMarks = 0;

    return (
      <div>
        <Header
          title={exam?.name ?? "Results"}
          subtitle={`${classGroup?.name ?? ""} (${classGroup?.section ?? ""})`}
        />

        <div className="mb-4 flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={() => setView("list")}>
            <ArrowLeft size={14} className="mr-1" /> Back to Results
          </Button>
          <Badge variant={isPublished ? "default" : "secondary"}>
            {isPublished ? "Published" : "Draft"}
          </Badge>
        </div>

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>S.N.</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Roll</TableHead>
                {exam?.subjects.map((sub) => {
                  totalFullMarks += sub.fullMarks;
                  return (
                    <TableHead key={sub.name}>
                      {sub.name} ({sub.fullMarks})
                    </TableHead>
                  );
                })}
                <TableHead>Total</TableHead>
                <TableHead>%</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Result</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={exam ? exam.subjects.length + 6 : 6}
                    className="h-48 text-center text-muted-foreground"
                  >
                    No students in this class
                  </TableCell>
                </TableRow>
              ) : (
                students.map((s, i) => {
                  const marks = EXAM_MARKS.find(
                    (m) => m.examId === selected.examId && m.studentId === s.id
                  );
                  let total = 0;
                  let allPassed = true;

                  return (
                    <TableRow key={s.id}>
                      <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell className="text-muted-foreground">{s.rollNumber}</TableCell>
                      {exam?.subjects.map((sub) => {
                        const obtained = marks?.subjectMarks[sub.name];
                        const hasMarks = marks && obtained !== undefined;
                        if (hasMarks) {
                          total += obtained!;
                          if (obtained! < sub.passMarks) allPassed = false;
                        }
                        return (
                          <TableCell key={sub.name}>
                            {hasMarks ? (
                              <span className={obtained! >= sub.passMarks ? "text-emerald-600" : "text-red-600"}>
                                {obtained}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                        );
                      })}
                      <TableCell className="font-medium">
                        {marks ? `${total}/${totalFullMarks}` : "—"}
                      </TableCell>
                      <TableCell>
                        {marks ? `${Math.round((total / totalFullMarks) * 100)}%` : "—"}
                      </TableCell>
                      <TableCell>
                        {marks ? (
                          <span className="font-semibold text-primary">{getGrade((total / totalFullMarks) * 100)}</span>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell>
                        {marks ? (
                          allPassed ? (
                            <Badge variant="default" className="bg-emerald-600">Pass</Badge>
                          ) : (
                            <Badge variant="destructive">Fail</Badge>
                          )
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Exam Results" />

      <div className="rounded-lg border bg-card">
        <div className="flex items-center justify-between p-3 border-b">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by exam or class..."
              className="pl-8 h-8 w-64 text-sm"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Exam</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Students</TableHead>
              <TableHead>Entered</TableHead>
              <TableHead>Passed</TableHead>
              <TableHead>Failed</TableHead>
              <TableHead>Pass %</TableHead>
              <TableHead>Published</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-48 text-center text-muted-foreground">
                  No results found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((combo) => (
                <TableRow key={combo.key}>
                  <TableCell className="font-medium">{combo.examName}</TableCell>
                  <TableCell>{combo.className}</TableCell>
                  <TableCell className="text-muted-foreground">{combo.section}</TableCell>
                  <TableCell>{combo.totalStudents}</TableCell>
                  <TableCell>
                    <span className={combo.enteredCount === combo.totalStudents && combo.totalStudents > 0 ? "text-emerald-600" : ""}>
                      {combo.enteredCount}/{combo.totalStudents}
                    </span>
                  </TableCell>
                  <TableCell className="text-emerald-600">{combo.passedCount}</TableCell>
                  <TableCell className="text-red-600">{combo.failedCount}</TableCell>
                  <TableCell>
                    {combo.enteredCount > 0 ? (
                      <Badge variant={combo.passPercent >= 60 ? "default" : "destructive"}>
                        {combo.passPercent}%
                      </Badge>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => togglePublish(combo.key)}
                      disabled={combo.enteredCount === 0}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        combo.isPublished ? "bg-primary" : "bg-input"
                      } ${combo.enteredCount === 0 ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${
                          combo.isPublished ? "translate-x-[18px]" : "translate-x-[3px]"
                        }`}
                      />
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => { setSelected({ examId: combo.examId, classId: combo.classId }); setView("detail"); }} title="View details">
                      <Eye size={14} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
