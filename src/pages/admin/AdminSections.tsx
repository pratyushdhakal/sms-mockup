import { useState } from "react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { SECTIONS as DATA_SECTIONS } from "../../data";
import Header from "../../layouts/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type SectionEntry = { id: string; name: string };

export default function AdminSections() {
  const [sections, setSections] = useState<SectionEntry[]>(
    DATA_SECTIONS.map((s, i) => ({
      id: `SEC${String(i + 1).padStart(3, "0")}`,
      name: s,
    })),
  );
  const [deleteTarget, setDeleteTarget] = useState<SectionEntry | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [newName, setNewName] = useState("");

  function handleAdd() {
    if (!newName.trim()) return;
    const id = `SEC${String(sections.length + 1).padStart(3, "0")}`;
    setSections((prev) => [...prev, { id, name: newName.trim() }]);
    setNewName("");
  }

  function handleEdit(id: string) {
    if (!editValue.trim()) return;
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, name: editValue.trim() } : s)),
    );
    setEditingId(null);
    setEditValue("");
  }

  function handleDelete() {
    if (!deleteTarget) return;
    setSections((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  function startEdit(section: SectionEntry) {
    setEditingId(section.id);
    setEditValue(section.name);
  }

  return (
    <div>
      <Header title="Sections" subtitle="Manage section labels for classes" />

      <div className="rounded-lg border bg-card">
        <div className="flex items-center gap-2 p-3 border-b">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New section name..."
            className="h-8 w-64 text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
          />
          <Button size="sm" onClick={handleAdd} disabled={!newName.trim()}>
            <Plus size={14} /> Add
          </Button>
        </div>

        {sections.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-sm">
              No sections defined.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Section Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sections.map((s, idx) => (
                <TableRow key={s.id}>
                  <TableCell className="text-muted-foreground text-xs">
                    {idx + 1}
                  </TableCell>
                  <TableCell>
                    {editingId === s.id ? (
                      <div className="flex items-center gap-1">
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="h-7 w-48 text-sm"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleEdit(s.id);
                          }}
                          autoFocus
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-emerald-500"
                          onClick={() => handleEdit(s.id)}
                        >
                          <Check size={13} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-500"
                          onClick={() => {
                            setEditingId(null);
                            setEditValue("");
                          }}
                        >
                          <X size={13} />
                        </Button>
                      </div>
                    ) : (
                      <span className="text-sm font-medium">{s.name}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => startEdit(s)}
                      >
                        <Pencil size={13} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500"
                        onClick={() => setDeleteTarget(s)}
                      >
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

      <Dialog
        open={!!deleteTarget}
        onOpenChange={(o) => {
          if (!o) setDeleteTarget(null);
        }}
      >
        <DialogContent className="sm:max-w-xs">
          <DialogHeader>
            <DialogTitle>Delete Section</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete{" "}
            <strong>{deleteTarget?.name}</strong>?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
