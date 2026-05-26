import { Users, GraduationCap, UserCog, DollarSign } from "lucide-react";
import { STUDENTS, TEACHERS, STAFF, FEE_RECORDS } from "../../data";
import Header from "../../layouts/Header";

export default function AdminReports() {
  const totalFeeCollected = FEE_RECORDS.reduce((sum, r) => sum + r.paid, 0);

  const cards = [
    { icon: Users, label: "Total Students", value: STUDENTS.length, color: "bg-blue-50 text-blue-600" },
    { icon: GraduationCap, label: "Total Teachers", value: TEACHERS.length, color: "bg-emerald-50 text-emerald-600" },
    { icon: UserCog, label: "Total Staff", value: STAFF.length, color: "bg-purple-50 text-purple-600" },
    { icon: DollarSign, label: "Total Fee Collected", value: `Rs. ${totalFeeCollected.toLocaleString()}`, color: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div>
      <Header title="Reports" subtitle="School statistics and reports" />

      <div className="grid grid-cols-4 gap-4 mb-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${c.color}`}>
                <c.icon size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-500">{c.label}</p>
                <p className="text-lg font-semibold text-slate-800">{c.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-100 p-8 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
          <DollarSign size={28} className="text-slate-300" />
        </div>
        <h3 className="text-sm font-semibold text-slate-700 mb-1">Reports Module</h3>
        <p className="text-xs text-slate-400">Reports module coming soon</p>
      </div>
    </div>
  );
}
