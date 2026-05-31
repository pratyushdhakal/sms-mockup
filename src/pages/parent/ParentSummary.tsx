import { useState } from "react";
import { User, BookOpen, Phone, Mail, Hash, Layers, CheckCircle, XCircle, Clock, CalendarClock, Wallet } from "lucide-react";
import { CLASS_GROUPS } from "../../data";
import { useAuth } from "../../AuthContext";
import { useStore } from "../../StoreContext";
import Header from "../../layouts/Header";

export default function ParentSummary() {
  const { parentChildren } = useAuth();
  const { attendanceRecords, feeRecords } = useStore();
  const children = parentChildren;

  const [selectedStudent, setSelectedStudent] = useState<string>(children[0]?.id ?? "");

  const currentStudent = children.find((s) => s.id === selectedStudent) ?? children[0];
  const classGroup = CLASS_GROUPS.find((c) => c.id === currentStudent?.classId);

  const records = attendanceRecords.filter((a) => a.userId === currentStudent?.userId);

  const present = records.filter((a) => a.status === "Present").length;
  const absent = records.filter((a) => a.status === "Absent").length;
  const late = records.filter((a) => a.status === "Late").length;
  const leave = records.filter((a) => a.status === "Leave").length;

  const fees = feeRecords.filter((f) => f.studentId === currentStudent?.id);
  const totalFees = fees.reduce((sum, f) => sum + f.amount, 0);
  const totalPaid = fees.reduce((sum, f) => sum + f.paid, 0);
  const balance = totalFees - totalPaid;

  return (
    <div>
      <Header title="Student Summary" subtitle="Detailed student information" userName="Parent" userRole="Parent" />

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

      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden mb-6">
        <div className="flex items-center gap-3 p-4 border-b border-slate-100 bg-slate-50/50">
          <User size={16} className="text-slate-500" />
          <span className="text-sm font-semibold text-slate-700">Student Details</span>
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-3 p-4">
          {[
            { label: "Name", value: currentStudent?.name, icon: User },
            { label: "Class", value: classGroup ? `${classGroup.name} — ${classGroup.section}` : "—", icon: BookOpen },
            { label: "Section", value: currentStudent?.section, icon: Layers },
            { label: "Roll Number", value: currentStudent?.rollNumber, icon: Hash },
            { label: "Batch", value: currentStudent?.batch, icon: Layers },
            { label: "Phone", value: currentStudent?.phone, icon: Phone },
            { label: "Email", value: currentStudent?.email, icon: Mail },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon size={13} className="text-slate-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-slate-400">{label}</p>
                <p className="text-sm text-slate-700">{value ?? "—"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden mb-6">
        <div className="flex items-center gap-3 p-4 border-b border-slate-100 bg-slate-50/50">
          <CalendarClock size={16} className="text-slate-500" />
          <span className="text-sm font-semibold text-slate-700">Attendance Summary</span>
        </div>
        <div className="grid grid-cols-4 gap-4 p-4">
          {[
            { label: "Present", value: present, icon: CheckCircle, color: "text-emerald-600 bg-emerald-50" },
            { label: "Absent", value: absent, icon: XCircle, color: "text-red-600 bg-red-50" },
            { label: "Late", value: late, icon: Clock, color: "text-amber-600 bg-amber-50" },
            { label: "Leave", value: leave, icon: CalendarClock, color: "text-blue-600 bg-blue-50" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center`}>
                <Icon size={15} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{value}</p>
                <p className="text-xs text-slate-400">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b border-slate-100 bg-slate-50/50">
          <Wallet size={16} className="text-slate-500" />
          <span className="text-sm font-semibold text-slate-700">Fee Status</span>
        </div>
        <div className="grid grid-cols-3 gap-4 p-4">
          <div>
            <p className="text-xs text-slate-400">Total Fees</p>
            <p className="text-lg font-semibold text-slate-800">Rs. {totalFees.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Total Paid</p>
            <p className="text-lg font-semibold text-emerald-600">Rs. {totalPaid.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Balance</p>
            <p className={`text-lg font-semibold ${balance > 0 ? "text-red-600" : "text-slate-800"}`}>
              Rs. {balance.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
