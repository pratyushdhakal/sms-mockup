import { useState } from "react";
import { Calendar, Plus, X } from "lucide-react";
import { LEAVE_REQUESTS } from "../../data";
import type { LeaveType, LeaveStatus } from "../../types";

const STAFF_USER_ID = "U005";

const statusBadge = (s: LeaveStatus) => {
  const m: Record<LeaveStatus, string> = {
    pending: "bg-amber-50 text-amber-700",
    approved: "bg-emerald-50 text-emerald-700",
    rejected: "bg-red-50 text-red-700",
  };
  return m[s];
};

const typeLabel: Record<LeaveType, string> = {
  sick: "Sick",
  casual: "Casual",
  annual: "Annual",
};

export default function StaffLeave() {
  const [leaves, setLeaves] = useState(
    LEAVE_REQUESTS.filter((l) => l.userId === STAFF_USER_ID)
  );
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ startDate: "", endDate: "", type: "sick" as LeaveType, reason: "" });

  function handleSubmit() {
    if (!form.startDate || !form.endDate || !form.reason) return;
    const newLeave = {
      id: `L${Date.now()}`,
      userId: STAFF_USER_ID,
      startDate: form.startDate,
      endDate: form.endDate,
      type: form.type,
      reason: form.reason,
      status: "pending" as LeaveStatus,
      schoolId: "SCH001",
    };
    setLeaves((prev) => [newLeave, ...prev]);
    setForm({ startDate: "", endDate: "", type: "sick", reason: "" });
    setShowForm(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">Leave Requests</h1>
          <p className="text-sm text-slate-400 mt-0.5">Manage your leave requests</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus size={14} /> New Leave Request
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
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
              <tr key={l.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-sm text-slate-600 capitalize">{typeLabel[l.type]}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar size={13} className="text-slate-400" />
                    {l.startDate} — {l.endDate}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600 max-w-xs truncate">{l.reason}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusBadge(l.status)}`}>
                    {l.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {leaves.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-6">No leave requests found.</p>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="font-semibold text-slate-800">New Leave Request</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <X size={16} className="text-slate-500" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">End Date</label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as LeaveType }))}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none"
                >
                  <option value="sick">Sick</option>
                  <option value="casual">Casual</option>
                  <option value="annual">Annual</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Reason</label>
                <textarea
                  rows={4}
                  value={form.reason}
                  onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
                  placeholder="Enter reason for leave…"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 px-5 pb-5">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
