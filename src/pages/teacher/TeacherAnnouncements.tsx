import { Megaphone } from "lucide-react";
import { useStore } from "../../StoreContext";
import Header from "../../layouts/Header";

const audienceColor = (a: string) =>
  ({ all: "bg-indigo-50 text-indigo-700", students: "bg-emerald-50 text-emerald-700", teachers: "bg-purple-50 text-purple-700", staff: "bg-cyan-50 text-cyan-700", parents: "bg-rose-50 text-rose-700" })[a] || "bg-gray-100 text-gray-600";

const priorityColor = (p: string) =>
  ({ high: "bg-red-50 text-red-700", medium: "bg-amber-50 text-amber-700", low: "bg-blue-50 text-blue-700" })[p] || "bg-gray-100 text-gray-600";

export default function TeacherAnnouncements() {
  const { announcements } = useStore();
  const filtered = announcements.filter((a) =>
    a.audience === "all" || a.audience === "teachers" || a.audience === "staff"
  );

  return (
    <div>
      <Header title="Announcements" subtitle="School notices" />

      <div className="bg-white rounded-xl border border-slate-100">
        <div className="p-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700">All Announcements</h2>
        </div>

        <div className="p-4 space-y-3">
          {filtered.map((a) => (
            <div key={a.id} className="border border-slate-100 rounded-xl p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <Megaphone size={15} className="text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">{a.title}</h3>
                    <p className="text-xs text-slate-400">{a.publishDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${audienceColor(a.audience)}`}>{a.audience}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColor(a.priority)}`}>{a.priority}</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed ml-10">{a.content}</p>
            </div>
          ))}
          {announcements.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-8">No announcements found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
