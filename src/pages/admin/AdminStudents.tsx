import { useState } from "react";
import { Search, Plus, Edit2, Trash2, X } from "lucide-react";
import { STUDENTS as DATA_STUDENTS, CLASS_GROUPS, CLASSES_LIST, SECTIONS, BATCHES } from "../../data";
import Header from "../../layouts/Header";

const TITLES = ["Mr.", "Mrs.", "Ms.", "Dr."];
const GENDERS = ["Male", "Female", "Other"];
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const RELIGIONS = ["Hindu", "Buddhist", "Muslim", "Christian", "Other"];
const ETHNIC_GROUPS = ["Brahmin", "Chhetri", "Newar", "Magar", "Tharu", "Tamang", "Rai", "Limbu", "Gurung", "Sherpa", "Other"];
const GUARDIAN_RELATIONS = ["Father", "Mother", "Guardian", "Other"];
const FEE_OPTIONS = ["Paid", "Due", "Partial"];
const STATUS_OPTIONS = ["Active", "Inactive"];

const feeColor = (s: string) =>
  ({ Paid: "bg-emerald-50 text-emerald-700", Due: "bg-red-50 text-red-700", Partial: "bg-amber-50 text-amber-700" })[s] || "bg-gray-100 text-gray-600";

const statusColor = (s: string) =>
  s === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500";

const getClassName = (id: string) => CLASS_GROUPS.find((c) => c.id === id)?.name || id;

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
  class: "Select class", batch: "Select batch", section: "Select Section (Optional)", rollNumber: "", admissionDate: "",
  title: "Select title", fullName: "", gender: "Select gender", dob: "", bloodGroup: "Select blood group",
  nationality: "", religion: "Select religion", motherTongue: "", ethnicGroup: "Select ethnic group", phone: "", email: "",
  permanentAddress: "", temporaryAddress: "",
  fatherName: "", fatherOccupation: "", motherName: "", motherOccupation: "",
  guardianName: "", guardianContact: "", guardianRelation: "Select relation", parentEmail: "",
  previousSchool: "",
  fee: "Due", status: "Active",
};

const REQUIRED_FIELDS: Record<string, string> = {
  class: "Class is required",
  batch: "Batch is required",
  title: "Title is required",
  fullName: "Full Name is required",
  gender: "Gender is required",
  dob: "Date of Birth is required",
};

