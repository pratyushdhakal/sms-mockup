import { useState } from "react";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import Header from "../../layouts/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import NepaliDatePicker from "@/components/NepaliDatePicker";

const INIT_FORM = {
  inquirerName: "", inquirerEmail: "", inquirerMobile: "", inquirerPhone: "", relationship: "",
  candidateTitle: "", candidateName: "", candidateGender: "", candidateDob: "", candidateMobile: "", candidatePhone: "", candidateEmail: "", contactMethod: "", candidateRole: "",
  permanentAddress: "", temporaryAddress: "",
  inquiryType: "", description: "",
  outcome: "", assignedTo: "", outcomeDetails: ""
};

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([
      { id: "INQ-7", name: "dd", mobile: "N/A", reason: "dfdf", createdBy: "Admin", date: "Jestha 11, 2083" },
      { id: "INQ-5", name: "Raman Giri", mobile: "9800962010", reason: "dufhiausdfiuasf", createdBy: "Admin", date: "Jestha 10, 2083" },
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(INIT_FORM);

  const handleSubmit = () => {
    if (editingId) {
        setInquiries(prev => prev.map(i => i.id === editingId ? {...i, name: form.candidateName, mobile: form.candidateMobile, reason: form.description} : i));
    } else {
        setInquiries(prev => [{ id: `INQ-${prev.length + 8}`, name: form.candidateName, mobile: form.candidateMobile, reason: form.description, createdBy: "Admin", date: new Date().toLocaleDateString() }, ...prev]);
    }
    setDialogOpen(false);
  };

  function InputField({ label, value, onChange, placeholder }: any) {
    return (
        <div className="space-y-2">
            <Label className="text-sm">{label}</Label>
            <Input value={value} onChange={onChange} placeholder={placeholder} className="h-9" />
        </div>
    )
  }

  function TextAreaField({ label, value, onChange, placeholder }: any) {
    return (
        <div className="space-y-2 col-span-2">
            <Label className="text-sm">{label}</Label>
            <Textarea value={value} onChange={onChange} placeholder={placeholder} />
        </div>
    )
  }

  return (
    <div>
      <Header title="Inquiries" />
      <div className="rounded-lg border bg-card">
        {/* Filter Bar - Same style as AdminStudents */}
        <div className="flex items-center gap-2 p-3 border-b">
            <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search..." className="h-8 pl-8 w-64 text-sm" />
            </div>
            <Select><SelectTrigger className="w-36 h-8 text-sm"><SelectValue placeholder="Date Range" /></SelectTrigger></Select>
            <Select><SelectTrigger className="w-36 h-8 text-sm"><SelectValue placeholder="Inquiry For" /></SelectTrigger></Select>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between p-3 border-b">
          <span className="text-sm text-muted-foreground">Showing all inquiries</span>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button size="sm" onClick={() => { setEditingId(null); setForm(INIT_FORM); }}>
                    <Plus size={14} className="mr-2" /> Add Inquiry
                </Button>
            </DialogTrigger>
             <DialogContent className="sm:max-w-4xl max-h-[90vh] h-full p-0 flex flex-col overflow-hidden">
              <DialogHeader className="px-6 pt-6 pb-0 shrink-0">
                <DialogTitle>{editingId ? "Edit Inquiry" : "Add New Inquiry"}</DialogTitle>
              </DialogHeader>
              <ScrollArea className="flex-1 min-h-0 px-6 py-4">
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
                    <div className="space-y-2"><Label className="text-sm">Date of Birth</Label><NepaliDatePicker value={form.candidateDob} onChange={(v) => setForm({...form, candidateDob: v})} placeholder="Select date of birth" /></div>
                    
                    <h3 className="col-span-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-3">Address</h3>
                    <TextAreaField label="Permanent Address" value={form.permanentAddress} onChange={e => setForm({...form, permanentAddress: e.target.value})} />
                    <TextAreaField label="Temporary Address" value={form.temporaryAddress} onChange={e => setForm({...form, temporaryAddress: e.target.value})} />
                    
                    <h3 className="col-span-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-3">Inquiry Details & Outcome</h3>
                    <InputField label="Inquiry Type" value={form.inquiryType} onChange={e => setForm({...form, inquiryType: e.target.value})} />
                    <InputField label="Assigned To" value={form.assignedTo} onChange={e => setForm({...form, assignedTo: e.target.value})} />
                    <TextAreaField label="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                    <TextAreaField label="Outcome Details" value={form.outcomeDetails} onChange={e => setForm({...form, outcomeDetails: e.target.value})} />
                </div>
              </ScrollArea>
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
              <TableHead>Name</TableHead>
              <TableHead>Mobile Number</TableHead>
              <TableHead>Reason(s)</TableHead>
              <TableHead>Inquiry Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inquiries.map(i => (
              <TableRow key={i.id}>
                <TableCell className="font-medium text-primary">{i.id}</TableCell>
                <TableCell>{i.name}</TableCell>
                <TableCell>{i.mobile}</TableCell>
                <TableCell>{i.reason}</TableCell>
                <TableCell>{i.date}</TableCell>
                <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => { setEditingId(i.id); setDialogOpen(true); }}><Edit2 size={14} /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive"><Trash2 size={14} /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
