import { useState } from "react";
import { CheckCircle, CalendarClock, ArrowRight, BookOpen, FileText, GraduationCap, Wallet, Users } from "lucide-react";
import { CLASS_GROUPS } from "../../data";
import { useAuth } from "../../AuthContext";
import { useStore } from "../../StoreContext";
import Header from "../../layouts/Header";

export default function ParentDashboard() {
  const { parentChildren } = useAuth();
  const { attendanceRecords, feeRecords, exams } = useStore();
  const children = parentChildren;
  const [selectedStudent, setSelectedStudent] = useState<string>(children[0]?.id ?? "");

  const currentStudent = children.find((s) => s.id === selectedStudent) ?? children[0];

  const myAttendance = attendanceRecords.filter((a) => a.userId === currentStudent?.userId);
  const presentCount = myAttendance.filter((a) => a.status === "Present").length;
  const attendancePct = myAttendance.length > 0 ? Math.round((presentCount / myAttendance.length) * 100) : 0;

  const fees = feeRecords.filter((f) => f.studentId === currentStudent?.id);
  const totalFees = fees.reduce((sum, f) => sum + f.amount, 0);
  const totalPaid = fees.reduce((sum, f) => sum + f.paid, 0);
  const pendingFees = totalFees - totalPaid;

  const upcomingExams = exams.filter((e) => e.applicableClassIds.includes(currentStudent?.classId ?? "")).length;

  const quickLinks = [
    { label: "Attendance", icon: CalendarClock },
    { label: "Results", icon: GraduationCap },
    { label: "Assignments", icon: FileText },
    { label: "Fees", icon: Wallet },
  ];

  return (
    <div>
      <Header title="Parent Dashboard" subtitle="Monitor your children's progress" userName="Parent" userRole="Parent" />

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Users size={15} className="text-slate-400" />
          <span className="text-xs font-medium text-slate-500">Select Child</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {children.map((child) => {
            const cg = CLASS_GROUPS.find((c) => c.id === child.classId);
            return (
              <button
                key={child.id}
                onClick={() => setSelectedStudent(child.id)}
                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                  selectedStudent === child.id
                    ? "bg-indigo-600 text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <BookOpen size={14} />
                {child.name} — {cg?.name ?? child.classId}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center mb-3">
            <CheckCircle size={17} className="text-emerald-600" />
          </div>
          <p className="text-2xl font-semibold text-slate-800">{attendancePct}%</p>
          <p className="text-xs text-slate-400 mt-0.5">Attendance</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center mb-3">
            <Wallet size={17} className="text-amber-600" />
          </div>
          <p className="text-2xl font-semibold text-slate-800">Rs. {pendingFees.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-0.5">Pending Fees</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center mb-3">
            <CalendarClock size={17} className="text-indigo-600" />
          </div>
          <p className="text-2xl font-semibold text-slate-800">{upcomingExams}</p>
          <p className="text-xs text-slate-400 mt-0.5">Upcoming Exams</p>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-slate-700 mb-3">Quick Links</h2>
        <div className="grid grid-cols-2 gap-3">
          {quickLinks.map(({ label, icon: Icon }) => (
            <a
              key={label}
              href="#"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-slate-100 bg-white hover:bg-slate-50 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                <Icon size={15} className="text-indigo-600" />
              </div>
              <span className="text-sm text-slate-600 group-hover:text-slate-800">{label}</span>
              <ArrowRight size={14} className="ml-auto text-slate-300 group-hover:text-slate-500" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
