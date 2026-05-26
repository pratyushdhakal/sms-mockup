import { useState } from "react";
import { School2, LogIn } from "lucide-react";
import { useAuth } from "../AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const ok = login(email, password);
    if (!ok) setError("Invalid credentials. Try admin/admin, teacher/teacher, staff/staff, student/student, or parent/parent.");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4">
            <School2 size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-slate-800">Vidya School</h1>
          <p className="text-sm text-slate-400 mt-1">School Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Email / Username</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter username"
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <button type="submit" className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
            <LogIn size={15} />
            Sign In
          </button>

          <p className="text-xs text-slate-400 text-center pt-2">
            Demo: admin/admin · teacher/teacher · staff/staff · student/student · parent/parent
          </p>
        </form>
      </div>
    </div>
  );
}
