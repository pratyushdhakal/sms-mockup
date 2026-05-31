import { useState, useMemo } from "react";
import { ArrowLeft, GraduationCap, DollarSign, Fingerprint, BarChart3, BookOpen } from "lucide-react";
import { useNavigate } from "../../NavContext";
import { STUDENTS, FEE_RECORDS, ATTENDANCE, EXAM_MARKS, EXAMS, SUBMISSIONS, ASSIGNMENTS, CLASS_GROUPS } from "../../data";
import Header from "../../layouts/Header";
import Breadcrumb from "../../components/Breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminStudentDetail() {
  const { viewEntity, navigate } = useNavigate();
  const [tab, setTab] = useState("profile");

  const student = useMemo(() => STUDENTS.find((s) => s.id === viewEntity?.id), [viewEntity]);
  const classGroup = useMemo(() => CLASS_GROUPS.find((c) => c.id === student?.classId), [student]);

  if (!student) {
    return (
      <div>
        <Header title="Student Detail" />
        <div className="text-center py-16 text-muted-foreground text-sm">
          No student selected.
          <br />
          <Button variant="outline" size="sm" className="mt-3" onClick={() => navigate("students")}>
            Back to Students
          </Button>
        </div>
      </div>
    );
  }

  const fees = FEE_RECORDS.filter((r) => r.studentId === student.id);
  const attendanceRecords = ATTENDANCE.filter((r) => r.userId === student.userId);
  const examMarks = EXAM_MARKS.filter((m) => m.studentId === student.id);
  const submissions = SUBMISSIONS.filter((s) => s.studentId === student.id);

  const tabs = [
    { id: "profile", label: "Profile", icon: GraduationCap },
    { id: "fees", label: "Fees", icon: DollarSign },
    { id: "attendance", label: "Attendance", icon: Fingerprint },
    { id: "results", label: "Results", icon: BarChart3 },
    { id: "assignments", label: "Assignments", icon: BookOpen },
  ];

  const fields: [string, string][] = [
    ["Student ID", student.id],
    ["Full Name", student.name],
    ["Class", classGroup ? `${classGroup.name} (${classGroup.section})` : student.classId],
    ["Roll Number", student.rollNumber],
    ["Batch", student.batch],
    ["Gender", student.gender],
    ["Date of Birth", student.dob],
    ["Blood Group", student.bloodGroup],
    ["Nationality", student.nationality],
    ["Religion", student.religion],
    ["Mother Tongue", student.motherTongue],
    ["Ethnic Group", student.ethnicGroup],
    ["Phone", student.phone],
    ["Email", student.email],
    ["Father's Name", student.fatherName || "N/A"],
    ["Mother's Name", student.motherName || "N/A"],
    ["Guardian", student.guardianName || "N/A"],
    ["Guardian Contact", student.guardianContact || "N/A"],
    ["Permanent Address", student.permanentAddress || "N/A"],
    ["Temporary Address", student.temporaryAddress || "N/A"],
    ["Previous School", student.previousSchool || "N/A"],
    ["Admission Date", student.admissionDate],
    ["Admission Fee", student.fee],
    ["Status", student.status],
  ];

  return (
    <div>
      <Header title={student.name} subtitle={`${classGroup?.name ?? ""} · Roll ${student.rollNumber}`} />

      <Breadcrumb items={[
        { label: "Students", page: "students" },
        { label: student.name },
      ]} />

      <div className="flex items-center gap-2 mb-4">
        <Button variant="outline" size="sm" onClick={() => navigate("students")}>
          <ArrowLeft size={14} className="mr-1" /> Back to Students
        </Button>
        <Badge variant={student.status === "Active" ? "default" : "secondary"}>{student.status}</Badge>
        <Badge variant={student.fee === "Paid" ? "default" : student.fee === "Partial" ? "secondary" : "destructive"}>
          Fee: {student.fee}
        </Badge>
      </div>

      <div className="flex gap-1 mb-6 border-b">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                tab === t.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={14} />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "profile" && (
        <div className="rounded-lg border bg-card">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 p-4">
            {fields.map(([label, value]) => (
              <div key={label}>
                <span className="text-xs text-muted-foreground block">{label}</span>
                <span className="text-sm font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "fees" && (
        <div className="rounded-lg border bg-card">
          {fees.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">No fee records.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Amount</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fees.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>Rs. {r.amount.toLocaleString()}</TableCell>
                    <TableCell>Rs. {r.paid.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={r.status === "Paid" ? "default" : r.status === "Partial" ? "secondary" : "destructive"}>
                        {r.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{r.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      )}

      {tab === "attendance" && (
        <div className="rounded-lg border bg-card">
          {attendanceRecords.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">No attendance records.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceRecords.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.date}</TableCell>
                    <TableCell>
                      <Badge variant={r.status === "Present" ? "default" : r.status === "Late" ? "secondary" : "destructive"}>
                        {r.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      )}

      {tab === "results" && (
        <div className="rounded-lg border bg-card">
          {examMarks.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">No exam results.</p>
          ) : (
            examMarks.map((em) => {
              const exam = EXAMS.find((e) => e.id === em.examId);
              let total = 0;
              let full = 0;
              return (
                <div key={em.id} className="p-4 border-b last:border-b-0">
                  <h3 className="text-sm font-semibold mb-2">{exam?.name ?? em.examId}</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subject</TableHead>
                        <TableHead>Marks</TableHead>
                        <TableHead>Pass Marks</TableHead>
                        <TableHead>Result</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {exam?.subjects.map((sub) => {
                        const obtained = em.subjectMarks[sub.name];
                        const hasMarks = obtained !== undefined;
                        if (hasMarks) { total += obtained; full += sub.fullMarks; }
                        return (
                          <TableRow key={sub.name}>
                            <TableCell>{sub.name}</TableCell>
                            <TableCell className={hasMarks && obtained >= sub.passMarks ? "text-emerald-600 font-medium" : hasMarks ? "text-red-600 font-medium" : ""}>
                              {hasMarks ? obtained : "\u2014"}
                            </TableCell>
                            <TableCell>{sub.passMarks}</TableCell>
                            <TableCell>
                              {hasMarks ? (
                                obtained >= sub.passMarks
                                  ? <Badge className="bg-emerald-600">Pass</Badge>
                                  : <Badge variant="destructive">Fail</Badge>
                              ) : "\u2014"}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      <TableRow>
                        <TableCell className="font-semibold">Total</TableCell>
                        <TableCell className="font-semibold">{total}/{full}</TableCell>
                        <TableCell />
                        <TableCell>
                          {full > 0 && (
                            <Badge variant={total >= full * 0.4 ? "default" : "destructive"}>
                              {Math.round((total / full) * 100)}%
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              );
            })
          )}
        </div>
      )}

      {tab === "assignments" && (
        <div className="rounded-lg border bg-card">
          {submissions.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">No assignments submitted.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assignment</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((sub) => {
                  const assignment = ASSIGNMENTS.find((a) => a.id === sub.assignmentId);
                  return (
                    <TableRow key={sub.id}>
                      <TableCell className="font-medium">{assignment?.title ?? sub.assignmentId}</TableCell>
                      <TableCell>{assignment?.subject ?? "-"}</TableCell>
                      <TableCell className="text-muted-foreground">{sub.submittedAt}</TableCell>
                      <TableCell>{sub.reviewed ? sub.score : "-"}</TableCell>
                      <TableCell>
                        <Badge variant={sub.reviewed ? "default" : "secondary"}>
                          {sub.reviewed ? "Reviewed" : "Pending"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      )}
    </div>
  );
}
