import { Bell, ChevronDown } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  userName?: string;
  userRole?: string;
}

export default function Header({ title, subtitle = "Academic Year 2082–83", userName = "Admin", userRole = "Administrator" }: HeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-800">{title}</h1>
        <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
            <span className="text-xs font-semibold text-indigo-700">{userName.split(" ").map((n) => n[0]).slice(0, 2).join("")}</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-700 leading-none">{userName}</p>
            <p className="text-xs text-slate-400 mt-0.5">{userRole}</p>
          </div>
          <ChevronDown size={14} className="text-slate-400" />
        </div>
      </div>
    </div>
  );
}
