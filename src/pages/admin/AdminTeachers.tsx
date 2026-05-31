import { useState } from "react";
import { Search, Plus, Edit2, Trash2, Eye } from "lucide-react";
import { TEACHERS as DATA_TEACHERS, CLASS_GROUPS } from "../../data";
import { useNavigate } from "../../NavContext";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import NepaliDatePicker from "@/components/NepaliDatePicker";

interface TeacherEntry {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  subjectSpecialization: string;
  assignedClassIds: string[];
  joined: string;
  status: string;
  title?: string;
  gender?: string;
  dob?: string;
  bloodGroup?: string;
  nationality?: string;
  religion?: string;
  ethnicGroup?: string;
  motherTongue?: string;
  maritalStatus?: string;
  designation?: string;
  jobType?: string;
  subDesignation?: string;
  department?: string;
  subDepartment?: string;
  branch?: string;
  level?: string;
  hireDate?: string;
  salary?: string;
  paymentMethod?: string;
  highestQualification?: string;
  experienceYears?: string;
  citizenshipNumber?: string;
  panNumber?: string;
  permanentAddress?: string;
  temporaryAddress?: string;
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("");
}

const INIT_FORM = {
  name: "",
  email: "",
  phone: "",
  subjectSpecialization: "",
  assignedClassIds: [] as string[],
  joined: "",
  status: "Active" as string,
  title: "",
  gender: "",
  dob: "",
  bloodGroup: "",
  nationality: "",
  religion: "",
  ethnicGroup: "",
  motherTongue: "",
  maritalStatus: "",
  designation: "",
  jobType: "",
  subDesignation: "",
  department: "",
  subDepartment: "",
  branch: "",
  level: "",
  hireDate: "",
  salary: "",
  paymentMethod: "",
  highestQualification: "",
  experienceYears: "",
  citizenshipNumber: "",
  panNumber: "",
  permanentAddress: "",
  temporaryAddress: "",
};

type FormState = typeof INIT_FORM;

