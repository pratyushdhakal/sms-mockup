import { useState } from "react";
import { Search, UserPlus, Phone } from "lucide-react";
import { useStore } from "../../StoreContext";
import { CLASS_GROUPS } from "../../data";
import Header from "../../layouts/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { Inquiry } from "../../types";

export default function AdminAdmissions() {
  const { inquiries, intakes, enrollInquiry } = useStore();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"pending" | "enrolled">("pending");

  const [dialogInquiry, setDialogInquiry] = useState<string | null>(null);
  const [enrollIntake, setEnrollIntake] = useState("");
  const [enrollClassGroup, setEnrollClassGroup] = useState("");
  const [enrollRoll, setEnrollRoll] = useState("");

  const contacted = inquiries.filter((i) => i.status === "contacted" && i.candidateName.toLowerCase().includes(search.toLowerCase()));
  const converted = inquiries.filter((i) => i.status === "converted" && i.candidateName.toLowerCase().includes(search.toLowerCase()));

  function handleEnroll() {
    if (!dialogInquiry || !enrollIntake || !enrollClassGroup || !enrollRoll) return;
    const result = enrollInquiry(dialogInquiry, enrollIntake, enrollRoll, enrollClassGroup);
    if (result) {
      setDialogInquiry(null);
      setEnrollIntake("");
      setEnrollClassGroup("");
      setEnrollRoll("");
    }
  }

  return (
    <div>
      <Header title="Admissions" subtitle="Enroll contacted inquiries into intakes" />

      <div className="flex items-center gap-3 border-b mb-4">
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === "pending" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          onClick={() => setTab("pending")}
        >
          Pending ({contacted.length})
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === "enrolled" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          onClick={() => setTab("enrolled")}
        >
          Enrolled ({converted.length})
        </button>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="flex items-center gap-2 p-3 border-b">
          <Search size={14} className="text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="h-8 w-64 text-sm" />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidate</TableHead>
              <TableHead>Inquirer</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tab === "pending" && contacted.map((inq: Inquiry) => (
              <TableRow key={inq.id}>
                <TableCell className="font-medium">{inq.candidateName}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{inq.inquirerName}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Phone size={11} /> {inq.inquirerMobile}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{inq.createdAt}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-blue-600 text-xs gap-1"
                    onClick={() => { setDialogInquiry(inq.id); setEnrollIntake(""); setEnrollClassGroup(""); setEnrollRoll(""); }}
                  >
                    <UserPlus size={12} /> Enroll
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {tab === "enrolled" && converted.map((inq: Inquiry) => (
              <TableRow key={inq.id}>
                <TableCell className="font-medium">{inq.candidateName}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{inq.inquirerName}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Phone size={11} /> {inq.inquirerMobile}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{inq.createdAt}</TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline" className="text-emerald-600 border-emerald-600">Enrolled</Badge>
                </TableCell>
              </TableRow>
            ))}
            {(tab === "pending" && contacted.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8 text-sm">
                  No pending admissions
                </TableCell>
              </TableRow>
            )}
            {tab === "enrolled" && converted.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8 text-sm">
                  No enrolled students yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!dialogInquiry} onOpenChange={(o) => { if (!o) setDialogInquiry(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Enroll Student</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Select Intake</Label>
              <Select value={enrollIntake} onValueChange={setEnrollIntake}>
                <SelectTrigger><SelectValue placeholder="Select intake" /></SelectTrigger>
                <SelectContent>
                  {intakes.filter((i) => i.status === "open" && i.enrolled < i.capacity).map((i) => (
                    <SelectItem key={i.id} value={i.id}>{i.name} ({i.enrolled}/{i.capacity})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Select Class Group</Label>
              <Select value={enrollClassGroup} onValueChange={setEnrollClassGroup}>
                <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                <SelectContent>
                  {CLASS_GROUPS.map((cg) => (
                    <SelectItem key={cg.id} value={cg.id}>{cg.name} ({cg.section})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Roll Number</Label>
              <Input value={enrollRoll} onChange={(e) => setEnrollRoll(e.target.value)} placeholder="e.g. 06" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogInquiry(null)}>Cancel</Button>
            <Button onClick={handleEnroll} disabled={!enrollIntake || !enrollClassGroup || !enrollRoll}>
              Enroll Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
