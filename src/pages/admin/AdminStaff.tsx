import { useState } from "react";
import { Search, Plus, Edit2, Trash2, X } from "lucide-react";
import type { StaffRole } from "../../types";
import { STAFF as DATA_STAFF } from "../../data";
import Header from "../../layouts/Header";

interface StaffEntry {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  joined: string;
  status: string;
}

const ROLES: StaffRole[] = ["accountant", "librarian", "front_desk", "admin_assistant", "security", "cleaner", "other"];

const statusColor = (s: string) =>
  s === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500";

const formatRole = (role: string) =>
  role.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

export default function AdminStaff() {
  const [staff, setStaff] = useState<StaffEntry[]>([...DATA_STAFF]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "accountant" as StaffRole | "",
    department: "",
    joined: "",
    status: "Active" as string,
  });

  const filtered = staff.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.id.toLowerCase().includes(search.toLowerCase()) ||
    s.role.toLowerCase().includes(search.toLowerCase()) ||
    s.department.toLowerCase().includes(search.toLowerCase()),
  );

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function resetForm() {
    setForm({ name: "", email: "", phone: "", role: "accountant", department: "", joined: "", status: "Active" });
  }

  function handleSubmit() {
    if (!form.name || !form.role) return;

    if (editingId) {
      setStaff((prev) =>
        prev.map((s) => (s.id === editingId ? { ...s, ...form } : s)),
      );
    } else {
      const newId = `S${String(staff.length + 1).padStart(3, "0")}`;
      setStaff((prev) => [{ id: newId, userId: "", ...form }, ...prev]);
    }

    setEditingId(null);
    setShowForm(false);
    resetForm();
  }

  function handleEdit(member: StaffEntry) {
    setForm({
      name: member.name,
      email: member.email,
      phone: member.phone,
      role: member.role as StaffRole,
      department: member.department,
      joined: member.joined,
      status: member.status,
    });
    setEditingId(member.id);
    setShowForm(true);
  }

  function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this staff member?")) {
      setStaff((prev) => prev.filter((s) => s.id !== id));
    }
  }

  return (
    <div>
      <Header title="Staff & Users" />

      <div className="bg-white rounded-xl border border-slate-100">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search staff…" className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />
          </div>
          <button onClick={() => { setShowForm(true); setEditingId(null); resetForm(); }} className="flex items-center gap-2 px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <Plus size={14} /> Add Staff
          </button>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              {["ID", "Name", "Role", "Department", "Joined", "Status", "Actions"].map((h) => (
                <th key={h} className="text-left text-xs font-medium text-slate-400 px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-xs font-mono text-slate-400">{s.id}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-sky-100 flex items-center justify-center text-xs font-semibold text-sky-700">
                      {s.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </div>
                    <span className="text-sm font-medium text-slate-700">{s.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-sky-50 text-sky-700">
                    {formatRole(s.role)}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">{s.department}</td>
                <td className="px-4 py-3 text-sm text-slate-500">{s.joined}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(s.status)}`}>{s.status}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(s)} className="text-slate-400 hover:text-indigo-600"><Edit2 size={14} /></button>
                    <button onClick={() => handleDelete(s.id)} className="text-slate-400 hover:text-red-600"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="px-4 py-3 border-t border-slate-100 text-xs text-slate-400">
          {filtered.length} member{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="font-semibold text-slate-800">{editingId ? "Edit Staff" : "Add New Staff"}</h2>
              <button onClick={() => { setShowForm(false); setEditingId(null); resetForm(); }} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <X size={16} className="text-slate-500" />
              </button>
            </div>
            <div className="p-5 grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-slate-500 mb-1">Full Name *</label>
                <input value={form.name} onChange={(e) => handleChange("name", e.target.value)} type="text" placeholder="Enter full name" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Email</label>
                <input value={form.email} onChange={(e) => handleChange("email", e.target.value)} type="email" placeholder="staff@school.com" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Phone</label>
                <input value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} type="text" placeholder="98XXXXXXXX" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-slate-500 mb-1">Role *</label>
                <select value={form.role} onChange={(e) => handleChange("role", e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 bg-white">
                  {ROLES.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-slate-500 mb-1">Department</label>
                <input value={form.department} onChange={(e) => handleChange("department", e.target.value)} type="text" placeholder="e.g. Finance, Library, Admin" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Join Date</label>
                <input value={form.joined} onChange={(e) => handleChange("joined", e.target.value)} type="date" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
                <select value={form.status} onChange={(e) => handleChange("status", e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 bg-white">
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-5 pb-5">
              <button onClick={() => { setShowForm(false); setEditingId(null); resetForm(); }} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
              <button onClick={handleSubmit} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">{editingId ? "Update Staff" : "Add Staff"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
