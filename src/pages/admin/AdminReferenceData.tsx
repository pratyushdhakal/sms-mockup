import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { REFERENCE_DATA as DATA_REFERENCE } from "../../data";
import type { ReferenceDatum } from "../../types";
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

const REF_TYPES = [
  "staff_role", "leave_type", "gender", "blood_group", "religion",
  "ethnic_group", "fee_status", "audience", "residency_type", "staff_type",
];

const TYPE_LABELS: Record<string, string> = {
  staff_role: "Staff Roles",
  leave_type: "Leave Types",
  gender: "Genders",
  blood_group: "Blood Groups",
  religion: "Religions",
  ethnic_group: "Ethnic Groups",
  fee_status: "Fee Statuses",
  audience: "Announcement Audiences",
  residency_type: "Residency Types",
  staff_type: "Staff Types",
};

export default function AdminReferenceData() {
  const [data, setData] = useState<ReferenceDatum[]>(DATA_REFERENCE);
  const [selectedType, setSelectedType] = useState<string>("staff_role");
  const [newValue, setNewValue] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<ReferenceDatum | null>(null);

  const filtered = data.filter((d) => d.type === selectedType);

  function handleAdd() {
    if (!newValue.trim()) return;
    const id = `REF${String(data.length + 1).padStart(3, "0")}`;
    setData((prev) => [...prev, { id, type: selectedType, value: newValue.trim() }]);
    setNewValue("");
  }

  function handleDelete() {
    if (!deleteTarget) return;
    setData((prev) => prev.filter((d) => d.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  return (
    <div>
      <Header title="Reference Data" subtitle="Manage dropdown values used across the system" />

      <div className="rounded-lg border bg-card">
        <div className="flex items-center gap-3 p-3 border-b flex-wrap">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-52 h-8 text-sm">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {REF_TYPES.map((t) => <SelectItem key={t} value={t}>{TYPE_LABELS[t] || t}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="New value..."
            className="h-8 w-52 text-sm"
            onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
          />
          <Button size="sm" onClick={handleAdd} disabled={!newValue.trim()}>
            <Plus size={14} /> Add
          </Button>
          <Badge variant="secondary" className="ml-auto">{filtered.length} values</Badge>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Value</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground text-sm">
                  No values for this type.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((d, idx) => (
                <TableRow key={d.id}>
                  <TableCell className="text-muted-foreground text-xs">{idx + 1}</TableCell>
                  <TableCell className="font-medium text-sm">{d.value}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => setDeleteTarget(d)}>
                      <Trash2 size={13} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}>
        <DialogContent className="sm:max-w-xs">
          <DialogHeader><DialogTitle>Delete Value</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete <strong>{deleteTarget?.value}</strong>?
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
