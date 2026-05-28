import { useState } from "react";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";
import { useStore } from "../../StoreContext";
import {
  CLASS_GROUPS,
  CLASSES_LIST,
  SECTIONS,
  BATCHES,
} from "../../data";
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

const TITLES = ["Mr.", "Mrs.", "Ms.", "Dr."];
const GENDERS = ["Male", "Female", "Other"];
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const RELIGIONS = ["Hindu", "Buddhist", "Muslim", "Christian", "Other"];
const ETHNIC_GROUPS = [
  "Brahmin", "Chhetri", "Newar", "Magar", "Tharu", "Tamang",
  "Rai", "Limbu", "Gurung", "Sherpa", "Other",
];
const GUARDIAN_RELATIONS = ["Father", "Mother", "Guardian", "Other"];
const FEE_OPTIONS = ["Paid", "Due", "Partial"];
const STATUS_OPTIONS = ["Active", "Inactive"];

const getClassName = (id: string) =>
  CLASS_GROUPS.find((c) => c.id === id)?.name || id;

interface StudentEntry {
  id: string;
  name: string;
  class: string;
  section: string;
  batch: string;
  phone: string;
  fee: string;
  status: string;
  formData?: Record<string, string>;
}

interface FormState {
  class: string;
  batch: string;
  section: string;
  rollNumber: string;
  admissionDate: string;
  title: string;
  fullName: string;
  gender: string;
  dob: string;
  bloodGroup: string;
  nationality: string;
  religion: string;
  motherTongue: string;
  ethnicGroup: string;
  phone: string;
  email: string;
  permanentAddress: string;
  temporaryAddress: string;
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  motherOccupation: string;
  guardianName: string;
  guardianContact: string;
  guardianRelation: string;
  parentEmail: string;
  previousSchool: string;
  fee: string;
  status: string;
}

const INIT_FORM: FormState = {
  class: "",
  batch: "",
  section: "",
  rollNumber: "",
  admissionDate: "",
  title: "",
  fullName: "",
  gender: "",
  dob: "",
  bloodGroup: "",
  nationality: "",
  religion: "",
  motherTongue: "",
  ethnicGroup: "",
  phone: "",
  email: "",
  permanentAddress: "",
  temporaryAddress: "",
  fatherName: "",
  fatherOccupation: "",
  motherName: "",
  motherOccupation: "",
  guardianName: "",
  guardianContact: "",
  guardianRelation: "",
  parentEmail: "",
  previousSchool: "",
  fee: "Due",
  status: "Active",
};

const REQUIRED_FIELDS: Record<string, string> = {
  class: "Class is required",
  batch: "Batch is required",
  title: "Title is required",
  fullName: "Full Name is required",
  gender: "Gender is required",
  dob: "Date of Birth is required",
};

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("");
}

const SECTIONS_SELECT = ["", ...SECTIONS];

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

