import { useState } from "react";
import { School2, LogIn } from "lucide-react";
import { useAuth } from "../AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const ok = login(email, password);
    if (!ok)
      setError(
        "Invalid credentials. Try admin/admin, teacher/teacher, staff/staff, student/student, or parent/parent."
      );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-sm shadow-sm">
        <CardHeader className="items-center pb-4">
          <div className="w-12 h-12 bg-foreground rounded-xl flex items-center justify-center mb-3">
            <School2 size={24} className="text-background" />
          </div>
          <CardTitle className="text-xl">Vidya School</CardTitle>
          <CardDescription>School Management System</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email / Username</Label>
              <Input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>

            {error && (
              <div className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full gap-2">
              <LogIn size={15} />
              Sign In
            </Button>

            <p className="text-xs text-muted-foreground text-center pt-1">
              Demo: admin/admin &middot; teacher/teacher &middot; staff/staff
              &middot; student/student &middot; parent/parent
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
