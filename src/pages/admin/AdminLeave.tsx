import { useState } from "react";
import { Plus, Search, Eye, Pencil, Trash } from "lucide-react";
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

  const [viewTarget, setViewTarget] = useState<LeaveRequest | null>(null);
  const [editTarget, setEditTarget] = useState<LeaveRequest | null>(null);
  const [editNote, setEditNote] = useState("");
  const [editStatus, setEditStatus] = useState<LeaveStatus>("pending");
  const [deleteTarget, setDeleteTarget] = useState<LeaveRequest | null>(null);

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

  function handleEditSave() {
    if (!editTarget) return;
    setRequests((prev) => prev.map((r) =>
      r.id === editTarget.id ? { ...r, adminNote: editNote, status: editStatus } : r
    ));
    setEditTarget(null);
    setEditNote("");
  }

  function handleDeleteLeave() {
    if (!deleteTarget) return;
    setRequests((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    setDeleteTarget(null);
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
                    <Button variant="ghost" size="icon" title="View" onClick={() => setViewTarget(r)}><Eye size={15} /></Button>
                    <Button variant="ghost" size="icon" title="Edit" onClick={() => { setEditTarget(r); setEditNote(r.adminNote || ""); setEditStatus(r.status); }}><Pencil size={15} /></Button>
                    <Button variant="ghost" size="icon" title="Delete" className="text-red-500" onClick={() => setDeleteTarget(r)}><Trash size={15} /></Button>
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

      <Dialog open={!!viewTarget} onOpenChange={(o) => { if (!o) setViewTarget(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Leave Request Details</DialogTitle></DialogHeader>
          {viewTarget && (
            <div className="space-y-3 py-2">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Requester:</span> <span className="font-medium">{getUserName(viewTarget.userId)}</span></div>
                <div><span className="text-muted-foreground">Type:</span> <span className="font-medium capitalize">{typeLabel[viewTarget.type]}</span></div>
                <div><span className="text-muted-foreground">From:</span> <span className="font-medium">{viewTarget.startDate}</span></div>
                <div><span className="text-muted-foreground">To:</span> <span className="font-medium">{viewTarget.endDate}</span></div>
                <div><span className="text-muted-foreground">Status:</span> <Badge variant={statusConfig[viewTarget.status].variant}>{statusConfig[viewTarget.status].label}</Badge></div>
                <div><span className="text-muted-foreground">Admin Note:</span> <span className="font-medium">{viewTarget.adminNote || "\u2014"}</span></div>
              </div>
              <div className="text-sm"><span className="text-muted-foreground">Reason:</span><p className="mt-1">{viewTarget.reason}</p></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setViewTarget(null)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editTarget} onOpenChange={(o) => { if (!o) { setEditTarget(null); setEditNote(""); } }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Edit Leave Request</DialogTitle></DialogHeader>
          {editTarget && (
            <div className="space-y-3 py-2">
              <p className="text-sm font-medium">{getUserName(editTarget.userId)} — {typeLabel[editTarget.type]}</p>
              <div className="space-y-1.5">
                <Label>Admin Note</Label>
                <Textarea value={editNote} onChange={(e) => setEditNote(e.target.value)} rows={3} placeholder="Add admin note..." />
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={editStatus} onValueChange={(v) => setEditStatus(v as LeaveStatus)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditTarget(null); setEditNote(""); }}>Cancel</Button>
            <Button onClick={handleEditSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}>
        <DialogContent className="sm:max-w-xs">
          <DialogHeader><DialogTitle>Delete Leave Request</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete this leave request?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteLeave}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
