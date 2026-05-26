import { useState } from "react";
import { CreditCard } from "lucide-react";
import { STUDENTS, CLASS_GROUPS } from "../../data";
import Header from "../../layouts/Header";

function getClassName(id: string) {
  return CLASS_GROUPS.find((c) => c.id === id)?.name || id;
}

export default function AdminIDCards() {
  const [selected, setSelected] = useState<string[]>([]);

  function toggleStudent(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  function toggleAll() {
    if (selected.length === STUDENTS.length) {
      setSelected([]);
    } else {
      setSelected(STUDENTS.map((s) => s.id));
    }
  }

  function handleGenerate() {
    alert("ID Card generation initiated");
  }

  return (
    <div>
      <Header title="ID Cards" subtitle="Generate student ID cards" />

      <div className="bg-white rounded-xl border border-slate-100">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold text-slate-700">Students</h2>
            {selected.length > 0 && (
              <span className="text-xs text-indigo-600 font-medium">{selected.length} selected</span>
            )}
          </div>
          <button
            onClick={handleGenerate}
            disabled={selected.length === 0}
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg ${
              selected.length > 0
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            <CreditCard size={14} /> Generate ID Cards
          </button>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  checked={selected.length === STUDENTS.length && STUDENTS.length > 0}
                  onChange={toggleAll}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
              </th>
              {["Name", "Class", "Roll Number"].map((h) => (
                <th key={h} className="text-left text-xs font-medium text-slate-400 px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {STUDENTS.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(s.id)}
                    onChange={() => toggleStudent(s.id)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-semibold text-indigo-700">
                      {s.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </div>
                    <span className="text-sm font-medium text-slate-700">{s.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">{getClassName(s.classId)}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{s.rollNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
