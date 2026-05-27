import { useState } from "react";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";
import type { StaffRole } from "../../types";
import { STAFF as DATA_STAFF } from "../../data";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import NepaliDatePicker from "@/components/NepaliDatePicker";

interface StaffEntry {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  joined: string;
  status: string;
  employeeCode?: string;
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
  subDepartment?: string;
  branch?: string;
  level?: string;
  hireDate?: string;
  salary?: string;
  paymentMethod?: string;
  highestQualification?: string;
  experienceYears?: string;
  specialization?: string;
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
  role: "" as StaffRole | "",
  department: "",
  joined: "",
  status: "Active" as string,
  employeeCode: "",
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
  subDepartment: "",
  branch: "",
  level: "",
  hireDate: "",
  salary: "",
  paymentMethod: "",
  highestQualification: "",
  experienceYears: "",
  specialization: "",
  citizenshipNumber: "",
  panNumber: "",
  permanentAddress: "",
  temporaryAddress: "",
};

type FormState = typeof INIT_FORM;

export default function AdminStaff() {
  const [staff, setStaff] = useState<StaffEntry[]>([...DATA_STAFF]);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({ ...INIT_FORM });

  const filtered = staff.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.role.toLowerCase().includes(search.toLowerCase()) ||
      s.department.toLowerCase().includes(search.toLowerCase())
  );

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleEdit(member: StaffEntry) {
    setForm({
      name: member.name,
      email: member.email,
      phone: member.phone,
      role: member.role as StaffRole,
      department: member.department || "",
      joined: member.joined,
      status: member.status,
      employeeCode: member.employeeCode || "",
      title: member.title || "",
      gender: member.gender || "",
      dob: member.dob || "",
      bloodGroup: member.bloodGroup || "",
      nationality: member.nationality || "",
      religion: member.religion || "",
      ethnicGroup: member.ethnicGroup || "",
      motherTongue: member.motherTongue || "",
      maritalStatus: member.maritalStatus || "",
      designation: member.designation || "",
      jobType: member.jobType || "",
      subDesignation: member.subDesignation || "",
      subDepartment: member.subDepartment || "",
      branch: member.branch || "",
      level: member.level || "",
      hireDate: member.hireDate || "",
      salary: member.salary || "",
      paymentMethod: member.paymentMethod || "",
      highestQualification: member.highestQualification || "",
      experienceYears: member.experienceYears || "",
      specialization: member.specialization || "",
      citizenshipNumber: member.citizenshipNumber || "",
      panNumber: member.panNumber || "",
      permanentAddress: member.permanentAddress || "",
      temporaryAddress: member.temporaryAddress || "",
    });
    setEditingId(member.id);
    setDialogOpen(true);
  }

  function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this staff member?")) {
      setStaff((prev) => prev.filter((s) => s.id !== id));
    }
  }

  function handleSubmit() {
    if (!form.name || !form.role) return;
    if (editingId) {
      setStaff((prev) =>
        prev.map((s) => (s.id === editingId ? { ...s, ...form } : s))
      );
    } else {
      const newId = `S${String(staff.length + 1).padStart(3, "0")}`;
      setStaff((prev) => [{ id: newId, userId: "", ...form }, ...prev]);
    }
    setEditingId(null);
    setDialogOpen(false);
  }

  return (
    <div>
      <Header title="Staffs" />

      <div className="rounded-lg border bg-card">
        <div className="flex items-center justify-between p-3 border-b">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search staffs..."
              className="pl-8 h-8 w-64 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus size={14} /> Add New
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl max-h-[90vh] p-0 flex flex-col">
                <DialogHeader className="px-6 pt-6 pb-0 shrink-0">
                  <DialogTitle>
                    {editingId ? "Edit Staff" : "Add New Staff"}
                  </DialogTitle>
                </DialogHeader>
                <ScrollArea className="flex-1 px-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Section: Personal Details */}
                  <div className="col-span-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Personal Details
                  </div>
                  <div className="space-y-2">
                    <Label>Employee Code</Label>
                    <Input value={form.employeeCode} onChange={(e) => handleChange("employeeCode", e.target.value)} />
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

                  {/* Section: Professional Information */}
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

                  {/* Section: Employment Status */}
                  <div className="col-span-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-3">
                    Employment Status
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={form.status}
                      onValueChange={(v) => handleChange("status", v)}
                    >
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

                  {/* Section: Qualifications */}
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
                  <div className="space-y-2">
                    <Label>Specialization</Label>
                    <Input value={form.specialization} onChange={(e) => handleChange("specialization", e.target.value)} />
                  </div>

                  {/* Section: Official ID */}
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

                  {/* Section: Address */}
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
                </div>
                </ScrollArea>
                <DialogFooter className="px-6 pb-6 shrink-0">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit}>
                    {editingId ? "Update Staff" : "Add Staff"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="text-sm font-medium text-primary">
                  {s.id}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="text-xs">
                        {getInitials(s.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{s.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {s.email}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={s.status === "Active" ? "default" : "secondary"}
                  >
                    {s.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(s)}
                    >
                      <Edit2 size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(s.id)}
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
          {filtered.length} staff{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
}
