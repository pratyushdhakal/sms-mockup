import { useState } from "react";
import { Wallet, CheckCircle, XCircle } from "lucide-react";
import { STUDENTS, CLASS_GROUPS, FEE_RECORDS, PARENT_STUDENT } from "../../data";

const PARENT_ID = "U009";

export default function ParentFees() {
  const children = STUDENTS.filter((s) =>
    PARENT_STUDENT.filter((ps) => ps.parentId === PARENT_ID).some((ps) => ps.studentId === s.id)
  );

  const [selectedStudent, setSelectedStudent] = useState<string>(children[0]?.id ?? "");

  const currentStudent = children.find((s) => s.id === selectedStudent) ?? children[0];

  const records = FEE_RECORDS.filter((f) => f.studentId === currentStudent?.id);
  const totalFees = records.reduce((sum, f) => sum + f.amount, 0);
  const totalPaid = records.reduce((sum, f) => sum + f.paid, 0);
  const balance = totalFees - totalPaid;

  const feeStatusBadge = (s: string) => {
    const m: Record<string, string> = {
      Paid: "bg-emerald-50 text-emerald-700",
      Due: "bg-red-50 text-red-700",
      Partial: "bg-amber-50 text-amber-700",
    };
    return m[s] ?? "bg-slate-100 text-slate-600";
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-800">Fees</h1>
        <p className="text-sm text-slate-400 mt-0.5">Fee records and payment status</p>
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

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center mb-3">
            <Wallet size={17} className="text-indigo-600" />
          </div>
          <p className="text-2xl font-semibold text-slate-800">Rs. {totalFees.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-0.5">Total Fees</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center mb-3">
            <CheckCircle size={17} className="text-emerald-600" />
          </div>
          <p className="text-2xl font-semibold text-emerald-600">Rs. {totalPaid.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-0.5">Total Paid</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center mb-3">
            <XCircle size={17} className="text-red-600" />
          </div>
          <p className={`text-2xl font-semibold ${balance > 0 ? "text-red-600" : "text-slate-800"}`}>
            Rs. {balance.toLocaleString()}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">Balance</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              {["Amount (Rs.)", "Paid (Rs.)", "Status", "Date"].map((h) => (
                <th key={h} className="text-left text-xs font-medium text-slate-400 px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {records.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-sm text-slate-700 font-medium">{r.amount.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{r.paid.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${feeStatusBadge(r.status)}`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {records.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-6">No fee records found.</p>
        )}
      </div>
    </div>
  );
}
