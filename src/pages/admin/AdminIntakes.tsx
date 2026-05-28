import { useState } from "react";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { useStore } from "../../StoreContext";
import { CLASSES_LIST, BATCHES } from "../../data";
import Header from "../../layouts/Header";
import { Badge } from "@/components/ui/badge";
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
import type { Intake } from "../../types";

export default function AdminIntakes() {
  const { intakes, setIntakes } = useStore();
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Intake | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Intake | null>(null);

  const [form, setForm] = useState({ name: "", grade: "", academicYear: "", capacity: "" });

  const filtered = intakes.filter((i) => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.grade.toLowerCase().includes(search.toLowerCase());
    const matchGrade = !gradeFilter || i.grade === gradeFilter;
    return matchSearch && matchGrade;
  });

  function resetForm() { setForm({ name: "", grade: "", academicYear: "", capacity: "" }); }

  function handleCreate() {
    if (!form.name || !form.grade || !form.academicYear || !form.capacity) return;
    const id = `I${String(intakes.length + 1).padStart(3, "0")}`;
    setIntakes((prev) => [{
      id, name: form.name, grade: form.grade, academicYear: form.academicYear,
      capacity: Number(form.capacity), enrolled: 0, status: "open", schoolId: "SCH001",
    }, ...prev]);
    setCreateOpen(false);
    resetForm();
  }

  function handleEdit() {
    if (!editTarget || !form.name || !form.capacity) return;
    setIntakes((prev) => prev.map((i) =>
      i.id === editTarget.id ? { ...i, name: form.name, capacity: Number(form.capacity) } : i
    ));
    setEditTarget(null);
    resetForm();
  }

  function handleDelete() {
    if (!deleteTarget) return;
    setIntakes((prev) => prev.filter((i) => i.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  function toggleStatus(intake: Intake) {
    setIntakes((prev) => prev.map((i) =>
      i.id === intake.id ? { ...i, status: i.status === "open" ? "closed" : "open" } : i
    ));
  }

  function openEdit(intake: Intake) {
    setEditTarget(intake);
    setForm({ name: intake.name, grade: intake.grade, academicYear: intake.academicYear, capacity: String(intake.capacity) });
  }

  return (
    <div>
      <Header title="Batch Management" subtitle="Create and manage group enrollment capacity" />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="rounded-lg border bg-card p-4">
          <span className="text-xs text-muted-foreground font-medium">Total Batches</span>
          <p className="text-2xl font-semibold">{intakes.length}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <span className="text-xs text-muted-foreground font-medium">Open Batches</span>
          <p className="text-2xl font-semibold">{intakes.filter((i) => i.status === "open").length}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <span className="text-xs text-muted-foreground font-medium">Total Capacity</span>
          <p className="text-2xl font-semibold">{intakes.reduce((s, i) => s + i.capacity, 0)}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <span className="text-xs text-muted-foreground font-medium">Total Enrolled</span>
          <p className="text-2xl font-semibold">{intakes.reduce((s, i) => s + i.enrolled, 0)}</p>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center gap-2">
            <Search size={14} className="text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search batches..." className="h-8 w-56 text-sm" />
            <Select value={gradeFilter} onValueChange={setGradeFilter}>
              <SelectTrigger className="w-32 h-8 text-sm"><SelectValue placeholder="All Grades" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Grades</SelectItem>
                {CLASSES_LIST.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button size="sm" onClick={() => { resetForm(); setCreateOpen(true); }}>
            <Plus size={14} /> Create Batch
          </Button>
        </div>

        {intakes.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-sm mb-3">No batches yet. Create your first batch to start admissions.</p>
            <Button size="sm" onClick={() => { resetForm(); setCreateOpen(true); }}>
              <Plus size={14} /> Create Batch
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch Name</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Enrolled</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((intake) => (
                <TableRow key={intake.id}>
                  <TableCell className="font-medium">{intake.name}</TableCell>
                  <TableCell>{intake.grade}</TableCell>
                  <TableCell>{intake.academicYear}</TableCell>
                  <TableCell>{intake.capacity}</TableCell>
                  <TableCell>{intake.enrolled}</TableCell>
                  <TableCell>
                    <button onClick={() => toggleStatus(intake)}>
                      <Badge variant={intake.status === "open" ? "default" : "secondary"} className="cursor-pointer">
                        {intake.status}
                      </Badge>
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(intake)}>
                        <Pencil size={13} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => setDeleteTarget(intake)}>
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

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={(o) => { if (!o) { setCreateOpen(false); resetForm(); } }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Create Batch</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label>Batch Name</Label>
              <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Nursery Intake 2083" />
            </div>
            <div className="space-y-1.5">
              <Label>Grade</Label>
              <Select value={form.grade} onValueChange={(v) => setForm((p) => ({ ...p, grade: v }))}>
                <SelectTrigger><SelectValue placeholder="Select grade" /></SelectTrigger>
                <SelectContent>
                  {CLASSES_LIST.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Academic Year</Label>
              <Select value={form.academicYear} onValueChange={(v) => setForm((p) => ({ ...p, academicYear: v }))}>
                <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
                <SelectContent>
                  {BATCHES.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Capacity</Label>
              <Input type="number" value={form.capacity} onChange={(e) => setForm((p) => ({ ...p, capacity: e.target.value }))} placeholder="e.g. 40" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setCreateOpen(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!form.name || !form.grade || !form.academicYear || !form.capacity}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editTarget} onOpenChange={(o) => { if (!o) { setEditTarget(null); resetForm(); } }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Edit Batch</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label>Batch Name</Label>
              <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Grade</Label>
              <Select value={form.grade} onValueChange={(v) => setForm((p) => ({ ...p, grade: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CLASSES_LIST.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Academic Year</Label>
              <Select value={form.academicYear} onValueChange={(v) => setForm((p) => ({ ...p, academicYear: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {BATCHES.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Capacity</Label>
              <Input type="number" value={form.capacity} onChange={(e) => setForm((p) => ({ ...p, capacity: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditTarget(null); resetForm(); }}>Cancel</Button>
            <Button onClick={handleEdit} disabled={!form.name || !form.capacity}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}>
        <DialogContent className="sm:max-w-xs">
          <DialogHeader><DialogTitle>Delete Batch</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action cannot be undone.
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
