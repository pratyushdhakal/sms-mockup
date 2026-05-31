import { useState } from "react";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { FEE_TYPES as DATA_FEE_TYPES, CLASS_GROUPS } from "../../data";
import type { FeeType } from "../../types";
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

export default function AdminFeeStructure() {
  const { navigate } = useNavigate();
  const [feeTypes, setFeeTypes] = useState<FeeType[]>(DATA_FEE_TYPES);
  const [search, setSearch] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<FeeType | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FeeType | null>(null);

  const [form, setForm] = useState({ name: "", amount: "", classId: "" });

  function getClassName(id: string) {
    const cg = CLASS_GROUPS.find((c) => c.id === id);
    return cg ? `${cg.name} (${cg.section})` : id;
  }

  const filtered = feeTypes.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    getClassName(f.classId).toLowerCase().includes(search.toLowerCase())
  );

  function resetForm() { setForm({ name: "", amount: "", classId: "" }); }

  function handleCreate() {
    if (!form.name || !form.amount || !form.classId) return;
    const id = `FT${String(feeTypes.length + 1).padStart(3, "0")}`;
    setFeeTypes((prev) => [{
      id, name: form.name, amount: Number(form.amount), classId: form.classId,
    }, ...prev]);
    setCreateOpen(false);
    resetForm();
  }

  function handleEdit() {
    if (!editTarget || !form.name || !form.amount || !form.classId) return;
    setFeeTypes((prev) => prev.map((f) =>
      f.id === editTarget.id ? { ...f, name: form.name, amount: Number(form.amount), classId: form.classId } : f
    ));
    setEditTarget(null);
    resetForm();
  }

  function handleDelete() {
    if (!deleteTarget) return;
    setFeeTypes((prev) => prev.filter((f) => f.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  function openEdit(fee: FeeType) {
    setEditTarget(fee);
    setForm({ name: fee.name, amount: String(fee.amount), classId: fee.classId });
  }

  return (
    <div>
      <Header title="Fee Structure" subtitle="Define fee types and amounts per class" />

      <div className="rounded-lg border bg-card">
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center gap-2">
            <Search size={14} className="text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search fee types..." className="h-8 w-56 text-sm" />
          </div>
          <Button size="sm" onClick={() => { resetForm(); setCreateOpen(true); }}>
            <Plus size={14} /> Add Fee Type
          </Button>
        </div>

        {feeTypes.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-sm mb-3">No fee types defined.</p>
            <Button size="sm" onClick={() => { resetForm(); setCreateOpen(true); }}>
              <Plus size={14} /> Add Fee Type
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fee Type</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Amount (Rs.)</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="font-medium">{f.name}</TableCell>
                  <TableCell>
                    <button onClick={() => navigate("class-groups")} className="hover:text-primary transition-colors">
                      {getClassName(f.classId)}
                    </button>
                  </TableCell>
                  <TableCell>Rs. {f.amount.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(f)}>
                        <Pencil size={13} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => setDeleteTarget(f)}>
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
          <DialogHeader><DialogTitle>Add Fee Type</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label>Fee Name</Label>
              <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Tuition Fee" />
            </div>
            <div className="space-y-1.5">
              <Label>Class</Label>
              <Select value={form.classId} onValueChange={(v) => setForm((p) => ({ ...p, classId: v }))}>
                <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                <SelectContent>
                  {CLASS_GROUPS.map((c) => <SelectItem key={c.id} value={c.id}>{c.name} ({c.section})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Amount (Rs.)</Label>
              <Input type="number" value={form.amount} onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))} placeholder="e.g. 5000" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setCreateOpen(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!form.name || !form.amount || !form.classId}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editTarget} onOpenChange={(o) => { if (!o) { setEditTarget(null); resetForm(); } }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Edit Fee Type</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label>Fee Name</Label>
              <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Class</Label>
              <Select value={form.classId} onValueChange={(v) => setForm((p) => ({ ...p, classId: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CLASS_GROUPS.map((c) => <SelectItem key={c.id} value={c.id}>{c.name} ({c.section})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Amount (Rs.)</Label>
              <Input type="number" value={form.amount} onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditTarget(null); resetForm(); }}>Cancel</Button>
            <Button onClick={handleEdit} disabled={!form.name || !form.amount || !form.classId}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}>
        <DialogContent className="sm:max-w-xs">
          <DialogHeader><DialogTitle>Delete Fee Type</DialogTitle></DialogHeader>
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
