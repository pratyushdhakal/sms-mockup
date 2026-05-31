import { Users, MapPin } from "lucide-react";
import { CLASS_GROUPS } from "../../data";
import { useStore } from "../../StoreContext";
import Header from "../../layouts/Header";

export default function TeacherClasses() {
  const { students } = useStore();
  const myClasses = CLASS_GROUPS.filter((c) => c.teacherId === "U002");

  return (
    <div>
      <Header title="My Classes" subtitle="Classes assigned to you" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {myClasses.map((c) => {
          const count = students.filter((s) => s.classId === c.id).length;
          return (
            <div key={c.id} className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-base font-semibold text-slate-800">{c.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{c.section}</p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-medium">Active</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Users size={13} /> {count} Students</span>
                <span className="flex items-center gap-1"><MapPin size={13} /> Room {c.room}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
