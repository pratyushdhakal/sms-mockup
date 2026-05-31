import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { GRADING_SCALES as DATA_GRADING_SCALES } from "../../data";
import type { GradingScale } from "../../types";
import Header from "../../layouts/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function AdminGradingScale() {
  const [scales, setScales] = useState<GradingScale[]>(DATA_GRADING_SCALES);
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<GradingScale | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GradingScale | null>(null);
  const [form, setForm] = useState({ grade: "", minPercentage: "", maxPercentage: "" });

  function resetForm() { setForm({ grade: "", minPercentage: "", maxPercentage: "" }); }

  function handleCreate() {
    if (!form.grade || !form.minPercentage || !form.maxPercentage) return;
    const id = `GS${String(scales.length + 1).padStart(3, "0")}`;
    setScales((prev) => [...prev, {
      id, grade: form.grade, minPercentage: Number(form.minPercentage), maxPercentage: Number(form.maxPercentage),
    }]);
    setCreateOpen(false);
    resetForm();
  }

  function handleEdit() {
    if (!editTarget || !form.grade || !form.minPercentage || !form.maxPercentage) return;
    setScales((prev) => prev.map((s) =>
      s.id === editTarget.id ? { ...s, grade: form.grade, minPercentage: Number(form.minPercentage), maxPercentage: Number(form.maxPercentage) } : s
    ));
    setEditTarget(null);
    resetForm();
  }

  function handleDelete() {
    if (!deleteTarget) return;
    setScales((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  function openEdit(scale: GradingScale) {
    setEditTarget(scale);
    setForm({ grade: scale.grade, minPercentage: String(scale.minPercentage), maxPercentage: String(scale.maxPercentage) });
  }

  return (
    <div>
      <Header title="Grading Scale" subtitle="Configure grade boundaries and labels" />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-lg border bg-card p-4">
          <span className="text-xs text-muted-foreground font-medium">Total Grades</span>
          <p className="text-2xl font-semibold">{scales.length}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <span className="text-xs text-muted-foreground font-medium">Pass Threshold</span>
          <p className="text-2xl font-semibold">
            {scales.find((s) => s.grade === "D")?.minPercentage || "N/A"}%
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <span className="text-xs text-muted-foreground font-medium">Top Grade</span>
          <p className="text-2xl font-semibold">
            {scales.find((s) => s.maxPercentage === 100)?.grade || "N/A"}
          </p>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="flex items-center justify-between p-3 border-b">
          <h2 className="text-sm font-semibold">Grade Definitions</h2>
          <Button size="sm" onClick={() => { resetForm(); setCreateOpen(true); }}>
            <Plus size={14} /> Add Grade
          </Button>
        </div>

        {scales.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-sm mb-3">No grades defined.</p>
            <Button size="sm" onClick={() => { resetForm(); setCreateOpen(true); }}>
              <Plus size={14} /> Add Grade
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Grade</TableHead>
                <TableHead>Min %</TableHead>
                <TableHead>Max %</TableHead>
                <TableHead>Range</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...scales].sort((a, b) => b.minPercentage - a.minPercentage).map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.grade}</TableCell>
                  <TableCell>{s.minPercentage}%</TableCell>
                  <TableCell>{s.maxPercentage}%</TableCell>
                  <TableCell>
                    <div className="h-2 w-24 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-indigo-500"
                        style={{ width: `${((s.maxPercentage - s.minPercentage) / 100) * 100}%`, marginLeft: `${s.minPercentage}%` }}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(s)}>
                        <Pencil size={13} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => setDeleteTarget(s)}>
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
          <DialogHeader><DialogTitle>Add Grade</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label>Grade Label</Label>
              <Input value={form.grade} onChange={(e) => setForm((p) => ({ ...p, grade: e.target.value }))} placeholder="e.g. A+" />
            </div>
            <div className="space-y-1.5">
              <Label>Min Percentage</Label>
              <Input type="number" value={form.minPercentage} onChange={(e) => setForm((p) => ({ ...p, minPercentage: e.target.value }))} placeholder="e.g. 90" />
            </div>
            <div className="space-y-1.5">
              <Label>Max Percentage</Label>
              <Input type="number" value={form.maxPercentage} onChange={(e) => setForm((p) => ({ ...p, maxPercentage: e.target.value }))} placeholder="e.g. 100" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setCreateOpen(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!form.grade || !form.minPercentage || !form.maxPercentage}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editTarget} onOpenChange={(o) => { if (!o) { setEditTarget(null); resetForm(); } }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Edit Grade</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label>Grade Label</Label>
              <Input value={form.grade} onChange={(e) => setForm((p) => ({ ...p, grade: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Min Percentage</Label>
              <Input type="number" value={form.minPercentage} onChange={(e) => setForm((p) => ({ ...p, minPercentage: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Max Percentage</Label>
              <Input type="number" value={form.maxPercentage} onChange={(e) => setForm((p) => ({ ...p, maxPercentage: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditTarget(null); resetForm(); }}>Cancel</Button>
            <Button onClick={handleEdit} disabled={!form.grade || !form.minPercentage || !form.maxPercentage}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}>
        <DialogContent className="sm:max-w-xs">
          <DialogHeader><DialogTitle>Delete Grade</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete grade <strong>{deleteTarget?.grade}</strong>?
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
