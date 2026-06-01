import { useState, useMemo } from "react";
import { Check, Search, ShieldCheck, Clock, XCircle } from "lucide-react";
import { TEACHERS, CLASS_GROUPS } from "../../data";
import type { AttendanceRecord, AttendanceStatus } from "../../types";
import { useStore } from "../../StoreContext";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusColor: Record<string, string> = {
  Present: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Absent: "bg-red-50 text-red-700 border-red-200",
  Late: "bg-amber-50 text-amber-700 border-amber-200",
  Leave: "bg-blue-50 text-blue-700 border-blue-200",
};

function getStudentName(studentId: string, students: { id: string; name?: string; userId?: string }[]) {
  return students.find((s) => s.id === studentId || s.userId === studentId)?.name || studentId;
}

export default function TeacherApproveAttendance() {
  const { attendanceRecords, setAttendanceRecords, students } = useStore();
  const storeTeachers = useStore().teachers;
  const teacherList = storeTeachers.length > 0 ? storeTeachers : TEACHERS;
  const teacher = teacherList[0];
  const myClasses = useMemo(
    () => CLASS_GROUPS.filter((c) => teacher?.assignedClassIds?.includes(c.id) ?? false),
    [teacher],
  );
  const myClassIds = useMemo(() => new Set(myClasses.map((c) => c.id)), [myClasses]);

  const [filter, setFilter] = useState<"pending" | "verified" | "all">("pending");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<AttendanceStatus>("Present");

  const myClassStudentIds = useMemo(
    () => new Set(students.filter((s) => myClassIds.has(s.classId)).map((s) => s.userId || s.id)),
    [students, myClassIds],
  );

  const myMarkedRecords = useMemo(
    () => attendanceRecords.filter((r) => r.markedBy === teacher?.userId && myClassStudentIds.has(r.userId)),
    [attendanceRecords, teacher, myClassStudentIds],
  );

  const pendingCount = myMarkedRecords.filter((r) => !r.verified).length;
  const verifiedCount = myMarkedRecords.filter((r) => r.verified).length;

  const filtered = useMemo(() => {
    let list = myMarkedRecords;
    if (filter === "pending") list = list.filter((r) => !r.verified);
    if (filter === "verified") list = list.filter((r) => r.verified);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((r) => {
        const name = getStudentName(r.userId, students).toLowerCase();
        return name.includes(q) || r.date.includes(q);
      });
    }
    return list.sort((a, b) => b.date.localeCompare(a.date));
  }, [myMarkedRecords, filter, search, students]);

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((r) => r.id)));
    }
  }

  function handleVerifySingle(id: string) {
    setAttendanceRecords((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, verified: true, verifiedBy: teacher?.userId || "" } : r
      )
    );
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  function handleVerifySelected() {
    setAttendanceRecords((prev) =>
      prev.map((r) =>
        selectedIds.has(r.id) ? { ...r, verified: true, verifiedBy: teacher?.userId || "" } : r
      )
    );
    setSelectedIds(new Set());
  }

  function handleEditStatus(record: AttendanceRecord) {
    setEditingId(record.id);
    setEditStatus(record.status);
  }

  function handleSaveEdit() {
    if (!editingId) return;
    setAttendanceRecords((prev) =>
      prev.map((r) =>
        r.id === editingId ? { ...r, status: editStatus, verified: true, verifiedBy: teacher?.userId || "" } : r
      )
    );
    setEditingId(null);
  }

  function handleUnverify(id: string) {
    setAttendanceRecords((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, verified: false, verifiedBy: undefined } : r
      )
    );
  }

  return (
    <div>
      <Header title="Approve Attendance" subtitle="Review and verify student attendance records" />

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
              onClick={() => setFilter("verified")}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                filter === "verified"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              Verified {verifiedCount > 0 && <Badge variant="secondary" className="ml-1">{verifiedCount}</Badge>}
            </button>
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                filter === "all"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              All ({myMarkedRecords.length})
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search student or date..."
                className="pl-8 h-8 w-52 text-sm"
              />
            </div>
            {filter === "pending" && selectedIds.size > 0 && (
              <Button size="sm" onClick={handleVerifySelected}>
                <ShieldCheck size={14} className="mr-1" />
                Verify ({selectedIds.size})
              </Button>
            )}
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                {filter === "pending" && (
                  <input
                    type="checkbox"
                    checked={selectedIds.size === filtered.length && filtered.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded"
                  />
                )}
              </TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r) => (
              <TableRow key={r.id} className={!r.verified ? "bg-amber-50/20" : ""}>
                <TableCell>
                  {filter === "pending" && (
                    <input
                      type="checkbox"
                      checked={selectedIds.has(r.id)}
                      onChange={() => toggleSelect(r.id)}
                      className="rounded"
                    />
                  )}
                </TableCell>
                <TableCell className="text-sm font-medium">
                  {getStudentName(r.userId, students)}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{r.date}</TableCell>
                <TableCell>
                  {editingId === r.id ? (
                    <div className="flex items-center gap-1">
                      <Select value={editStatus} onValueChange={(v) => setEditStatus(v as AttendanceStatus)}>
                        <SelectTrigger className="h-7 w-28 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Present">Present</SelectItem>
                          <SelectItem value="Absent">Absent</SelectItem>
                          <SelectItem value="Late">Late</SelectItem>
                          <SelectItem value="Leave">Leave</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button size="icon" variant="ghost" className="h-6 w-6" onClick={handleSaveEdit}>
                        <Check size={12} />
                      </Button>
                    </div>
                  ) : (
                    <Badge variant="outline" className={statusColor[r.status]}>
                      {r.status}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {r.verified ? (
                    <div className="flex items-center gap-1">
                      <ShieldCheck size={13} className="text-emerald-600" />
                      <span className="text-xs text-emerald-700 font-medium">Verified</span>
                    </div>
                  ) : (
                    <span className="text-xs text-amber-600 font-medium">Pending</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {!r.verified ? (
                      <>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-emerald-600" title="Edit & Verify" onClick={() => handleEditStatus(r)}>
                          <Clock size={13} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-emerald-600" title="Verify" onClick={() => handleVerifySingle(r.id)}>
                          <ShieldCheck size={13} />
                        </Button>
                      </>
                    ) : (
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-amber-600" title="Unverify" onClick={() => handleUnverify(r.id)}>
                        <XCircle size={13} />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  {filter === "pending"
                    ? "No pending attendance records to approve."
                    : "No attendance records found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
