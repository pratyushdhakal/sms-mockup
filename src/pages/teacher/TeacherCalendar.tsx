import { useState } from "react";
import { useStore } from "../../StoreContext";
import Header from "../../layouts/Header";

const TABS = ["General Calendar", "Academic Calendar"] as const;
type Tab = (typeof TABS)[number];

export default function TeacherCalendar() {
  const { calendarEvents } = useStore();
  const [activeTab, setActiveTab] = useState<Tab>("General Calendar");

  const filtered = calendarEvents.filter((e) =>
    activeTab === "General Calendar" ? e.type === "general" : e.type === "academic"
  );

  return (
    <div>
      <Header title="Calendar" subtitle="School events & academic calendar" />

      <div className="bg-white rounded-xl border border-slate-100">
        <div className="flex items-center justify-between border-b border-slate-100">
          <div className="flex">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab ? "text-indigo-600 border-b-2 border-indigo-600" : "text-slate-400 hover:text-slate-600"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.length > 0 ? (
            filtered.map((event) => (
              <div key={event.id} className="border border-slate-100 rounded-xl p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-semibold text-slate-800">{event.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${event.type === "academic" ? "bg-violet-50 text-violet-700" : "bg-sky-50 text-sky-700"}`}>
                    {event.type === "academic" ? "Academic" : "General"}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-2">{event.description}</p>
                <p className="text-xs text-slate-400">
                  <span className="font-medium text-slate-600">{event.date}</span>
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-sm text-slate-400">No events found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
