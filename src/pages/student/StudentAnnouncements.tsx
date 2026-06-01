import { Bell } from "lucide-react";
import { useAuth } from "../../AuthContext";
import { useStore } from "../../StoreContext";
import Header from "../../layouts/Header";

const priorityColor = (p: string) => {
  const m: Record<string, string> = {
    high: "bg-red-50 text-red-700",
    medium: "bg-amber-50 text-amber-700",
    low: "bg-blue-50 text-blue-700",
  };
  return m[p] ?? "bg-slate-100 text-slate-600";
};

export default function StudentAnnouncements() {
  const { currentStudent } = useAuth();
  const { announcements } = useStore();
  const filtered = announcements.filter(
    (a) => a.audience === "all" || a.audience === "students"
  );

  return (
    <div>
      <Header title="Announcements" subtitle="School announcements and notices" userName={currentStudent?.name} userRole="Student" />

      <div className="grid grid-cols-1 gap-4">
        {filtered.map((a) => (
          <div
            key={a.id}
            className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                <Bell size={18} className="text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-slate-800 text-sm">{a.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColor(a.priority)}`}>
                    {a.priority}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-2">{a.content}</p>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span>Audience: {a.audience}</span>
                  <span>{a.publishDate}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-6">No announcements found.</p>
        )}
      </div>
    </div>
  );
}
