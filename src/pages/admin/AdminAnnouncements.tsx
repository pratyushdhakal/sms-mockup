import { useState } from "react";
import { Plus, X, Megaphone } from "lucide-react";
import { ANNOUNCEMENTS as DATA_ANNOUNCEMENTS } from "../../data";
import type { Announcement, AnnouncementAudience, Priority } from "../../types";
import Header from "../../layouts/Header";

const priorityColor = (p: string) =>
  ({ high: "bg-red-50 text-red-700", medium: "bg-amber-50 text-amber-700", low: "bg-blue-50 text-blue-700" })[p] || "bg-gray-100 text-gray-600";

const audienceColor = (a: string) =>
  ({ all: "bg-indigo-50 text-indigo-700", students: "bg-emerald-50 text-emerald-700", teachers: "bg-purple-50 text-purple-700", staff: "bg-cyan-50 text-cyan-700", parents: "bg-rose-50 text-rose-700" })[a] || "bg-gray-100 text-gray-600";

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(DATA_ANNOUNCEMENTS);
  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formAudience, setFormAudience] = useState<AnnouncementAudience>("all");
  const [formPriority, setFormPriority] = useState<Priority>("medium");
  const [formDate, setFormDate] = useState("");

  function resetForm() {
    setFormTitle("");
    setFormContent("");
    setFormAudience("all");
    setFormPriority("medium");
    setFormDate("");
  }

  function handlePost() {
    if (!formTitle || !formContent || !formDate) return;
    const newAnnouncement: Announcement = {
      id: `N${String(announcements.length + 1).padStart(3, "0")}`,
      title: formTitle,
      content: formContent,
      audience: formAudience,
      priority: formPriority,
      publishDate: formDate,
      createdAt: new Date().toISOString().split("T")[0],
      schoolId: "SCH001",
    };
    setAnnouncements((prev) => [newAnnouncement, ...prev]);
    resetForm();
    setShowForm(false);
  }

  return (
    <div>
      <Header title="Announcements" subtitle="Post and manage announcements" />

      <div className="bg-white rounded-xl border border-slate-100">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700">All Announcements</h2>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <Plus size={14} /> Post Notice
          </button>
        </div>

        <div className="p-4 space-y-3">
          {announcements.map((a) => (
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
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-800">Post New Notice</h2>
              <button onClick={() => { resetForm(); setShowForm(false); }} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <X size={16} className="text-slate-500" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Title</label>
                <input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="Notice title" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Content</label>
                <textarea value={formContent} onChange={(e) => setFormContent(e.target.value)} rows={4} placeholder="Write your notice content here..." className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Audience</label>
                  <select value={formAudience} onChange={(e) => setFormAudience(e.target.value as AnnouncementAudience)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 bg-white">
                    <option value="all">All</option>
                    <option value="students">Students</option>
                    <option value="teachers">Teachers</option>
                    <option value="staff">Staff</option>
                    <option value="parents">Parents</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Priority</label>
                  <select value={formPriority} onChange={(e) => setFormPriority(e.target.value as Priority)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 bg-white">
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Publish Date</label>
                <input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => { resetForm(); setShowForm(false); }} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
              <button onClick={handlePost} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Post Notice</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
