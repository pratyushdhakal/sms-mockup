import { useState } from "react";
import { Search, Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { MOCK_USERS as DATA_USERS } from "../../data";
import type { User, UserRole } from "../../types";
import { useNavigate } from "../../NavContext";
import Header from "../../layouts/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const ROLES: UserRole[] = ["admin", "teacher", "staff", "student", "parent"];

const roleBadge = (role: UserRole) => {
  const colors: Record<string, string> = {
    admin: "bg-red-50 text-red-700",
    teacher: "bg-blue-50 text-blue-700",
    staff: "bg-amber-50 text-amber-700",
    student: "bg-emerald-50 text-emerald-700",
    parent: "bg-purple-50 text-purple-700",
  };
  return colors[role] || "bg-gray-100 text-gray-600";
};

export default function AdminUsers() {
  const { navigate } = useNavigate();
  const [users, setUsers] = useState<User[]>(DATA_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", type: "" as UserRole | "" });

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = !roleFilter || u.type === roleFilter;
    return matchSearch && matchRole;
  });

  function resetForm() { setForm({ name: "", email: "", password: "", phone: "", type: "" }); }

  function handleCreate() {
    if (!form.name || !form.email || !form.password || !form.type) return;
    const id = `U${String(users.length + 1).padStart(3, "0")}`;
    setUsers((prev) => [{
      id, type: form.type as UserRole, email: form.email, password: form.password,
      name: form.name, phone: form.phone || "98XXXXXXXX", schoolId: "SCH001", active: true,
    }, ...prev]);
    setCreateOpen(false);
    resetForm();
  }

  function handleEdit() {
    if (!editTarget || !form.name || !form.email || !form.type) return;
    setUsers((prev) => prev.map((u) =>
      u.id === editTarget.id ? {
        ...u, name: form.name, email: form.email, phone: form.phone,
        password: form.password || u.password, type: form.type as UserRole,
      } : u
    ));
    setEditTarget(null);
    resetForm();
  }

  function handleDelete() {
    if (!deleteTarget) return;
    setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  function toggleActive(user: User) {
    setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, active: !u.active } : u));
  }

  function openEdit(user: User) {
    setEditTarget(user);
    setForm({ name: user.name, email: user.email, password: "", phone: user.phone, type: user.type });
  }

  return (
    <div>
      <Header title="User Accounts" subtitle="Manage system user accounts and roles" />

      <div className="rounded-lg border bg-card">
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center gap-2">
            <Search size={14} className="text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="h-8 w-56 text-sm" />
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-32 h-8 text-sm"><SelectValue placeholder="All Roles" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Roles</SelectItem>
                {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button size="sm" onClick={() => { resetForm(); setCreateOpen(true); }}>
            <Plus size={14} /> Add User
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground text-sm">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{u.email}</TableCell>
                  <TableCell>
                    <button onClick={() => {
                      const roleMap: Record<string, string> = { teacher: "teachers", staff: "staff", student: "students", parent: "parents" };
                      const target = roleMap[u.type];
                      if (target) navigate(target);
                    }} className={`text-xs px-2 py-0.5 rounded-full font-medium hover:opacity-80 transition-opacity ${roleBadge(u.type)}`}>
                      {u.type}
                    </button>
                  </TableCell>
                  <TableCell>
                    <Badge variant={u.active ? "default" : "secondary"}>{u.active ? "Active" : "Inactive"}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleActive(u)} title={u.active ? "Deactivate" : "Activate"}>
                        {u.active ? <ToggleRight size={14} className="text-emerald-500" /> : <ToggleLeft size={14} className="text-muted-foreground" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(u)}>
                        <Pencil size={13} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => setDeleteTarget(u)}>
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={createOpen} onOpenChange={(o) => { if (!o) { setCreateOpen(false); resetForm(); } }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Add User</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Full name" />
            </div>
            <div className="space-y-1.5">
              <Label>Email / Username</Label>
              <Input value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder="e.g. username" />
            </div>
            <div className="space-y-1.5">
              <Label>Password</Label>
              <Input type="password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} placeholder="Password" />
            </div>
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} placeholder="98XXXXXXXX" />
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select value={form.type} onValueChange={(v) => setForm((p) => ({ ...p, type: v as UserRole }))}>
                <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setCreateOpen(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!form.name || !form.email || !form.password || !form.type}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editTarget} onOpenChange={(o) => { if (!o) { setEditTarget(null); resetForm(); } }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Edit User</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Email / Username</Label>
              <Input value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Password (leave blank to keep current)</Label>
              <Input type="password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} placeholder="New password" />
            </div>
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select value={form.type} onValueChange={(v) => setForm((p) => ({ ...p, type: v as UserRole }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditTarget(null); resetForm(); }}>Cancel</Button>
            <Button onClick={handleEdit} disabled={!form.name || !form.email || !form.type}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}>
        <DialogContent className="sm:max-w-xs">
          <DialogHeader><DialogTitle>Delete User</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete <strong>{deleteTarget?.name}</strong>?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