function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={error ? "border-destructive" : ""}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export default function AdminStudents() {
  const { students: storeStudents, setStudents: setStoreStudents } = useStore();
  const [displayStudents, setDisplayStudents] = useState<StudentEntry[]>(
    storeStudents.map((s) => ({
      id: s.id,
      name: s.name,
      class: getClassName(s.classId),
      section: s.section,
      batch: s.batch,
      phone: s.phone,
      fee: s.fee,
      status: s.status,
    }))
  );
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({ ...INIT_FORM });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filtered = displayStudents.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.class.toLowerCase().includes(search.toLowerCase());
    const matchClass = !classFilter || s.class === classFilter;
    const matchSection = !sectionFilter || s.section === sectionFilter;
    return matchSearch && matchClass && matchSection;
  });

  function handleChange(field: string, value: string) {
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
    if (!form.fatherName && !form.motherName) {
      newErrors.fatherName = "At least one parent name required";
      newErrors.motherName = "At least one parent name required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;

    const entry = {
      class: form.class,
      section: form.section || "Section A",
      batch: form.batch,
      phone: form.phone || "98XXXXXXXX",
      fee: form.fee,
      status: form.status,
      formData: { ...form },
    };

    if (editingId) {
      setDisplayStudents((prev) =>
        prev.map((s) =>
          s.id === editingId ? { ...s, ...entry, name: form.fullName } : s
        )
      );
    } else {
      const newId = `STU-${String(displayStudents.length + 600).padStart(3, "0")}`;
      const displayEntry: StudentEntry = { id: newId, name: form.fullName, ...entry };
      setDisplayStudents((prev) => [displayEntry, ...prev]);
      const classGroup = CLASS_GROUPS.find((c) => c.name === form.class);
      setStoreStudents((prev) => [{
        id: newId,
        name: form.fullName,
        classId: classGroup?.id || "",
        section: form.section || "Section A",
        rollNumber: form.rollNumber,
        batch: form.batch,
        phone: form.phone || "98XXXXXXXX",
        email: form.email || "",
        fee: form.fee as "Paid" | "Due" | "Partial",
        status: form.status as "Active" | "Inactive",
        dob: form.dob,
        gender: form.gender,
        bloodGroup: form.bloodGroup,
        nationality: form.nationality,
        religion: form.religion,
        motherTongue: form.motherTongue,
        ethnicGroup: form.ethnicGroup,
        permanentAddress: form.permanentAddress,
        temporaryAddress: form.temporaryAddress,
        fatherName: form.fatherName,
        fatherOccupation: form.fatherOccupation,
        motherName: form.motherName,
        motherOccupation: form.motherOccupation,
        guardianName: form.guardianName,
        guardianContact: form.guardianContact,
        guardianRelation: form.guardianRelation,
        parentEmail: form.parentEmail,
        previousSchool: form.previousSchool,
        admissionDate: form.admissionDate,
        schoolId: "SCH001",
      }, ...prev]);
    }

    setEditingId(null);
    setDialogOpen(false);
  }

  function handleEdit(student: StudentEntry) {
    if (student.formData) {
      setForm(student.formData as unknown as FormState);
    } else {
      setForm({
        ...INIT_FORM,
        class: student.class,
        batch: student.batch,
        section: student.section,
        fullName: student.name,
        phone: student.phone,
        fee: student.fee,
        status: student.status,
      });
    }
    setEditingId(student.id);
    setErrors({});
    setDialogOpen(true);
  }

  function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this student?")) {
      setDisplayStudents((prev) => prev.filter((s) => s.id !== id));
      setStoreStudents((prev) => prev.filter((s) => s.id !== id));
    }
  }

  return (
    <div>
      <Header title="Students" />

      <div className="rounded-lg border bg-card">
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, ID or class..."
                className="pl-8 h-8 w-64 text-sm"
              />
            </div>
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="w-36 h-8 text-sm">
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Classes</SelectItem>
                {CLASSES_LIST.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sectionFilter} onValueChange={setSectionFilter}>
              <SelectTrigger className="w-36 h-8 text-sm">
                <SelectValue placeholder="All Sections" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Sections</SelectItem>
                {SECTIONS.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
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
                <Plus size={14} /> Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] p-0 flex flex-col">
              <DialogHeader className="px-6 pt-6 pb-0 shrink-0">
                <DialogTitle>
                  {editingId ? "Edit Student" : "Add New Student"}
                </DialogTitle>
              </DialogHeader>
              <ScrollArea className="flex-1 min-h-0 px-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Academic Information */}
                <div className="col-span-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Academic Information
                </div>
                <SelectField
                  label="Class *"
                  value={form.class}
                  options={["", ...CLASSES_LIST]}
                  onChange={(v) => handleChange("class", v)}
                  error={errors.class}
                />
                <SelectField
                  label="Batch *"
                  value={form.batch}
                  options={["", ...BATCHES]}
                  onChange={(v) => handleChange("batch", v)}
                  error={errors.batch}
                />
                <SelectField
                  label="Section"
                  value={form.section}
                  options={SECTIONS_SELECT}
                  onChange={(v) => handleChange("section", v)}
                />
                <div className="space-y-2">
                  <Label>Admission Date</Label>
                  <NepaliDatePicker
                    value={form.admissionDate}
                    onChange={(v) => handleChange("admissionDate", v)}
                    placeholder="Select admission date"
                  />
                </div>

                {/* Personal Information */}
                <div className="col-span-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-3">
                  Personal Information
                </div>
                <SelectField
                  label="Title *"
                  value={form.title}
                  options={["", ...TITLES]}
                  onChange={(v) => handleChange("title", v)}
                  error={errors.title}
                />
                <div className="col-span-2">
                  <InputField
                    label="Full Name *"
                    value={form.fullName}
                    onChange={(v) => handleChange("fullName", v)}
                    placeholder="Enter full name"
                    error={errors.fullName}
                  />
                </div>
                <SelectField
                  label="Gender *"
                  value={form.gender}
                  options={["", ...GENDERS]}
                  onChange={(v) => handleChange("gender", v)}
                  error={errors.gender}
                />
                <div className="space-y-2">
                  <Label>Date of Birth *</Label>
                  <NepaliDatePicker
                    value={form.dob}
                    onChange={(v) => handleChange("dob", v)}
                    placeholder="Select date of birth"
                  />
                  {errors.dob && <p className="text-xs text-destructive">{errors.dob}</p>}
                </div>
                <SelectField
                  label="Blood Group"
                  value={form.bloodGroup}
                  options={["", ...BLOOD_GROUPS]}
                  onChange={(v) => handleChange("bloodGroup", v)}
                />
                <InputField
                  label="Nationality"
                  value={form.nationality}
                  onChange={(v) => handleChange("nationality", v)}
                  placeholder="Enter nationality"
                />
                <SelectField
                  label="Religion"
                  value={form.religion}
                  options={["", ...RELIGIONS]}
                  onChange={(v) => handleChange("religion", v)}
                />
                <InputField
                  label="Mother Tongue"
                  value={form.motherTongue}
                  onChange={(v) => handleChange("motherTongue", v)}
                  placeholder="Enter mother tongue"
                />
                <SelectField
                  label="Ethnic Group"
                  value={form.ethnicGroup}
                  options={["", ...ETHNIC_GROUPS]}
                  onChange={(v) => handleChange("ethnicGroup", v)}
                />
                <InputField
                  label="Phone"
                  value={form.phone}
                  onChange={(v) => handleChange("phone", v)}
                  placeholder="98XXXXXXXX"
                />
                <InputField
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(v) => handleChange("email", v)}
                  placeholder="student@email.com"
                />

                {/* Parent / Guardian Information */}
                <div className="col-span-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-3">
                  Parent / Guardian Information
                </div>
                <InputField
                  label="Father's Name"
                  value={form.fatherName}
                  onChange={(v) => handleChange("fatherName", v)}
                  placeholder="Enter father's name"
                  error={errors.fatherName}
                />
                <InputField
                  label="Father's Occupation"
                  value={form.fatherOccupation}
                  onChange={(v) => handleChange("fatherOccupation", v)}
                  placeholder="Enter occupation"
                />
                <InputField
                  label="Mother's Name"
                  value={form.motherName}
                  onChange={(v) => handleChange("motherName", v)}
                  placeholder="Enter mother's name"
                  error={errors.motherName}
                />
                <InputField
                  label="Mother's Occupation"
                  value={form.motherOccupation}
                  onChange={(v) => handleChange("motherOccupation", v)}
                  placeholder="Enter occupation"
                />
                <div className="col-span-2">
                  <InputField
                    label="Guardian's Name"
                    value={form.guardianName}
                    onChange={(v) => handleChange("guardianName", v)}
                    placeholder="Enter guardian's name"
                  />
                </div>
                <InputField
                  label="Guardian Contact"
                  value={form.guardianContact}
                  onChange={(v) => handleChange("guardianContact", v)}
                  placeholder="98XXXXXXXX"
                />
                <SelectField
                  label="Guardian Relation"
                  value={form.guardianRelation}
                  options={["", ...GUARDIAN_RELATIONS]}
                  onChange={(v) => handleChange("guardianRelation", v)}
                />
                <InputField
                  label="Parent Email"
                  type="email"
                  value={form.parentEmail}
                  onChange={(v) => handleChange("parentEmail", v)}
                  placeholder="parent@email.com"
                />

                {/* Address */}
                <div className="col-span-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-3">
                  Address
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Permanent Address</Label>
                  <textarea
                    value={form.permanentAddress}
                    onChange={(e) => handleChange("permanentAddress", e.target.value)}
                    rows={2}
                    placeholder="Enter permanent address"
                    className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Temporary Address</Label>
                  <textarea
                    value={form.temporaryAddress}
                    onChange={(e) => handleChange("temporaryAddress", e.target.value)}
                    rows={2}
                    placeholder="Enter temporary address (if different)"
                    className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>

                {/* Status & Fee */}
                <div className="col-span-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-3">
                  Status & Fee
                </div>
                <SelectField
                  label="Fee Status"
                  value={form.fee}
                  options={FEE_OPTIONS}
                  onChange={(v) => handleChange("fee", v)}
                />
                <SelectField
                  label="Student Status"
                  value={form.status}
                  options={STATUS_OPTIONS}
                  onChange={(v) => handleChange("status", v)}
                />

                {/* Previous School */}
                <div className="col-span-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-3">
                  Previous School
                </div>
                <div className="col-span-2">
                  <InputField
                    label="Previous School Attended"
                    value={form.previousSchool}
                    onChange={(v) => handleChange("previousSchool", v)}
                    placeholder="Enter previous school name"
                  />
                </div>
              </div>
              </ScrollArea>
              <DialogFooter className="px-6 pb-6 shrink-0">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  {editingId ? "Update Student" : "Enroll Student"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <input type="checkbox" className="accent-primary" />
              </TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead>Fee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((s) => (
              <TableRow key={s.id}>
                <TableCell>
                  <input type="checkbox" className="accent-primary" />
                </TableCell>
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
                  {s.class}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {s.section}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {s.batch}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      s.fee === "Paid"
                        ? "default"
                        : s.fee === "Partial"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {s.fee}
                  </Badge>
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
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(s)}>
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

        <div className="flex items-center justify-between px-3 py-2 border-t text-xs text-muted-foreground">
          <span>
            Showing {filtered.length} of {displayStudents.length} students
          </span>
          <div className="flex gap-1">
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                className={`w-7 h-7 rounded text-xs ${
                  p === 1
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent text-muted-foreground"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
