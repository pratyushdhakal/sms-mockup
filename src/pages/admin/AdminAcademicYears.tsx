import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { BATCHES as DATA_BATCHES, SCHOOL_CONFIG as DATA_SCHOOL_CONFIG } from "../../data";
import Header from "../../layouts/Header";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import type { SchoolConfig } from "../../types";

type YearEntry = { id: string; year: string };

export default function AdminAcademicYears() {
  const [years, setYears] = useState<YearEntry[]>(
    DATA_BATCHES.map((y, i) => ({ id: `YR${String(i + 1).padStart(3, "0")}`, year: y }))
  );
  const [config, setConfig] = useState<SchoolConfig>(DATA_SCHOOL_CONFIG);
  const [newYear, setNewYear] = useState("");

  const [editTarget, setEditTarget] = useState<YearEntry | null>(null);
  const [editValue, setEditValue] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<YearEntry | null>(null);

  function handleAdd() {
    if (!newYear.trim()) return;
    const id = `YR${String(years.length + 1).padStart(3, "0")}`;
    setYears((prev) => [...prev, { id, year: newYear.trim() }]);
    setNewYear("");
  }

  function handleEdit() {
    if (!editTarget || !editValue.trim()) return;
    setYears((prev) => prev.map((y) => y.id === editTarget.id ? { ...y, year: editValue.trim() } : y));
    setEditTarget(null);
    setEditValue("");
  }

  function handleDelete() {
    if (!deleteTarget) return;
    setYears((prev) => prev.filter((y) => y.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  function setActiveYear(year: string) {
    setConfig((prev) => ({ ...prev, activeAcademicYear: year }));
  }

  return (
    <div>
      <Header title="Academic Years" subtitle="Manage academic years and sessions" />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-lg border bg-card p-4">
          <span className="text-xs text-muted-foreground font-medium">Total Years</span>
          <p className="text-2xl font-semibold">{years.length}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <span className="text-xs text-muted-foreground font-medium">Active Year</span>
          <p className="text-2xl font-semibold">{config.activeAcademicYear}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <span className="text-xs text-muted-foreground font-medium">School</span>
          <p className="text-lg font-semibold">{config.schoolName}</p>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="flex items-center gap-2 p-3 border-b">
          <Input
            value={newYear}
            onChange={(e) => setNewYear(e.target.value)}
            placeholder="New academic year..."
            className="h-8 w-52 text-sm"
            onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
          />
          <Button size="sm" onClick={handleAdd} disabled={!newYear.trim()}>
            <Plus size={14} /> Add Year
          </Button>
        </div>

        {years.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-sm">No academic years defined.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {years.map((y, idx) => (
                <TableRow key={y.id}>
                  <TableCell className="text-muted-foreground text-xs">{idx + 1}</TableCell>
                  <TableCell className="font-medium">{y.year}</TableCell>
                  <TableCell>
                    {config.activeAcademicYear === y.year ? (
                      <Badge variant="default" className="cursor-pointer" onClick={() => setActiveYear("")}>
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="cursor-pointer" onClick={() => setActiveYear(y.year)}>
                        Set Active
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditTarget(y); setEditValue(y.year); }}>
                        <Pencil size={13} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => setDeleteTarget(y)}>
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

      <Dialog open={!!editTarget} onOpenChange={(o) => { if (!o) { setEditTarget(null); setEditValue(""); } }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Edit Year</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label>Year</Label>
              <Input value={editValue} onChange={(e) => setEditValue(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditTarget(null); setEditValue(""); }}>Cancel</Button>
            <Button onClick={handleEdit} disabled={!editValue.trim()}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}>
        <DialogContent className="sm:max-w-xs">
          <DialogHeader><DialogTitle>Delete Year</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete <strong>{deleteTarget?.year}</strong>?
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
