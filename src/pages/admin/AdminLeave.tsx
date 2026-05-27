import { useState } from "react";
import { Check, X, Plus, Search, Eye, Pencil, Trash } from "lucide-react";
import { LEAVE_REQUESTS as DATA_LEAVE, MOCK_USERS } from "../../data";
import type { LeaveRequest, LeaveStatus, LeaveType } from "../../types";
import Header from "../../layouts/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  DialogDescription,
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import NepaliDatePicker from "@/components/NepaliDatePicker";

const statusConfig: Record<LeaveStatus, { label: string; variant: "secondary" | "default" | "destructive" }> = {
  approved: { label: "Approved", variant: "default" },
  rejected: { label: "Rejected", variant: "destructive" },
  pending: { label: "Pending", variant: "secondary" },
};

const typeLabel: Record<string, string> = {
  sick: "Sick",
  casual: "Casual",
  annual: "Annual",
  maternity: "Maternity",
  paternity: "Paternity",
  unpaid: "Unpaid",
};

const LEAVE_TYPES: { value: LeaveType; label: string }[] = [
  { value: "sick", label: "Sick Leave" },
  { value: "casual", label: "Casual Leave" },
  { value: "annual", label: "Annual Leave" },
  { value: "maternity", label: "Maternity Leave" },
  { value: "paternity", label: "Paternity Leave" },
  { value: "unpaid", label: "Unpaid Leave" },
];

const TAB_FILTERS = [
  { value: "All", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

function getUserName(id: string) {
  return MOCK_USERS.find((u) => u.id === id)?.name || id;
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("");
}

export default function AdminLeave() {
  const [requests, setRequests] = useState<LeaveRequest[]>(DATA_LEAVE);
  const [filter, setFilter] = useState("pending");
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedUser, setSelectedUser] = useState("");
  const [form, setForm] = useState({ type: "" as LeaveType | "", from: "", to: "", reason: "" });

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const processedCount = requests.filter(r => r.status === 'approved' || r.status === 'rejected').length;

  const filtered = requests.filter((r) => {
    if (filter === "pending" && r.status !== "pending") return false;
    if (filter === "processed" && (r.status !== "approved" && r.status !== "rejected")) return false;
    if (search) {
      const q = search.toLowerCase();
      const name = getUserName(r.userId).toLowerCase();
      if (!name.includes(q) && !r.id.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  function updateStatus(id: string, status: LeaveStatus) {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  function handleSubmit() {
    if (!selectedUser || !form.type || !form.from || !form.to || !form.reason) return;
    const newRequest: LeaveRequest = {
      id: `LEV-${Date.now()}`,
      userId: selectedUser,
      startDate: form.from,
      endDate: form.to,
      type: form.type as LeaveType,
      reason: form.reason,
      status: "pending",
      schoolId: "SCH001",
    };
    setRequests((prev) => [newRequest, ...prev]);
    setDialogOpen(false);
    setForm({ type: "", from: "", to: "", reason: "" });
    setSelectedUser("");
    setStep(1);
  }


  return (
    <div>
      <Header title="Leave Requests" subtitle="Manage staff & student leave" />

      <div className="rounded-lg border bg-card">
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center gap-2">
              <button
                onClick={() => setFilter("pending")}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  filter === "pending"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                Pending {pendingCount > 0 && <Badge variant="secondary" className="ml-1">{pendingCount}</Badge>}
              </button>
              <button
                onClick={() => setFilter("processed")}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  filter === "processed"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                Accepted/Rejected {processedCount > 0 && <Badge variant="secondary" className="ml-1">{processedCount}</Badge>}
              </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="pl-8 h-8 w-52 text-sm"
              />
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus size={14} />
                  Add New
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Apply for Leave</DialogTitle>
                </DialogHeader>
                {step === 1 ? (
                  <div className="space-y-4 py-2">
                    <div className="space-y-2">
                      <Label htmlFor="user">Name</Label>
                      <Select
                        value={selectedUser}
                        onValueChange={setSelectedUser}
                      >
                        <SelectTrigger id="user">
                          <SelectValue placeholder="Select user" />
                        </SelectTrigger>
                        <SelectContent>
                          {MOCK_USERS.map((u) => (
                            <SelectItem key={u.id} value={u.id}>
                              {u.name} ({u.type})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 py-2">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input value={MOCK_USERS.find(u => u.id === selectedUser)?.name || ""} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Request Type</Label>
                      <Select
                        value={form.type}
                        onValueChange={(v) => setForm({ ...form, type: v as LeaveType })}
                      >
                        <SelectTrigger id="type">
                          <SelectValue placeholder="Select leave type" />
                        </SelectTrigger>
                        <SelectContent>
                          {LEAVE_TYPES.map((t) => (
                            <SelectItem key={t.value} value={t.value}>
                              {t.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="from">From</Label>
                        <NepaliDatePicker
                          value={form.from}
                          onChange={(v) => setForm({ ...form, from: v })}
                          placeholder="From date"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="to">To</Label>
                        <NepaliDatePicker
                          value={form.to}
                          onChange={(v) => setForm({ ...form, to: v })}
                          placeholder="To date"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reason">Comments</Label>
                      <Textarea
                        id="reason"
                        rows={3}
                        value={form.reason}
                        onChange={(e) => setForm({ ...form, reason: e.target.value })}
                      />
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button variant="outline" onClick={() => { setDialogOpen(false); setStep(1); }}>
                    Cancel
                  </Button>
                  {step === 1 ? (
                    <Button onClick={() => setStep(2)} disabled={!selectedUser}>Next</Button>
                  ) : (
                    <>
                      <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                      <Button onClick={handleSubmit}>Apply</Button>
                    </>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Requester</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date Range</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Admin Note</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r) => (
              <TableRow key={r.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="text-xs">
                        {getInitials(getUserName(r.userId))}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">
                      {getUserName(r.userId)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm capitalize text-muted-foreground">
                    {typeLabel[r.type] || r.type}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {r.startDate} — {r.endDate}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                  {r.reason}
                </TableCell>
                <TableCell>
                  <Badge variant={statusConfig[r.status].variant}>
                    {statusConfig[r.status].label}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {r.adminNote || "\u2014"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" title="View"><Eye size={15} /></Button>
                    <Button variant="ghost" size="icon" title="Edit"><Pencil size={15} /></Button>
                    <Button variant="ghost" size="icon" title="Delete"><Trash size={15} /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No leave requests found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
