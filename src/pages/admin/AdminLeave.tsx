import { useState } from "react";
import { Check, X } from "lucide-react";
import { LEAVE_REQUESTS as DATA_LEAVE, MOCK_USERS } from "../../data";
import type { LeaveRequest, LeaveStatus } from "../../types";
import Header from "../../layouts/Header";

const FILTERS = ["All", "Pending", "Approved", "Rejected"] as const;
type Filter = (typeof FILTERS)[number];

const statusBadge: Record<LeaveStatus, string> = {
  approved: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red-50 text-red-700",
  pending: "bg-amber-50 text-amber-700",
};

const statusLabel: Record<LeaveStatus, string> = {
  approved: "Approved",
  rejected: "Rejected",
  pending: "Pending",
};

const typeLabel: Record<string, string> = {
  sick: "Sick",
  casual: "Casual",
  annual: "Annual",
};

function getUserName(id: string) {
  return MOCK_USERS.find((u) => u.id === id)?.name || id;
}

export default function AdminLeave() {
  const [requests, setRequests] = useState<LeaveRequest[]>(DATA_LEAVE);
  const [filter, setFilter] = useState<Filter>("All");

  const filtered = requests.filter((r) => {
    if (filter === "All") return true;
    return r.status === filter.toLowerCase();
  });

  function updateStatus(id: string, status: LeaveStatus) {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  return (
    <div>
      <Header title="Leave Requests" subtitle="Manage staff & student leave" />

      <div className="bg-white rounded-xl border border-slate-100">
        <div className="flex border-b border-slate-100">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-3 text-sm font-medium transition-colors ${filter === f ? "text-indigo-600 border-b-2 border-indigo-600" : "text-slate-400 hover:text-slate-600"}`}>
              {f}
            </button>
          ))}
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-xs font-medium text-slate-400 px-4 py-3">Requester</th>
              <th className="text-left text-xs font-medium text-slate-400 px-4 py-3">Type</th>
              <th className="text-left text-xs font-medium text-slate-400 px-4 py-3">Date Range</th>
              <th className="text-left text-xs font-medium text-slate-400 px-4 py-3">Reason</th>
              <th className="text-left text-xs font-medium text-slate-400 px-4 py-3">Status</th>
              <th className="text-left text-xs font-medium text-slate-400 px-4 py-3">Admin Note</th>
              <th className="text-left text-xs font-medium text-slate-400 px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-semibold text-indigo-700">
                      {getUserName(r.userId).split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </div>
                    <span className="text-sm text-slate-700">{getUserName(r.userId)}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600 capitalize">{typeLabel[r.type] || r.type}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{r.startDate} — {r.endDate}</td>
                <td className="px-4 py-3 text-sm text-slate-600 max-w-[200px] truncate">{r.reason}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge[r.status]}`}>{statusLabel[r.status]}</span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-500">{r.adminNote || "—"}</td>
                <td className="px-4 py-3">
                  {r.status === "pending" ? (
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateStatus(r.id, "approved")} className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100" title="Approve">
                        <Check size={14} />
                      </button>
                      <button onClick={() => updateStatus(r.id, "rejected")} className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100" title="Reject">
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-8">No leave requests found.</p>
        )}
      </div>
    </div>
  );
}
