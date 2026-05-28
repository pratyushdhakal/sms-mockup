import { useState, useMemo } from "react";
import { Plus, Search, Edit2, Trash2, BookMarked, Users, DoorOpen, DoorClosed } from "lucide-react";
import { INTAKES as DATA_INTAKES, CLASSES_LIST } from "../../data";
import type { Intake } from "../../types";
import Header from "../../layouts/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ACADEMIC_YEARS = ["2080", "2081", "2082", "2083", "2084", "2085"];

interface FormState {
  name: string;
  academicYear: string;
  grade: string;
  capacity: number;
  status: "open" | "closed";
}

const INIT_FORM: FormState = {
  name: "",
  academicYear: "",
  grade: "",
  capacity: 0,
  status: "open",
};

const REQUIRED_FIELDS: Record<string, string> = {
  name: "Name is required",
  academicYear: "Academic year is required",
  grade: "Grade is required",
};

function SelectField({
  label,
  value,
  options,
  onChange,
  error,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  error?: string;
}) {
  const safeValue = value || "radix-placeholder";
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={safeValue} onValueChange={(v) => onChange(v === "radix-placeholder" ? "" : v)}>
        <SelectTrigger className={error ? "border-destructive" : ""}>
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="radix-placeholder">Select {label}</SelectItem>
          {options.filter((o) => o !== "").map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export default function AdminIntakes() {
  const [intakes, setIntakes] = useState<Intake[]>(DATA_INTAKES);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({ ...INIT_FORM });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const stats = useMemo(() => {
    const total = intakes.length;
    const open = intakes.filter((i) => i.status === "open").length;
    const closed = intakes.filter((i) => i.status === "closed").length;
    const totalCapacity = intakes.reduce((s, i) => s + i.capacity, 0);
    const totalEnrolled = intakes.reduce((s, i) => s + i.enrolled, 0);
    return { total, open, closed, totalCapacity, totalEnrolled };
  }, [intakes]);

  const filtered = intakes.filter((i) => {
    const matchSearch =
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.id.toLowerCase().includes(search.toLowerCase()) ||
      i.grade.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || i.status === statusFilter;
    const matchGrade = !gradeFilter || i.grade === gradeFilter;
    return matchSearch && matchStatus && matchGrade;
  });

  function handleChange(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field])
      setErrors((prev) => {
        const n = { ...prev };
        delete n[field];
        return n;
      });
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    for (const [field, msg] of Object.entries(REQUIRED_FIELDS)) {
      const val = form[field as keyof FormState];
      if (!val) newErrors[field] = msg;
    }
    if (form.capacity < 1) newErrors.capacity = "Capacity must be at least 1";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;

    if (editingId) {
      setIntakes((prev) =>
        prev.map((i) =>
          i.id === editingId
            ? { ...i, name: form.name, academicYear: form.academicYear, grade: form.grade, capacity: form.capacity, status: form.status }
            : i
        )
      );
    } else {
      const newIntake: Intake = {
        id: `I${String(intakes.length + 1).padStart(3, "0")}`,
        name: form.name,
        academicYear: form.academicYear,
        grade: form.grade,
        capacity: form.capacity,
        enrolled: 0,
        status: form.status,
        schoolId: "SCH001",
      };
      setIntakes((prev) => [newIntake, ...prev]);
    }

    setEditingId(null);
    setDialogOpen(false);
  }

  function handleEdit(intake: Intake) {
    setForm({
      name: intake.name,
      academicYear: intake.academicYear,
      grade: intake.grade,
      capacity: intake.capacity,
      status: intake.status,
    });
    setEditingId(intake.id);
    setErrors({});
    setDialogOpen(true);
  }

  function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this intake?")) {
      setIntakes((prev) => prev.filter((i) => i.id !== id));
    }
  }

  const grades = useMemo(() => [...new Set(intakes.map((i) => i.grade))], [intakes]);

  return (
    <div>
      <Header title="Intake Management" subtitle="Manage admission intakes & enrollment" />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground font-medium">Total Intakes</span>
            <BookMarked size={15} className="text-muted-foreground" />
          </div>
          <p className="text-2xl font-semibold">{stats.total}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground font-medium">Open</span>
            <DoorOpen size={15} className="text-emerald-500" />
          </div>
          <p className="text-2xl font-semibold text-emerald-600">{stats.open}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground font-medium">Closed</span>
            <DoorClosed size={15} className="text-slate-400" />
          </div>
          <p className="text-2xl font-semibold text-slate-500">{stats.closed}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground font-medium">Total Capacity</span>
            <Users size={15} className="text-muted-foreground" />
          </div>
          <p className="text-2xl font-semibold">
            {stats.totalEnrolled}
            <span className="text-sm text-muted-foreground font-normal"> / {stats.totalCapacity}</span>
          </p>
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-lg border bg-card">
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search intakes..."
                className="pl-8 h-8 w-56 text-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32 h-8 text-sm">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={gradeFilter} onValueChange={setGradeFilter}>
              <SelectTrigger className="w-32 h-8 text-sm">
                <SelectValue placeholder="All Grades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Grades</SelectItem>
                {grades.map((g) => (
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
              if (open) {
                setEditingId(null);
                setForm({ ...INIT_FORM });
                setErrors({});
              }
              setDialogOpen(open);
            }}
          >
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus size={14} /> Add Intake
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Edit Intake" : "Add New Intake"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label>Intake Name *</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="e.g. Grade 1 Intake 2083"
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <SelectField
                    label="Academic Year *"
                    value={form.academicYear}
                    options={["", ...ACADEMIC_YEARS]}
                    onChange={(v) => handleChange("academicYear", v)}
                    error={errors.academicYear}
                  />
                  <SelectField
                    label="Grade *"
                    value={form.grade}
                    options={["", ...CLASSES_LIST]}
                    onChange={(v) => handleChange("grade", v)}
                    error={errors.grade}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Capacity</Label>
                  <Input
                    type="number"
                    min={1}
                    value={form.capacity || ""}
                    onChange={(e) => handleChange("capacity", Number(e.target.value))}
                    placeholder="e.g. 60"
                    className={errors.capacity ? "border-destructive" : ""}
                  />
                  {errors.capacity && <p className="text-xs text-destructive">{errors.capacity}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(v) => handleChange("status", v as "open" | "closed")}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  {editingId ? "Update Intake" : "Create Intake"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Academic Year</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Enrolled</TableHead>
              <TableHead>Occupancy</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((intake) => {
              const pct = intake.capacity > 0 ? Math.round((intake.enrolled / intake.capacity) * 100) : 0;
              return (
                <TableRow key={intake.id}>
                  <TableCell className="text-sm font-medium text-primary">
                    {intake.id}
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {intake.name}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {intake.academicYear}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {intake.grade}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {intake.capacity}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {intake.enrolled}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{pct}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={intake.status === "open" ? "default" : "secondary"}>
                      {intake.status === "open" ? "Open" : "Closed"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(intake)}>
                        <Edit2 size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(intake.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between px-3 py-2 border-t text-xs text-muted-foreground">
          <span>
            Showing {filtered.length} of {intakes.length} intakes
          </span>
        </div>
      </div>
    </div>
  );
}
