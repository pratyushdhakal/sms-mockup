import { useState } from "react";
import { Search, Plus, Pencil, Trash2, Eye } from "lucide-react";
import { CLASS_GROUPS as DATA_CLASS_GROUPS, TEACHERS, SECTIONS, CLASSES_LIST } from "../../data";
import type { ClassGroup } from "../../types";
import { useNavigate } from "../../NavContext";
import Header from "../../layouts/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

export default function AdminClassGroups() {
  const { navigate } = useNavigate();
  const [groups, setGroups] = useState<ClassGroup[]>(DATA_CLASS_GROUPS);
  const [search, setSearch] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ClassGroup | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ClassGroup | null>(null);

  const [form, setForm] = useState({ name: "", section: "", teacherId: "", room: "" });

  const filtered = groups.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.section.toLowerCase().includes(search.toLowerCase()) ||
    g.room.toLowerCase().includes(search.toLowerCase())
  );

  function resetForm() { setForm({ name: "", section: "", teacherId: "", room: "" }); }

  function handleCreate() {
    if (!form.name || !form.section) return;
    const id = `CG${String(groups.length + 1).padStart(3, "0")}`;
    setGroups((prev) => [{
      id, name: form.name, section: form.section, teacherId: form.teacherId, room: form.room, schoolId: "SCH001",
    }, ...prev]);
    setCreateOpen(false);
    resetForm();
  }

  function handleEdit() {
    if (!editTarget || !form.name || !form.section) return;
    setGroups((prev) => prev.map((g) =>
      g.id === editTarget.id ? { ...g, name: form.name, section: form.section, teacherId: form.teacherId, room: form.room } : g
    ));
    setEditTarget(null);
    resetForm();
  }

  function handleDelete() {
    if (!deleteTarget) return;
    setGroups((prev) => prev.filter((g) => g.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  function openEdit(group: ClassGroup) {
    setEditTarget(group);
    setForm({ name: group.name, section: group.section, teacherId: group.teacherId, room: group.room });
  }

  function getTeacherName(id: string) {
    return TEACHERS.find((t) => t.userId === id)?.name || "Unassigned";
  }

  return (
    <div>
      <Header title="Class Groups" subtitle="Manage classes, sections, and room assignments" />

      <div className="rounded-lg border bg-card">
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center gap-2">
            <Search size={14} className="text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search classes..." className="h-8 w-56 text-sm" />
          </div>
          <Button size="sm" onClick={() => { resetForm(); setCreateOpen(true); }}>
            <Plus size={14} /> Add Class Group
          </Button>
        </div>

        {groups.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-sm mb-3">No class groups yet.</p>
            <Button size="sm" onClick={() => { resetForm(); setCreateOpen(true); }}>
              <Plus size={14} /> Add Class Group
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class Name</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Class Teacher</TableHead>
                <TableHead>Room</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((g) => (
                <TableRow key={g.id}>
                  <TableCell className="font-medium">{g.name}</TableCell>
                  <TableCell>{g.section}</TableCell>
                  <TableCell>
                    <button onClick={() => navigate("teachers")} className="hover:text-primary transition-colors">
                      {getTeacherName(g.teacherId)}
                    </button>
                  </TableCell>
                  <TableCell>{g.room}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("routine")} title="View routine">
                        <Eye size={13} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(g)}>
                        <Pencil size={13} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => setDeleteTarget(g)}>
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={createOpen} onOpenChange={(o) => { if (!o) { setCreateOpen(false); resetForm(); } }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Add Class Group</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label>Class Name</Label>
              <Select value={form.name} onValueChange={(v) => setForm((p) => ({ ...p, name: v }))}>
                <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                <SelectContent>
                  {CLASSES_LIST.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Section</Label>
              <Select value={form.section} onValueChange={(v) => setForm((p) => ({ ...p, section: v }))}>
                <SelectTrigger><SelectValue placeholder="Select section" /></SelectTrigger>
                <SelectContent>
                  {SECTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Class Teacher</Label>
              <Select value={form.teacherId} onValueChange={(v) => setForm((p) => ({ ...p, teacherId: v }))}>
                <SelectTrigger><SelectValue placeholder="Select teacher" /></SelectTrigger>
                <SelectContent>
                  {TEACHERS.map((t) => <SelectItem key={t.userId} value={t.userId}>{t.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Room</Label>
              <Input value={form.room} onChange={(e) => setForm((p) => ({ ...p, room: e.target.value }))} placeholder="e.g. 101" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setCreateOpen(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!form.name || !form.section}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editTarget} onOpenChange={(o) => { if (!o) { setEditTarget(null); resetForm(); } }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Edit Class Group</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label>Class Name</Label>
              <Select value={form.name} onValueChange={(v) => setForm((p) => ({ ...p, name: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CLASSES_LIST.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Section</Label>
              <Select value={form.section} onValueChange={(v) => setForm((p) => ({ ...p, section: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SECTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Class Teacher</Label>
              <Select value={form.teacherId} onValueChange={(v) => setForm((p) => ({ ...p, teacherId: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TEACHERS.map((t) => <SelectItem key={t.userId} value={t.userId}>{t.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Room</Label>
              <Input value={form.room} onChange={(e) => setForm((p) => ({ ...p, room: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditTarget(null); resetForm(); }}>Cancel</Button>
            <Button onClick={handleEdit} disabled={!form.name || !form.section}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}>
        <DialogContent className="sm:max-w-xs">
          <DialogHeader><DialogTitle>Delete Class Group</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete <strong>{deleteTarget?.name} ({deleteTarget?.section})</strong>? This action cannot be undone.
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
