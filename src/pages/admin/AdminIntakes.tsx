import { useState } from "react";
import { Plus, X } from "lucide-react";
import { INTAKES as DATA_INTAKES } from "../../data";
import type { Intake } from "../../types";
import Header from "../../layouts/Header";

const INIT_FORM = { name: "", academicYear: "", grade: "", capacity: 0, status: "open" as "open" | "closed" };

export default function AdminIntakes() {
  const [intakes, setIntakes] = useState<Intake[]>(DATA_INTAKES);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<{ name: string; academicYear: string; grade: string; capacity: number; status: "open" | "closed" }>(INIT_FORM);

  function handleSubmit() {
    if (!form.name || !form.academicYear || !form.grade || form.capacity < 1) return;
    const newIntake: Intake = {
      id: `I${String(intakes.length + 1).padStart(3, "0")}`,
      name: form.name,
      academicYear: form.academicYear,
      grade: form.grade,
      capacity: form.capacity,
      enrolled: 0,
      status: form.status,
      schoolId: "SCH001",
    };
    setIntakes((prev) => [newIntake, ...prev]);
    setForm(INIT_FORM);
    setShowForm(false);
  }

  return (
    <div>
      <Header title="Intakes" subtitle="Manage admission intakes" />

      <div className="bg-white rounded-xl border border-slate-100">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700">All Intakes</h2>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <Plus size={14} /> Add Intake
          </button>
        </div>

        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {intakes.map((intake) => {
            const pct = intake.capacity > 0 ? Math.round((intake.enrolled / intake.capacity) * 100) : 0;
            return (
              <div key={intake.id} className="border border-slate-100 rounded-xl p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-800">{intake.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${intake.status === "open" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                    {intake.status === "open" ? "Open" : "Closed"}
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-500 mb-3">
                  <p>Academic Year: <span className="text-slate-700 font-medium">{intake.academicYear}</span></p>
                  <p>Grade: <span className="text-slate-700 font-medium">{intake.grade}</span></p>
                  <p>Capacity: <span className="text-slate-700 font-medium">{intake.capacity}</span></p>
                  <p>Enrolled: <span className="text-slate-700 font-medium">{intake.enrolled}</span></p>
                </div>
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">Occupancy</span>
                    <span className="text-slate-600 font-medium">{pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-800">Add New Intake</h2>
              <button onClick={() => { setShowForm(false); setForm(INIT_FORM); }} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <X size={16} className="text-slate-500" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Intake Name</label>
                <input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="e.g. Grade 1 Intake 2083" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Academic Year</label>
                <input value={form.academicYear} onChange={(e) => setForm((prev) => ({ ...prev, academicYear: e.target.value }))} placeholder="e.g. 2083" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Grade</label>
                <input value={form.grade} onChange={(e) => setForm((prev) => ({ ...prev, grade: e.target.value }))} placeholder="e.g. Class 1" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Capacity</label>
                <input value={form.capacity || ""} onChange={(e) => setForm((prev) => ({ ...prev, capacity: Number(e.target.value) }))} type="number" min={1} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
                <select value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as "open" | "closed" }))} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 bg-white">
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => { setShowForm(false); setForm(INIT_FORM); }} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
              <button onClick={handleSubmit} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Add Intake</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
