import { useState } from "react";
import { Plus, X } from "lucide-react";
import { LEAVE_REQUESTS as DATA_LEAVE } from "../../data";
import type { LeaveRequest, LeaveType, LeaveStatus } from "../../types";
import Header from "../../layouts/Header";

const statusBadge: Record<LeaveStatus, string> = {
  pending: "bg-amber-50 text-amber-700",
  approved: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red-50 text-red-700",
};

export default function TeacherLeave() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>(DATA_LEAVE.filter((l) => l.userId === "U002"));
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ startDate: "", endDate: "", type: "sick" as LeaveType, reason: "" });

  function handleSubmit() {
    if (!form.startDate || !form.endDate || !form.reason) return;
    const newLeave: LeaveRequest = {
      id: `L${String(leaves.length + 1).padStart(3, "0")}`,
      userId: "U002",
      startDate: form.startDate,
      endDate: form.endDate,
      type: form.type,
      reason: form.reason,
      status: "pending",
      schoolId: "SCH001",
    };
    setLeaves((prev) => [newLeave, ...prev]);
    setForm({ startDate: "", endDate: "", type: "sick", reason: "" });
    setShowForm(false);
  }

  return (
    <div>
      <Header title="Leave Management" subtitle="Apply for and track leave requests" />

      <div className="bg-white rounded-xl border border-slate-100">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700">My Requests</h2>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <Plus size={14} /> New Leave Request
          </button>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              {["Type", "Date Range", "Reason", "Status"].map((h) => (
                <th key={h} className="text-left text-xs font-medium text-slate-400 px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {leaves.map((l) => (
              <tr key={l.id} className="hover:bg-slate-50/50">
                <td className="px-4 py-3 text-sm capitalize text-slate-700">{l.type}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{l.startDate} → {l.endDate}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{l.reason}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge[l.status]}`}>{l.status}</span>
                </td>
              </tr>
            ))}
            {leaves.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-sm text-slate-400">No leave requests found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-800">New Leave Request</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <X size={16} className="text-slate-500" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Start Date</label>
                  <input type="date" value={form.startDate} onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">End Date</label>
                  <input type="date" value={form.endDate} onChange={(e) => setForm((prev) => ({ ...prev, endDate: e.target.value }))} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Type</label>
                <select value={form.type} onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value as LeaveType }))} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 bg-white">
                  <option value="sick">Sick</option>
                  <option value="casual">Casual</option>
                  <option value="annual">Annual</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Reason</label>
                <textarea value={form.reason} onChange={(e) => setForm((prev) => ({ ...prev, reason: e.target.value }))} rows={4} placeholder="Reason for leave" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 resize-none" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
              <button onClick={handleSubmit} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
