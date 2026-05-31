import { useState } from "react";
import { CalendarDays, BookOpen } from "lucide-react";
import { useStore } from "../../StoreContext";
import Header from "../../layouts/Header";

type TabType = "general" | "academic";

export default function ParentCalendar() {
  const { calendarEvents } = useStore();
  const [tab, setTab] = useState<TabType>("general");

  const events = calendarEvents.filter((e) => e.type === tab);

  const tabs: { key: TabType; label: string; icon: typeof CalendarDays }[] = [
    { key: "general", label: "General", icon: CalendarDays },
    { key: "academic", label: "Academic", icon: BookOpen },
  ];

  return (
    <div>
      <Header title="Calendar" subtitle="School events and schedules" userName="Parent" userRole="Parent" />

      <div className="flex gap-2 mb-4">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
              tab === key
                ? "bg-indigo-600 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {events.map((e) => (
          <div
            key={e.id}
            className="bg-white rounded-xl border border-slate-100 p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                <CalendarDays size={20} className="text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-slate-800 text-sm">{e.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{e.description}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-medium text-slate-700">{e.date}</p>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium capitalize bg-indigo-50 text-indigo-700 mt-1 inline-block">
                  {e.type}
                </span>
              </div>
            </div>
          </div>
        ))}
        {events.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-6">No events found.</p>
        )}
      </div>
    </div>
  );
}
