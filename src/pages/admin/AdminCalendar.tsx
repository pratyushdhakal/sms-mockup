import { useState } from "react";
import { Plus, X } from "lucide-react";
import { CALENDAR_EVENTS as DATA_EVENTS } from "../../data";
import type { CalendarEvent } from "../../types";
import Header from "../../layouts/Header";

const TABS = ["General Calendar", "Academic Calendar"] as const;
type Tab = (typeof TABS)[number];

const INIT_FORM = { title: "", description: "", date: "", type: "general" as "general" | "academic" };

export default function AdminCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>(DATA_EVENTS);
  const [activeTab, setActiveTab] = useState<Tab>("General Calendar");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<{ title: string; description: string; date: string; type: "general" | "academic" }>(INIT_FORM);

  const filtered = events.filter((e) =>
    activeTab === "General Calendar" ? e.type === "general" : e.type === "academic"
  );

  function handleSubmit() {
    if (!form.title || !form.date) return;
    const newEvent: CalendarEvent = {
      id: `E${String(events.length + 1).padStart(3, "0")}`,
      title: form.title,
      description: form.description,
      date: form.date,
      type: form.type,
      schoolId: "SCH001",
    };
    setEvents((prev) => [newEvent, ...prev]);
    setForm(INIT_FORM);
    setShowForm(false);
  }

  return (
    <div>
      <Header title="Calendar" subtitle="School events & academic calendar" />

      <div className="bg-white rounded-xl border border-slate-100">
        <div className="flex items-center justify-between border-b border-slate-100">
          <div className="flex">
            {TABS.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab ? "text-indigo-600 border-b-2 border-indigo-600" : "text-slate-400 hover:text-slate-600"}`}>
                {tab}
              </button>
            ))}
          </div>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 mr-4">
            <Plus size={14} /> Add Event
          </button>
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

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-800">Add New Event</h2>
              <button onClick={() => { setShowForm(false); setForm(INIT_FORM); }} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <X size={16} className="text-slate-500" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Title</label>
                <input value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Event title" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} rows={3} placeholder="Event description" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 resize-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Date</label>
                <input value={form.date} onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))} type="date" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Type</label>
                <select value={form.type} onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value as "general" | "academic" }))} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 bg-white">
                  <option value="general">General</option>
                  <option value="academic">Academic</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => { setShowForm(false); setForm(INIT_FORM); }} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
              <button onClick={handleSubmit} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Add Event</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
