import { useState } from "react";
import { Plus, Search, Phone, MessageSquare, UserX } from "lucide-react";
import { useStore } from "../../StoreContext";
import type { Inquiry, InquiryStatus } from "../../types";
import { useNavigate } from "../../NavContext";
import Header from "../../layouts/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const INIT_FORM = {
  inquirerName: "", inquirerEmail: "", inquirerMobile: "", inquirerPhone: "", relationship: "",
  candidateTitle: "", candidateName: "", candidateGender: "", candidateDob: "", candidateMobile: "", candidatePhone: "", candidateEmail: "", contactMethod: "",
  permanentAddress: "", temporaryAddress: "",
  inquiryType: "", description: "",
  outcome: "", assignedTo: "", outcomeDetails: "",
};

const STATUS_BADGE: Record<InquiryStatus, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
  new: { variant: "default", label: "New" },
  contacted: { variant: "secondary", label: "Contacted" },
  converted: { variant: "outline", label: "Converted" },
  lost: { variant: "destructive", label: "Lost" },
};

function InputField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm">{label}</Label>
      <Input value={value} onChange={onChange} placeholder={placeholder} className="h-9" />
    </div>
  );
}

function TextAreaField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; placeholder?: string }) {
  return (
    <div className="space-y-2 col-span-2">
      <Label className="text-sm">{label}</Label>
      <Textarea value={value} onChange={onChange} placeholder={placeholder} />
    </div>
  );
}

export default function AdminInquiries() {
  const { navigate } = useNavigate();
  const { inquiries, setInquiries } = useStore();

  function markStatus(id: string, status: InquiryStatus) {
    setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  }
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(INIT_FORM);

  const filtered = inquiries.filter((i) => {
    const matchSearch = (i.candidateName || "").toLowerCase().includes(search.toLowerCase()) || i.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || i.status === statusFilter;
    return matchSearch && matchStatus;
  });

  function handleSubmit() {
    if (editingId) {
      setInquiries((prev) =>
        prev.map((i) =>
          i.id === editingId ? { ...i, candidateName: form.candidateName, inquirerName: form.inquirerName, description: form.description } : i
        )
      );
    } else {
      const newInquiry: Inquiry = {
        id: `INQ-${String(inquiries.length + 1).padStart(3, "0")}`,
        ...form,
        candidateMobile: form.candidateMobile || "98XXXXXXXX",
        status: "new",
        createdAt: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
        createdBy: "U001",
        schoolId: "SCH001",
      } as Inquiry;
      setInquiries((prev) => [newInquiry, ...prev]);
    }
    setDialogOpen(false);
  }

  return (
    <div>
      <Header title="Inquiries" />

      <div className="rounded-lg border bg-card">
        <div className="flex items-center gap-2 p-3 border-b">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="h-8 pl-8 w-64 text-sm" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 h-8 text-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="converted">Converted</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between p-3 border-b">
          <span className="text-sm text-muted-foreground">Showing {filtered.length} inquiries</span>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={() => { setEditingId(null); setForm(INIT_FORM); }}>
                <Plus size={14} className="mr-2" /> Add Inquiry
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] p-0 flex flex-col overflow-hidden">
              <DialogHeader className="px-6 pt-6 pb-0 shrink-0">
                <DialogTitle>{editingId ? "Edit Inquiry" : "Add New Inquiry"}</DialogTitle>
              </DialogHeader>
              <div className="flex-1 min-h-0 px-6 py-4 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <h3 className="col-span-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Inquirer Information</h3>
                  <InputField label="Full Name *" value={form.inquirerName} onChange={e => setForm({...form, inquirerName: e.target.value})} />
                  <InputField label="Email" value={form.inquirerEmail} onChange={e => setForm({...form, inquirerEmail: e.target.value})} />
                  <InputField label="Mobile" value={form.inquirerMobile} onChange={e => setForm({...form, inquirerMobile: e.target.value})} />
                  <InputField label="Phone" value={form.inquirerPhone} onChange={e => setForm({...form, inquirerPhone: e.target.value})} />
                  <InputField label="Relationship" value={form.relationship} onChange={e => setForm({...form, relationship: e.target.value})} />
                  <h3 className="col-span-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-3">Candidate Information</h3>
                  <InputField label="Title" value={form.candidateTitle} onChange={e => setForm({...form, candidateTitle: e.target.value})} />
                  <InputField label="Full Name" value={form.candidateName} onChange={e => setForm({...form, candidateName: e.target.value})} />
                  <InputField label="Gender" value={form.candidateGender} onChange={e => setForm({...form, candidateGender: e.target.value})} />
                  <h3 className="col-span-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-3">Address</h3>
                  <TextAreaField label="Permanent Address" value={form.permanentAddress} onChange={e => setForm({...form, permanentAddress: e.target.value})} />
                  <h3 className="col-span-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-3">Inquiry Details & Outcome</h3>
                  <InputField label="Inquiry Type" value={form.inquiryType} onChange={e => setForm({...form, inquiryType: e.target.value})} />
                  <InputField label="Assigned To" value={form.assignedTo} onChange={e => setForm({...form, assignedTo: e.target.value})} />
                  <TextAreaField label="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                  <TextAreaField label="Outcome Details" value={form.outcomeDetails} onChange={e => setForm({...form, outcomeDetails: e.target.value})} />
                </div>
              </div>
              <DialogFooter className="px-6 pb-6 shrink-0">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSubmit}>{editingId ? "Update" : "Submit"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Candidate</TableHead>
              <TableHead>Inquirer</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((inq) => {
              const sb = STATUS_BADGE[inq.status];
              return (
                <TableRow key={inq.id}>
                  <TableCell className="text-sm font-medium text-primary">{inq.id}</TableCell>
                  <TableCell className="text-sm font-medium">{inq.candidateName || "N/A"}</TableCell>
                  <TableCell>
                    <button onClick={() => navigate("users")} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {inq.inquirerName}
                    </button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Phone size={11} /> {inq.inquirerMobile}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={sb.variant}>{sb.label}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{inq.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {inq.status === "new" && (
                        <Button variant="ghost" size="sm" className="text-xs gap-1"
                          onClick={() => markStatus(inq.id, "contacted")}
                        >
                          <MessageSquare size={12} /> Contacted
                        </Button>
                      )}
                      {inq.status === "contacted" && (
                        <Button variant="ghost" size="sm" className="text-destructive text-xs gap-1"
                          onClick={() => markStatus(inq.id, "lost")}
                        >
                          <UserX size={12} /> Lost
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
