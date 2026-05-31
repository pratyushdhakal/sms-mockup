import { Wallet, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "../../AuthContext";
import { useStore } from "../../StoreContext";
import Header from "../../layouts/Header";

const feeStatusBadge = (s: string) => {
  const m: Record<string, string> = {
    Paid: "bg-emerald-50 text-emerald-700",
    Due: "bg-red-50 text-red-700",
    Partial: "bg-amber-50 text-amber-700",
  };
  return m[s] ?? "bg-slate-100 text-slate-600";
};

export default function StudentFees() {
  const { currentStudent } = useAuth();
  const { feeRecords } = useStore();
  const student = currentStudent;

  const records = feeRecords.filter((f) => f.studentId === student?.id);
  const totalFees = records.reduce((sum, f) => sum + f.amount, 0);
  const totalPaid = records.reduce((sum, f) => sum + f.paid, 0);
  const balance = totalFees - totalPaid;

  return (
    <div>
      <Header title="Fee Details" subtitle="Fee records and payment status" userName={student?.name} userRole="Student" />

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
            {records.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-sm text-slate-400 py-6">No fee records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
