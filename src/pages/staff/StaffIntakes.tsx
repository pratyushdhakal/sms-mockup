import { useState, useMemo } from "react";
import { Search, Clock, BookMarked, Users, DoorOpen } from "lucide-react";
import { useStore } from "../../StoreContext";
import Header from "../../layouts/Header";
import type { Intake } from "../../types";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const STATUS_BADGE: Record<Intake["status"], { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
  open: { variant: "default", label: "Open" },
  closed: { variant: "outline", label: "Closed" },
};

export default function StaffIntakes() {
  const { intakes } = useStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");

  const stats = useMemo(() => {
    const total = intakes.length;
    const pending = 0;
    const open = intakes.filter((i) => i.status === "open").length;
    const totalCapacity = intakes.reduce((s, i) => s + i.capacity, 0);
    const totalEnrolled = intakes.reduce((s, i) => s + i.enrolled, 0);
    return { total, pending, open, totalCapacity, totalEnrolled };
  }, [intakes]);

  const filtered = intakes.filter((i) => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || i.status === statusFilter;
    const matchGrade = !gradeFilter || i.grade === gradeFilter;
    return matchSearch && matchStatus && matchGrade;
  });

  const grades = useMemo(() => [...new Set(intakes.map((i) => i.grade))], [intakes]);

  return (
    <div>
      <Header title="Intakes" subtitle="Manage admission intakes" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground font-medium">Total Intakes</span>
            <BookMarked size={15} className="text-muted-foreground" />
          </div>
          <p className="text-2xl font-semibold">{stats.total}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground font-medium">Pending</span>
            <Clock size={15} className="text-amber-500" />
          </div>
          <p className="text-2xl font-semibold text-amber-600">{stats.pending}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground font-medium">Approved</span>
            <DoorOpen size={15} className="text-emerald-500" />
          </div>
          <p className="text-2xl font-semibold text-emerald-600">{stats.open}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground font-medium">Enrolled</span>
            <Users size={15} className="text-muted-foreground" />
          </div>
          <p className="text-2xl font-semibold">
            {stats.totalEnrolled}
            <span className="text-sm text-muted-foreground font-normal"> / {stats.totalCapacity}</span>
          </p>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search intakes..." className="pl-8 h-8 w-56 text-sm" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36 h-8 text-sm">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="open">Approved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={gradeFilter} onValueChange={setGradeFilter}>
              <SelectTrigger className="w-32 h-8 text-sm">
                <SelectValue placeholder="All Grades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Grades</SelectItem>
                {grades.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Enrolled</TableHead>
              <TableHead>Occupancy</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((intake) => {
              const pct = intake.capacity > 0 ? Math.round((intake.enrolled / intake.capacity) * 100) : 0;
              const sb = STATUS_BADGE[intake.status];
              return (
                <TableRow key={intake.id}>
                  <TableCell className="text-sm font-medium text-primary">{intake.id}</TableCell>
                  <TableCell className="text-sm font-medium">{intake.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{intake.grade}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{intake.academicYear}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{intake.capacity}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{intake.enrolled}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground">{pct}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={sb.variant}>{sb.label}</Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between px-3 py-2 border-t text-xs text-muted-foreground">
          <span>Showing {filtered.length} of {intakes.length} intakes</span>
        </div>
      </div>
    </div>
  );
}
