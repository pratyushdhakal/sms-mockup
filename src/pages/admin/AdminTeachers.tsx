import { useState } from "react";
import { Search, Plus, Edit2, Trash2, X } from "lucide-react";
import { TEACHERS as DATA_TEACHERS, CLASS_GROUPS } from "../../data";
import Header from "../../layouts/Header";

interface TeacherEntry {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  subjectSpecialization: string;
  assignedClassIds: string[];
  joined: string;
  status: string;
}

const statusColor = (s: string) =>
  s === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500";

const getClassName = (id: string) => CLASS_GROUPS.find((c) => c.id === id)?.name || id;

export default function AdminTeachers() {
  const [teachers, setTeachers] = useState<TeacherEntry[]>([...DATA_TEACHERS]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subjectSpecialization: "",
    assignedClassIds: [] as string[],
    joined: "",
    status: "Active" as string,
  });

  const filtered = teachers.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.id.toLowerCase().includes(search.toLowerCase()) ||
    t.subjectSpecialization.toLowerCase().includes(search.toLowerCase()),
  );

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleClass(classId: string) {
    setForm((prev) => ({
      ...prev,
      assignedClassIds: prev.assignedClassIds.includes(classId)
        ? prev.assignedClassIds.filter((id) => id !== classId)
        : [...prev.assignedClassIds, classId],
    }));
  }

  function resetForm() {
    setForm({ name: "", email: "", phone: "", subjectSpecialization: "", assignedClassIds: [], joined: "", status: "Active" });
  }

  function handleSubmit() {
    if (!form.name || !form.subjectSpecialization) return;

    if (editingId) {
      setTeachers((prev) =>
        prev.map((t) => (t.id === editingId ? { ...t, ...form } : t)),
      );
    } else {
      const newId = `T${String(teachers.length + 1).padStart(3, "0")}`;
      setTeachers((prev) => [{ id: newId, userId: "", ...form }, ...prev]);
    }

    setEditingId(null);
    setShowForm(false);
    resetForm();
  }

  function handleEdit(teacher: TeacherEntry) {
    setForm({
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone,
      subjectSpecialization: teacher.subjectSpecialization,
      assignedClassIds: [...teacher.assignedClassIds],
      joined: teacher.joined,
      status: teacher.status,
    });
    setEditingId(teacher.id);
    setShowForm(true);
  }

  function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this teacher?")) {
      setTeachers((prev) => prev.filter((t) => t.id !== id));
    }
  }

  return (
    <div>
      <Header title="Teachers" />

      <div className="bg-white rounded-xl border border-slate-100">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search teachers…" className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />
          </div>
          <button onClick={() => { setShowForm(true); setEditingId(null); resetForm(); }} className="flex items-center gap-2 px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <Plus size={14} /> Add Teacher
          </button>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              {["ID", "Name", "Subject", "Classes Assigned", "Joined", "Status", "Actions"].map((h) => (
                <th key={h} className="text-left text-xs font-medium text-slate-400 px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-xs font-mono text-slate-400">{t.id}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center text-xs font-semibold text-violet-700">
                      {t.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </div>
                    <span className="text-sm font-medium text-slate-700">{t.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">{t.subjectSpecialization}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{t.assignedClassIds.map((id) => getClassName(id)).join(", ")}</td>
                <td className="px-4 py-3 text-sm text-slate-500">{t.joined}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(t.status)}`}>{t.status}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(t)} className="text-slate-400 hover:text-indigo-600"><Edit2 size={14} /></button>
                    <button onClick={() => handleDelete(t.id)} className="text-slate-400 hover:text-red-600"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="px-4 py-3 border-t border-slate-100 text-xs text-slate-400">
          {filtered.length} teacher{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="font-semibold text-slate-800">{editingId ? "Edit Teacher" : "Add New Teacher"}</h2>
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
                <input value={form.email} onChange={(e) => handleChange("email", e.target.value)} type="email" placeholder="teacher@school.com" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Phone</label>
                <input value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} type="text" placeholder="98XXXXXXXX" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-slate-500 mb-1">Subject Specialization *</label>
                <input value={form.subjectSpecialization} onChange={(e) => handleChange("subjectSpecialization", e.target.value)} type="text" placeholder="e.g. Mathematics, Science" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-slate-500 mb-1">Assigned Classes</label>
                <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 border border-slate-200 rounded-lg">
                  {CLASS_GROUPS.map((cg) => (
                    <label key={cg.id} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-slate-800">
                      <input type="checkbox" checked={form.assignedClassIds.includes(cg.id)} onChange={() => toggleClass(cg.id)} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                      {cg.name} ({cg.section})
                    </label>
                  ))}
                </div>
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
              <button onClick={handleSubmit} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">{editingId ? "Update Teacher" : "Add Teacher"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
