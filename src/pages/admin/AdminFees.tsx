import { useState } from "react";
import { Plus, X, DollarSign } from "lucide-react";
import { FEE_RECORDS as DATA_FEE_RECORDS, STUDENTS, CLASS_GROUPS } from "../../data";
import type { FeeRecord, FeeStatus } from "../../types";
import { useNavigate } from "../../NavContext";
import Header from "../../layouts/Header";

function getStudentName(id: string) {
  return STUDENTS.find((s) => s.id === id)?.name || id;
}

function getStudentClass(id: string) {
  const s = STUDENTS.find((st) => st.id === id);
  if (!s) return "";
  return CLASS_GROUPS.find((c) => c.id === s.classId)?.name || s.classId;
}

const statusColor = (s: string) =>
  ({ Paid: "bg-emerald-50 text-emerald-700", Due: "bg-red-50 text-red-700", Partial: "bg-amber-50 text-amber-700" })[s] || "bg-gray-100 text-gray-600";

export default function AdminFees() {
  const { navigate, setViewEntity } = useNavigate();
  const [records, setRecords] = useState<FeeRecord[]>(DATA_FEE_RECORDS);
  const [showForm, setShowForm] = useState(false);
  const [formStudent, setFormStudent] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [formPaid, setFormPaid] = useState("");
  const [formDate, setFormDate] = useState("");

  const totalCollected = records.reduce((sum, r) => sum + r.paid, 0);
  const pendingDues = records.filter((r) => r.status === "Due").reduce((sum, r) => sum + r.amount, 0);
  const partialPayments = records.filter((r) => r.status === "Partial").length;

  function resetForm() {
    setFormStudent("");
    setFormAmount("");
    setFormPaid("");
    setFormDate("");
  }

  function handleCollect() {
    if (!formStudent || !formAmount || !formPaid || !formDate) return;
    const amount = Number(formAmount);
    const paid = Number(formPaid);
    let status: FeeStatus = "Due";
    if (paid >= amount) status = "Paid";
    else if (paid > 0) status = "Partial";

    const newRecord: FeeRecord = {
      id: `FR${String(records.length + 1).padStart(3, "0")}`,
      studentId: formStudent,
      amount,
      paid,
      status,
      date: formDate,
      schoolId: "SCH001",
    };
    setRecords((prev) => [newRecord, ...prev]);
    resetForm();
    setShowForm(false);
  }

  return (
    <div>
      <Header title="Fees" subtitle="Manage fee records and payments" />

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <DollarSign size={18} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Collected</p>
              <p className="text-lg font-semibold text-slate-800">Rs. {totalCollected.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
              <DollarSign size={18} className="text-red-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Pending Dues</p>
              <p className="text-lg font-semibold text-slate-800">Rs. {pendingDues.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <DollarSign size={18} className="text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Partial Payments</p>
              <p className="text-lg font-semibold text-slate-800">{partialPayments}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700">Fee Records</h2>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <Plus size={14} /> Collect Fee
          </button>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              {["Student Name", "Class", "Amount", "Paid", "Status", "Date"].map((h) => (
                <th key={h} className="text-left text-xs font-medium text-slate-400 px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {records.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-semibold text-indigo-700">
                      {getStudentName(r.studentId).split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </div>
                    <button onClick={() => { setViewEntity({ type: "student", id: r.studentId }); navigate("student-detail"); }} className="text-sm font-medium text-slate-700 hover:text-primary transition-colors">
                      {getStudentName(r.studentId)}
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => navigate("class-groups")} className="text-sm text-slate-600 hover:text-primary transition-colors">
                    {getStudentClass(r.studentId)}
                  </button>
                </td>
                <td className="px-4 py-3 text-sm text-slate-700">Rs. {r.amount.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm text-slate-700">Rs. {r.paid.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${(statusColor(r.status))}`}>{r.status}</span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-800">Collect Fee</h2>
              <button onClick={() => { resetForm(); setShowForm(false); }} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <X size={16} className="text-slate-500" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Student</label>
                <select value={formStudent} onChange={(e) => setFormStudent(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 bg-white">
                  <option value="">Select student</option>
                  {STUDENTS.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} — {getStudentClass(s.id)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Total Amount (Rs.)</label>
                <input type="number" value={formAmount} onChange={(e) => setFormAmount(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Paid Amount (Rs.)</label>
                <input type="number" value={formPaid} onChange={(e) => setFormPaid(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Date</label>
                <input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => { resetForm(); setShowForm(false); }} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
              <button onClick={handleCollect} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Record Payment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