export default function AdminTeachers() {
  const { navigate } = useNavigate();
  const [teachers, setTeachers] = useState<TeacherEntry[]>([...DATA_TEACHERS]);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({ ...INIT_FORM, assignedClassIds: [] });
  const [statusFilter, setStatusFilter] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");

  const filtered = teachers.filter(
    (t) =>
      (t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.id.toLowerCase().includes(search.toLowerCase()) ||
        t.subjectSpecialization.toLowerCase().includes(search.toLowerCase())) &&
      (!statusFilter || t.status === statusFilter) &&
      (!classFilter ||
        t.assignedClassIds.some((id) => CLASS_GROUPS.find((c) => c.id === id)?.name === classFilter)) &&
      (!subjectFilter || t.subjectSpecialization === subjectFilter)
  );

  const ALL_SUBJECTS = Array.from(new Set(teachers.map((t) => t.subjectSpecialization)));

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleClass(classId: string) {
    setForm((prev) => ({
      ...prev,
      assignedClassIds: prev.assignedClassIds.includes(classId)
        ? prev.assignedClassIds.filter((id) => id !== classId)
        : [...prev.assignedClassIds, classId],
    }));
  }

  function openNew() {
    setEditingId(null);
    setForm({ ...INIT_FORM, assignedClassIds: [] });
    setDialogOpen(true);
  }

  function handleEdit(teacher: TeacherEntry) {
    setForm({
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone,
      subjectSpecialization: teacher.subjectSpecialization,
      assignedClassIds: [...teacher.assignedClassIds],
      joined: teacher.joined,
      status: teacher.status,
      title: teacher.title || "",
      gender: teacher.gender || "",
      dob: teacher.dob || "",
      bloodGroup: teacher.bloodGroup || "",
      nationality: teacher.nationality || "",
      religion: teacher.religion || "",
      ethnicGroup: teacher.ethnicGroup || "",
      motherTongue: teacher.motherTongue || "",
      maritalStatus: teacher.maritalStatus || "",
      designation: teacher.designation || "",
      jobType: teacher.jobType || "",
      subDesignation: teacher.subDesignation || "",
      department: teacher.department || "",
      subDepartment: teacher.subDepartment || "",
      branch: teacher.branch || "",
      level: teacher.level || "",
      hireDate: teacher.hireDate || "",
      salary: teacher.salary || "",
      paymentMethod: teacher.paymentMethod || "",
      highestQualification: teacher.highestQualification || "",
      experienceYears: teacher.experienceYears || "",
      citizenshipNumber: teacher.citizenshipNumber || "",
      panNumber: teacher.panNumber || "",
      permanentAddress: teacher.permanentAddress || "",
      temporaryAddress: teacher.temporaryAddress || "",
    });
    setEditingId(teacher.id);
    setDialogOpen(true);
  }

  function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this teacher?")) {
      setTeachers((prev) => prev.filter((t) => t.id !== id));
    }
  }

  function handleSubmit() {
    if (!form.name || !form.subjectSpecialization) return;
    if (editingId) {
      setTeachers((prev) =>
        prev.map((t) => (t.id === editingId ? { ...t, ...form } : t))
      );
    } else {
      const newId = `T${String(teachers.length + 1).padStart(3, "0")}`;
      setTeachers((prev) => [{ id: newId, userId: "", ...form }, ...prev]);
    }
    setEditingId(null);
    setDialogOpen(false);
  }

  return (
    <div>
      <Header title="Teachers" />

      <div className="rounded-lg border bg-card">
        <div className="flex items-center justify-between p-3 border-b">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search teachers..."
              className="pl-8 h-8 w-64 text-sm"
            />
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={openNew}>
                <Plus size={14} /> Add New
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] h-full p-0 flex flex-col overflow-hidden">
              <DialogHeader className="px-6 pt-6 pb-0 shrink-0">
                <DialogTitle>{editingId ? "Edit Teacher" : "Add New Teacher"}</DialogTitle>
              </DialogHeader>
              <div className="flex-1 min-h-0 px-6 py-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                {/* Personal Details */}
                <div className="col-span-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Personal Details
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={form.title} onChange={(e) => handleChange("title", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Input value={form.gender} onChange={(e) => handleChange("gender", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Date of Birth</Label>
                  <NepaliDatePicker
                    value={form.dob}
                    onChange={(v) => handleChange("dob", v)}
                    placeholder="Select date of birth"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Blood Group</Label>
                  <Input value={form.bloodGroup} onChange={(e) => handleChange("bloodGroup", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Nationality</Label>
                  <Input value={form.nationality} onChange={(e) => handleChange("nationality", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Religion</Label>
                  <Input value={form.religion} onChange={(e) => handleChange("religion", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Ethnic Group</Label>
                  <Input value={form.ethnicGroup} onChange={(e) => handleChange("ethnicGroup", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Mother Tongue</Label>
                  <Input value={form.motherTongue} onChange={(e) => handleChange("motherTongue", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Marital Status</Label>
                  <Input value={form.maritalStatus} onChange={(e) => handleChange("maritalStatus", e.target.value)} />
                </div>

                {/* Professional Information */}
                <div className="col-span-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-3">
                  Professional Information
                </div>
                <div className="space-y-2">
                  <Label>Designation</Label>
                  <Input value={form.designation} onChange={(e) => handleChange("designation", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Job Type</Label>
                  <Input value={form.jobType} onChange={(e) => handleChange("jobType", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Sub-Designation</Label>
                  <Input value={form.subDesignation} onChange={(e) => handleChange("subDesignation", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Input value={form.department} onChange={(e) => handleChange("department", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Sub-Department</Label>
                  <Input value={form.subDepartment} onChange={(e) => handleChange("subDepartment", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Branch</Label>
                  <Input value={form.branch} onChange={(e) => handleChange("branch", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Level</Label>
                  <Input value={form.level} onChange={(e) => handleChange("level", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Subject Specialization *</Label>
                  <Input value={form.subjectSpecialization} onChange={(e) => handleChange("subjectSpecialization", e.target.value)} />
                </div>

                {/* Employment Status */}
                <div className="col-span-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-3">
                  Employment Status
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(v) => handleChange("status", v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Hire Date</Label>
                  <NepaliDatePicker
                    value={form.hireDate}
                    onChange={(v) => handleChange("hireDate", v)}
                    placeholder="Select hire date"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Salary</Label>
                  <Input value={form.salary} onChange={(e) => handleChange("salary", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <Input value={form.paymentMethod} onChange={(e) => handleChange("paymentMethod", e.target.value)} />
                </div>

                {/* Qualifications */}
                <div className="col-span-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-3">
                  Qualifications
                </div>
                <div className="space-y-2">
                  <Label>Highest Qualification</Label>
                  <Input value={form.highestQualification} onChange={(e) => handleChange("highestQualification", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Experience (Years)</Label>
                  <Input value={form.experienceYears} onChange={(e) => handleChange("experienceYears", e.target.value)} />
                </div>

                {/* Official ID */}
                <div className="col-span-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-3">
                  Official Identification
                </div>
                <div className="space-y-2">
                  <Label>Citizenship Number</Label>
                  <Input value={form.citizenshipNumber} onChange={(e) => handleChange("citizenshipNumber", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>PAN Number</Label>
                  <Input value={form.panNumber} onChange={(e) => handleChange("panNumber", e.target.value)} />
                </div>

                {/* Address */}
                <div className="col-span-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-3">
                  Address Information
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Permanent Address</Label>
                  <textarea
                    value={form.permanentAddress}
                    onChange={(e) => handleChange("permanentAddress", e.target.value)}
                    rows={2}
                    className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Temporary Address</Label>
                  <textarea
                    value={form.temporaryAddress}
                    onChange={(e) => handleChange("temporaryAddress", e.target.value)}
                    rows={2}
                    className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>

                {/* Assigned Classes */}
                <div className="col-span-2 mt-3">
                  <Label>Assigned Classes</Label>
                  <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto p-3 border border-input rounded-md mt-2">
                    {CLASS_GROUPS.map((cg) => (
                      <label
                        key={cg.id}
                        className="flex items-center gap-2 text-sm cursor-pointer hover:text-foreground"
                      >
                        <input
                          type="checkbox"
                          checked={form.assignedClassIds.includes(cg.id)}
                          onChange={() => toggleClass(cg.id)}
                          className="accent-primary"
                        />
                        {cg.name} ({cg.section})
                      </label>
                    ))}
                  </div>
                  </div>
                </div>
              </div>
              <DialogFooter className="px-6 pb-6 shrink-0">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  {editingId ? "Update Teacher" : "Add Teacher"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="p-3 border-b flex gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 h-8 text-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="w-36 h-8 text-sm">
              <SelectValue placeholder="Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {Array.from(new Set(CLASS_GROUPS.map((c) => c.name))).map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="w-36 h-8 text-sm">
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {ALL_SUBJECTS.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Specialization</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="text-sm font-medium text-primary">
                  {t.id}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="text-xs">
                        {getInitials(t.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{t.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {t.email}
                </TableCell>
                <TableCell>
                  <button onClick={() => navigate("subjects")} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {t.subjectSpecialization}
                  </button>
                </TableCell>
                <TableCell>
                  <Badge variant={t.status === "Active" ? "default" : "secondary"}>
                    {t.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => navigate("class-groups")} title="View classes">
                      <Eye size={14} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(t)}>
                      <Edit2 size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(t.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="px-3 py-2 border-t text-xs text-muted-foreground">
          {filtered.length} teacher{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
}
