import { useState } from "react";
import { Plus, Search, Edit2, Trash2, Eye } from "lucide-react";
import NepaliDatePicker from "../../components/NepaliDatePicker";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "../../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import { useNavigate } from "../../NavContext";
import Header from "../../layouts/Header";

type ExamType = "Theory" | "Practical" | "Internal" | "Viva" | "Project" | "Written" | "Oral" | "Mcq" | "Assignment" | "Quiz" | "Terminal" | "Final" | "Midterm" | "Semester";
type ExamStatus = "Draft" | "Published" | "Ongoing" | "Completed" | "Cancelled";

interface Exam {
  id: string;
  name: string;
  type: ExamType;
  year: string;
  status: ExamStatus;
  startDate: string;
  endDate: string;
  description: string;
}

const SEED_EXAMS: Exam[] = [
  { id: "EXAM-001", name: "First Terminal Exam 2083", type: "Terminal", year: "2083", status: "Published", startDate: "2083-04-01", endDate: "2083-04-10", description: "First terminal examination for all classes" },
  { id: "EXAM-002", name: "Second Terminal Exam 2083", type: "Terminal", year: "2083", status: "Draft", startDate: "2083-07-15", endDate: "2083-07-25", description: "Second terminal examination" },
  { id: "EXAM-003", name: "Midterm Assessment", type: "Midterm", year: "2083", status: "Ongoing", startDate: "2083-05-20", endDate: "2083-05-25", description: "Midterm assessment for Grade 10" },
  { id: "EXAM-004", name: "Final Board Exam 2083", type: "Final", year: "2083", status: "Draft", startDate: "2083-10-01", endDate: "2083-10-15", description: "Annual final board examination" },
  { id: "EXAM-005", name: "Science Practical", type: "Practical", year: "2083", status: "Completed", startDate: "2083-03-10", endDate: "2083-03-12", description: "Science practical examination" },
];

export default function AdminExams() {
  const { navigate } = useNavigate();
  const [exams, setExams] = useState<Exam[]>(SEED_EXAMS);
  const [search, setSearch] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Exam | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Exam | null>(null);

  const emptyForm = { name: "", type: "Theory" as ExamType, year: "", status: "Draft" as ExamStatus, startDate: "", endDate: "", description: "" };
  const [form, setForm] = useState(emptyForm);

  const filtered = exams.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.type.toLowerCase().includes(search.toLowerCase())
  );

  function resetForm() { setForm(emptyForm); }

  function handleCreate() {
    if (!form.name) return;
    const exam: Exam = { ...form, id: `EXAM-${Math.floor(Math.random() * 1000)}` };
    setExams([...exams, exam]);
    setCreateOpen(false);
    resetForm();
  }

  function handleEdit() {
    if (!editTarget || !form.name) return;
    setExams((prev) => prev.map((e) => e.id === editTarget.id ? { ...e, ...form } : e));
    setEditTarget(null);
    resetForm();
  }

  function handleDelete() {
    if (!deleteTarget) return;
    setExams((prev) => prev.filter((e) => e.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  function openEdit(exam: Exam) {
    setEditTarget(exam);
    setForm({ name: exam.name, type: exam.type, year: exam.year, status: exam.status, startDate: exam.startDate, endDate: exam.endDate, description: exam.description });
  }

  const statusBadge = (s: ExamStatus) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = { Published: "default", Ongoing: "default", Completed: "secondary", Draft: "secondary", Cancelled: "destructive" };
    return <Badge variant={variants[s] || "secondary"}>{s}</Badge>;
  };

  return (
    <div>
      <Header title="Exams" subtitle="Create and manage exams" />

      <div className="rounded-lg border bg-card">
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center gap-2">
            <Search size={14} className="text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search exams..." className="pl-8 h-8 w-64 text-sm" />
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus size={14} className="mr-2" /> Add Exam</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader><DialogTitle>Add New Exam</DialogTitle></DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Name *</Label>
                  <Input placeholder="e.g. First Terminal Exam" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Type *</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as ExamType })}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      {["Theory", "Practical", "Internal", "Viva", "Project", "Written", "Oral", "Mcq", "Assignment", "Quiz", "Terminal", "Final", "Midterm", "Semester"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Year</Label>
                  <Input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as ExamStatus })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Draft", "Published", "Ongoing", "Completed", "Cancelled"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <NepaliDatePicker value={form.startDate} onChange={(d) => setForm({ ...form, startDate: d })} placeholder="Select start date" />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <NepaliDatePicker value={form.endDate} onChange={(d) => setForm({ ...form, endDate: d })} placeholder="Select end date" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Add description..." rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => { setCreateOpen(false); resetForm(); }}>Cancel</Button>
                <Button onClick={handleCreate}>Add Exam</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">No data found</TableCell>
              </TableRow>
            ) : (
              filtered.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell className="font-medium text-primary">{exam.id}</TableCell>
                  <TableCell>{exam.name}</TableCell>
                  <TableCell>{exam.type}</TableCell>
                  <TableCell>{exam.year}</TableCell>
                  <TableCell>{statusBadge(exam.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => navigate("results")} title="View results"><Eye size={14} /></Button>
                    <Button variant="ghost" size="icon" onClick={() => openEdit(exam)}><Edit2 size={14} /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setDeleteTarget(exam)}><Trash2 size={14} /></Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editTarget} onOpenChange={(o) => { if (!o) { setEditTarget(null); resetForm(); } }}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader><DialogTitle>Edit Exam</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as ExamType })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Theory", "Practical", "Internal", "Viva", "Project", "Written", "Oral", "Mcq", "Assignment", "Quiz", "Terminal", "Final", "Midterm", "Semester"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Year</Label>
              <Input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as ExamStatus })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Draft", "Published", "Ongoing", "Completed", "Cancelled"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Start Date</Label>
              <NepaliDatePicker value={form.startDate} onChange={(d) => setForm({ ...form, startDate: d })} />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <NepaliDatePicker value={form.endDate} onChange={(d) => setForm({ ...form, endDate: d })} />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Description</Label>
              <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditTarget(null); resetForm(); }}>Cancel</Button>
            <Button onClick={handleEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}>
        <DialogContent className="sm:max-w-xs">
          <DialogHeader><DialogTitle>Delete Exam</DialogTitle></DialogHeader>
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