export default function AdminStudents() {
  const [students, setStudents] = useState<StudentEntry[]>(
    DATA_STUDENTS.map((s) => ({
      id: s.id,
      name: s.name,
      class: getClassName(s.classId),
      section: s.section,
      batch: s.batch,
      phone: s.phone,
      fee: s.fee,
      status: s.status,
    })),
  );
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(INIT_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filtered = students.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase()) || s.class.toLowerCase().includes(search.toLowerCase());
    const matchClass = !classFilter || s.class === classFilter;
    const matchSection = !sectionFilter || s.section === sectionFilter;
    return matchSearch && matchClass && matchSection;
  });

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  }

  function handleSubmit() {
    const newErrors: Record<string, string> = {};
    for (const [field, msg] of Object.entries(REQUIRED_FIELDS)) {
      const val = form[field as keyof FormState];
      if (!val || val.startsWith("Select ")) {
        newErrors[field] = msg;
      }
    }
    if (!form.fatherName && !form.motherName) {
      newErrors.fatherName = "At least one parent name is required";
      newErrors.motherName = "At least one parent name is required";
    }
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    const entry = {
      class: form.class,
      section: form.section === "Select Section (Optional)" ? "Section A" : form.section,
      batch: form.batch,
      phone: form.phone || "98XXXXXXXX",
      fee: form.fee,
      status: form.status,
      formData: { ...form },
    };

    if (editingId) {
      setStudents((prev) =>
        prev.map((s) => (s.id === editingId ? { ...s, ...entry, name: form.fullName } : s)),
      );
    } else {
      const newId = `STU-${String(students.length + 600).padStart(3, "0")}`;
      setStudents((prev) => [{ id: newId, name: form.fullName, ...entry }, ...prev]);
    }

    setEditingId(null);
    setShowForm(false);
    setForm(INIT_FORM);
    setErrors({});
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
    setShowForm(true);
  }

  function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this student?")) {
      setStudents((prev) => prev.filter((s) => s.id !== id));
    }
  }

  const formSections: { title: string; fields: { label: string; field: string; type: string; options?: string[]; placeholder?: string; col?: string }[] }[] = [
    {
      title: "Academic Information",
      fields: [
        { label: "Class*", field: "class", type: "select", options: ["Select class", ...CLASSES_LIST] },
        { label: "Batch*", field: "batch", type: "select", options: ["Select batch", ...BATCHES] },
        { label: "Section", field: "section", type: "select", options: ["Select Section (Optional)", ...SECTIONS] },
        { label: "Roll Number", field: "rollNumber", type: "text", placeholder: "e.g. 25" },
        { label: "Admission Date", field: "admissionDate", type: "date" },
      ],
    },
    {
      title: "Personal Information",
      fields: [
        { label: "Title*", field: "title", type: "select", options: ["Select title", ...TITLES] },
        { label: "Full Name*", field: "fullName", type: "text", placeholder: "Enter full name", col: "col-span-2" },
        { label: "Gender*", field: "gender", type: "select", options: ["Select gender", ...GENDERS] },
        { label: "Date of Birth*", field: "dob", type: "date" },
        { label: "Blood Group", field: "bloodGroup", type: "select", options: ["Select blood group", ...BLOOD_GROUPS] },
        { label: "Nationality", field: "nationality", type: "text", placeholder: "Enter nationality" },
        { label: "Religion", field: "religion", type: "select", options: ["Select religion", ...RELIGIONS] },
        { label: "Mother Tongue", field: "motherTongue", type: "text", placeholder: "Enter mother tongue" },
        { label: "Ethnic Group", field: "ethnicGroup", type: "select", options: ["Select ethnic group", ...ETHNIC_GROUPS] },
        { label: "Phone", field: "phone", type: "text", placeholder: "98XXXXXXXX" },
        { label: "Email", field: "email", type: "email", placeholder: "student@email.com" },
      ],
    },
    {
      title: "Parent / Guardian Information",
      fields: [
        { label: "Father's Name", field: "fatherName", type: "text", placeholder: "Enter father's name" },
        { label: "Father's Occupation", field: "fatherOccupation", type: "text", placeholder: "Enter occupation" },
        { label: "Mother's Name", field: "motherName", type: "text", placeholder: "Enter mother's name" },
        { label: "Mother's Occupation", field: "motherOccupation", type: "text", placeholder: "Enter occupation" },
        { label: "Guardian's Name", field: "guardianName", type: "text", placeholder: "Enter guardian's name", col: "col-span-2" },
        { label: "Guardian Contact", field: "guardianContact", type: "text", placeholder: "98XXXXXXXX" },
        { label: "Guardian Relation", field: "guardianRelation", type: "select", options: ["Select relation", ...GUARDIAN_RELATIONS] },
        { label: "Parent Email", field: "parentEmail", type: "email", placeholder: "parent@email.com" },
      ],
    },
  ];

  function renderField(fd: { label: string; field: string; type: string; options?: string[]; placeholder?: string; col?: string }) {
    const val = form[fd.field as keyof FormState];
    const err = errors[fd.field];
    const baseInput = "w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400";
    const inputClass = err ? `${baseInput} border-red-400` : `${baseInput} border-slate-200`;

    return (
      <div key={fd.label} className={fd.col || ""}>
        <label className="block text-xs font-medium text-slate-500 mb-1">{fd.label}</label>
        {fd.type === "select" ? (
          <select value={val} onChange={(e) => handleChange(fd.field, e.target.value)} className={`${inputClass} bg-white`}>
            {(fd.options || []).map((o: string) => <option key={o}>{o}</option>)}
          </select>
        ) : (
          <input type={fd.type} value={val} onChange={(e) => handleChange(fd.field, e.target.value)} placeholder={fd.placeholder} className={inputClass} />
        )}
        {err && <p className="text-xs text-red-500 mt-0.5">{err}</p>}
      </div>
    );
  }

  return (
    <div>
      <Header title="Students" />

      <div className="bg-white rounded-xl border border-slate-100">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, ID or class…" className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />
          </div>
          <button onClick={() => { setShowForm(true); setEditingId(null); setForm(INIT_FORM); setErrors({}); }} className="flex items-center gap-2 px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <Plus size={14} /> Add Student
          </button>
        </div>

        <div className="px-4 pb-4 flex gap-4">
          <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400">
            <option value="">All Classes</option>
            {CLASSES_LIST.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={sectionFilter} onChange={(e) => setSectionFilter(e.target.value)} className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400">
            <option value="">All Sections</option>
            {SECTIONS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-4 py-3 w-10"><input type="checkbox" /></th>
              {["ID", "Name", "Class", "Section", "Batch", "Fee", "Status", "Actions"].map((h) => (
                <th key={h} className="text-left text-xs font-medium text-slate-400 px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3"><input type="checkbox" /></td>
                <td className="px-4 py-3 text-xs font-mono text-indigo-600">{s.id}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-semibold text-indigo-700">
                      {s.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </div>
                    <span className="text-sm font-medium text-slate-700">{s.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">{s.class}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{s.section}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{s.batch}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${feeColor(s.fee)}`}>{s.fee}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(s.status)}`}>{s.status}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(s)} className="text-slate-400 hover:text-indigo-600"><Edit2 size={14} /></button>
                    <button onClick={() => handleDelete(s.id)} className="text-slate-400 hover:text-red-600"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 text-xs text-slate-400">
          <span>Showing {filtered.length} of {students.length} students</span>
          <div className="flex gap-1">
            {[1, 2, 3].map((p) => (
              <button key={p} className={`w-7 h-7 rounded text-xs ${p === 1 ? "bg-indigo-600 text-white" : "hover:bg-slate-100 text-slate-500"}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 flex-shrink-0">
              <h2 className="font-semibold text-slate-800">{editingId ? "Edit Student" : "Add New Student"}</h2>
              <button onClick={() => { setShowForm(false); setEditingId(null); setForm(INIT_FORM); setErrors({}); }} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <X size={16} className="text-slate-500" />
              </button>
            </div>
            <div className="p-5 grid grid-cols-2 gap-4 overflow-y-auto">
              {formSections.map((section) => (
                <div key={section.title} className="contents">
                  <div className="col-span-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{section.title}</div>
                  {section.fields.map(renderField)}
                </div>
              ))}

              <div className="col-span-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mt-3 mb-1">Address</div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-slate-500 mb-1">Permanent Address</label>
                <textarea value={form.permanentAddress} onChange={(e) => handleChange("permanentAddress", e.target.value)} rows={2} placeholder="Enter permanent address" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 resize-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-slate-500 mb-1">Temporary Address</label>
                <textarea value={form.temporaryAddress} onChange={(e) => handleChange("temporaryAddress", e.target.value)} rows={2} placeholder="Enter temporary address (if different)" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 resize-none" />
              </div>

              <div className="col-span-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mt-3 mb-1">Status & Fee</div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Fee Status</label>
                <select value={form.fee} onChange={(e) => handleChange("fee", e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 bg-white">
                  {FEE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Student Status</label>
                <select value={form.status} onChange={(e) => handleChange("status", e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 bg-white">
                  {STATUS_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>

              <div className="col-span-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mt-3 mb-1">Previous School</div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-slate-500 mb-1">Previous School Attended</label>
                <input value={form.previousSchool} onChange={(e) => handleChange("previousSchool", e.target.value)} type="text" placeholder="Enter previous school name" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />
              </div>
            </div>
            <div className="flex justify-end gap-2 px-5 pb-5 flex-shrink-0">
              <button onClick={() => { setShowForm(false); setEditingId(null); setForm(INIT_FORM); setErrors({}); }} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
              <button onClick={handleSubmit} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">{editingId ? "Update Student" : "Enroll Student"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
