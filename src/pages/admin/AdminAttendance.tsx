import { useState, useMemo } from "react";
import { Clock, CheckCircle2, XCircle, Users, BarChart3 } from "lucide-react";
import { useStore } from "../../StoreContext";
import type { AttendanceRecord } from "../../types";
import { useNavigate } from "../../NavContext";
import Header from "../../layouts/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type AttendanceStatus = "Present" | "Absent" | "Late" | "Unmarked";

interface StaffMember {
  id: string;
  name: string;
  role: string;
  status: AttendanceStatus;
}

const DEFAULT_STAFF: StaffMember[] = [
  { id: "U002", name: "Ram P. KC", role: "TEACHER", status: "Unmarked" },
  { id: "U003", name: "Sunita M.", role: "TEACHER", status: "Unmarked" },
  { id: "U004", name: "Kamala A.", role: "TEACHER", status: "Unmarked" },
  { id: "U005", name: "Gopal S.", role: "STAFF", status: "Unmarked" },
  { id: "U006", name: "Binod K.", role: "STAFF", status: "Unmarked" },
  { id: "U010", name: "Suman G.", role: "TEACHER", status: "Unmarked" },
];

function StaffAttendanceTab() {
  const [staffList, setStaffList] = useState<StaffMember[]>(DEFAULT_STAFF);
  const [filter, setFilter] = useState<AttendanceStatus | "All">("All");
  const [search, setSearch] = useState("");

  const statusCounts = useMemo(() => ({
    Present: staffList.filter(s => s.status === "Present").length,
    Late: staffList.filter(s => s.status === "Late").length,
    Absent: staffList.filter(s => s.status === "Absent").length,
    Unmarked: staffList.filter(s => s.status === "Unmarked").length,
  }), [staffList]);

  const filtered = useMemo(() => {
    let list = staffList;
    if (filter !== "All") list = list.filter(s => s.status === filter);
    if (search) list = list.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [staffList, filter, search]);

  function setStatus(id: string, status: AttendanceStatus) {
    setStaffList(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  }

  const filterBtn = (label: AttendanceStatus | "All") => (
    <Button variant={filter === label ? "default" : "outline"} size="sm" onClick={() => setFilter(label)}>
      {label === "Late" && <Clock className="h-4 w-4 mr-2" />}
      {label === "Present" && <CheckCircle2 className="h-4 w-4 mr-2" />}
      {label === "Absent" && <XCircle className="h-4 w-4 mr-2" />}
      {label === "All" && <BarChart3 className="h-4 w-4 mr-2" />}
      {label}
    </Button>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {filterBtn("All")}
          {filterBtn("Present")}
          {filterBtn("Late")}
          {filterBtn("Absent")}
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-xs text-muted-foreground">
            {statusCounts.Present} present &middot; {statusCounts.Late} late &middot; {statusCounts.Absent} absent &middot; {statusCounts.Unmarked} unmarked
          </span>
          <Input placeholder="Search staff..." className="w-48" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filtered.map((staff) => (
          <Card key={staff.id} className={staff.status === "Present" ? "border-emerald-200 bg-emerald-50/30" : staff.status === "Absent" ? "border-red-200 bg-red-50/30" : staff.status === "Late" ? "border-amber-200 bg-amber-50/30" : "border-slate-200"}>
            <CardContent className="p-4 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 mx-auto flex items-center justify-center font-bold text-sm text-slate-600">
                {staff.name.split(' ').map(n=>n[0]).slice(0,2).join('')}
              </div>
              <div className="space-y-0.5">
                <div className="font-medium text-sm">{staff.name}</div>
                <div className="text-[10px] text-muted-foreground">{staff.role}</div>
              </div>
              <Badge variant="outline" className={
                staff.status === "Present" ? "bg-emerald-50 text-emerald-700" :
                staff.status === "Absent" ? "bg-red-50 text-red-700" :
                staff.status === "Late" ? "bg-amber-50 text-amber-700" :
                "bg-slate-50 text-slate-600"
              }>{staff.status}</Badge>
              
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => setStatus(staff.id, "Late")}
                  className={`transition-colors ${staff.status === "Late" ? "text-amber-600" : "text-slate-400 hover:text-amber-600"}`}
                  title="Mark Late"
                ><Clock size={16} /></button>
                <button
                  onClick={() => setStatus(staff.id, "Present")}
                  className={`transition-colors ${staff.status === "Present" ? "text-emerald-600" : "text-slate-400 hover:text-emerald-600"}`}
                  title="Mark Present"
                ><CheckCircle2 size={16} /></button>
                <button
                  onClick={() => setStatus(staff.id, "Absent")}
                  className={`transition-colors ${staff.status === "Absent" ? "text-red-600" : "text-slate-400 hover:text-red-600"}`}
                  title="Mark Absent"
                ><XCircle size={16} /></button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function AdminAttendance() {
  const { navigate, setViewEntity } = useNavigate();
  const { students, attendanceRecords, setAttendanceRecords, deviceLogs, users } = useStore();

  const ADMIN_USER_ID = "U001";
  const [markDate, setMarkDate] = useState(new Date().toISOString().split("T")[0]);
  const [markStatus, setMarkStatus] = useState<"Present" | "Absent" | "Late" | "Leave">("Present");

  const myRecords = useMemo(
    () => attendanceRecords.filter((r) => r.userId === ADMIN_USER_ID),
    [attendanceRecords],
  );

  const myStats = useMemo(() => {
    const counts = myRecords.reduce(
      (acc, r) => {
        acc[r.status] = (acc[r.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
    const total = myRecords.length;
    return [
      { label: "Total Records", val: String(total) },
      { label: "Present", val: String(counts["Present"] || 0) },
      { label: "Late", val: String(counts["Late"] || 0) },
      { label: "Absent", val: String(counts["Absent"] || 0) },
    ];
  }, [myRecords]);

  const sortedRecords = useMemo(
    () => [...myRecords].sort((a, b) => b.date.localeCompare(a.date)),
    [myRecords],
  );

  function handleMarkAttendance() {
    const existing = myRecords.find((r) => r.date === markDate);
    const newRecord: AttendanceRecord = {
      id: existing?.id || `ATT-${Date.now()}`,
      userId: ADMIN_USER_ID,
      date: markDate,
      status: markStatus,
      source: "manual",
      markedBy: ADMIN_USER_ID,
      verified: true,
      verifiedBy: ADMIN_USER_ID,
      schoolId: "SCH001",
    };
    if (existing) {
      setAttendanceRecords((prev) => prev.map((r) => (r.id === existing.id ? newRecord : r)));
    } else {
      setAttendanceRecords((prev) => [...prev, newRecord]);
    }
  }

  // Device Logs State
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [search, setSearch] = useState("");
  const [activeRoleTab, setActiveRoleTab] = useState<"Students" | "Staff" | "Teachers" | "Managers">("Students");

  const filteredDeviceLogs = useMemo(() => {
    let logs = deviceLogs;
    if (dateStart) logs = logs.filter(l => l.date >= dateStart);
    if (dateEnd) logs = logs.filter(l => l.date <= dateEnd);
    if (search) logs = logs.filter(l => users.find(u => u.id === l.userId)?.name.toLowerCase().includes(search.toLowerCase()));
    
    // Filter by role tab
    if (activeRoleTab === "Students") logs = logs.filter(l => users.find(u => u.id === l.userId)?.type === "student");
    if (activeRoleTab === "Staff") logs = logs.filter(l => users.find(u => u.id === l.userId)?.type === "staff");
    if (activeRoleTab === "Teachers") logs = logs.filter(l => users.find(u => u.id === l.userId)?.type === "teacher");
    if (activeRoleTab === "Managers") logs = logs.filter(l => users.find(u => u.id === l.userId)?.type === "admin");

    return logs;
  }, [deviceLogs, dateStart, dateEnd, search, activeRoleTab, users]);

  const deviceSummary = useMemo(() => ({
    total: filteredDeviceLogs.length,
    checkIns: filteredDeviceLogs.filter(l => l.checkIn).length,
    checkOuts: filteredDeviceLogs.filter(l => l.checkOut).length,
  }), [filteredDeviceLogs]);

  return (
    <div className="p-6 space-y-6">
      <Header title="Attendance" subtitle="Track and manage attendance records" />

      <Tabs defaultValue="class" className="space-y-4">
        <TabsList>
          <TabsTrigger value="class">Class Attendance</TabsTrigger>
          <TabsTrigger value="staff">Staff Attendance</TabsTrigger>
          <TabsTrigger value="device">Device Logs</TabsTrigger>
          <TabsTrigger value="my">My Attendance</TabsTrigger>
        </TabsList>

          <TabsContent value="class" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0"><CardTitle className="text-sm font-medium">Total Students</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader>
                <CardContent><div className="text-2xl font-bold">{students.length}</div></CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0"><CardTitle className="text-sm font-medium">Present</CardTitle><CheckCircle2 className="h-4 w-4 text-emerald-500" /></CardHeader>
                <CardContent><div className="text-2xl font-bold text-emerald-600">480</div></CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0"><CardTitle className="text-sm font-medium">Absent</CardTitle><XCircle className="h-4 w-4 text-red-500" /></CardHeader>
                <CardContent><div className="text-2xl font-bold text-red-600">25</div></CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader><CardTitle>Class Attendance Details</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow><TableHead>Class Name</TableHead><TableHead>Present</TableHead><TableHead>Absent</TableHead><TableHead>Late</TableHead><TableHead>Attendance %</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {[
                      { name: "Class 1", present: 45, absent: 2, late: 0, pct: "97%" },
                      { name: "Class 6", present: 29, absent: 2, late: 0, pct: "94%" },
                      { name: "Nursery", present: 38, absent: 0, late: 1, pct: "100%" },
                      { name: "LKG", present: 25, absent: 5, late: 0, pct: "83%" },
                    ].map((row) => (
                      <TableRow key={row.name}>
                        <TableCell className="font-medium cursor-pointer hover:text-primary transition-colors" onClick={() => navigate("class-groups")}>{row.name}</TableCell>
                        <TableCell className="text-emerald-600">{row.present}</TableCell>
                        <TableCell className="text-red-600">{row.absent}</TableCell>
                        <TableCell className="text-amber-600">{row.late}</TableCell>
                        <TableCell>{row.pct}</TableCell>
                        <TableCell><Badge variant="outline" className={row.pct === "100%" ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700"}>Good</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

        <TabsContent value="staff" className="space-y-4">
          <StaffAttendanceTab />
        </TabsContent>
        
        <TabsContent value="device">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Biometric Device Logs</CardTitle>
                <div className="flex gap-2">
                    <Input type="date" value={dateStart} onChange={e => setDateStart(e.target.value)} className="w-40" />
                    <Input type="date" value={dateEnd} onChange={e => setDateEnd(e.target.value)} className="w-40" />
                    <Input placeholder="Search name" value={search} onChange={e => setSearch(e.target.value)} className="w-40" />
                    <Button variant="outline" size="sm">Refresh</Button>
                </div>
            </CardHeader>
            <CardContent>
              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Records</p><p className="text-2xl font-bold">{deviceSummary.total}</p></CardContent></Card>
                <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Check Ins</p><p className="text-2xl font-bold text-emerald-600">{deviceSummary.checkIns}</p></CardContent></Card>
                <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Check Outs</p><p className="text-2xl font-bold text-blue-600">{deviceSummary.checkOuts}</p></CardContent></Card>
              </div>
              
              {/* Tabs for Roles */}
              <div className="flex gap-2 mb-4 border-b">
                {(["Students", "Staff", "Teachers", "Managers"] as const).map(role => (
                  <button key={role} onClick={() => setActiveRoleTab(role)} className={`pb-2 px-2 text-sm ${activeRoleTab === role ? "border-b-2 border-indigo-600 font-medium text-indigo-600" : "text-muted-foreground"}`}>{role}</button>
                ))}
              </div>

              <Table>
                <TableHeader><TableRow><TableHead>User ID</TableHead><TableHead>Date</TableHead><TableHead>User</TableHead><TableHead>Check In</TableHead><TableHead>Check Out</TableHead></TableRow></TableHeader>
                <TableBody>
                  {filteredDeviceLogs.map(log => (
                    <TableRow key={log.id}>
                      <TableCell>{log.userId}</TableCell>
                      <TableCell>{log.date}</TableCell>
                      <TableCell
                        className="font-medium cursor-pointer hover:text-primary transition-colors"
                        onClick={() => {
                          const user = users.find(u => u.id === log.userId);
                          if (user?.type === "student") {
                            setViewEntity({ type: "student", id: user.id });
                            navigate("student-detail");
                          } else if (user?.type === "teacher" || user?.type === "staff") navigate("staff");
                          else if (user?.type === "admin") navigate("users");
                        }}
                      >{users.find(u => u.id === log.userId)?.name || "Unknown"}</TableCell>
                      <TableCell className="text-emerald-600">{log.checkIn}</TableCell>
                      <TableCell className="text-blue-600">{log.checkOut || "-"}</TableCell>
                    </TableRow>
                  ))}
                  {filteredDeviceLogs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-6">No data</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my">
          <Card>
            <CardHeader><CardTitle>My Attendance</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-4 gap-4">
                {myStats.map((stat) => (
                  <Card key={stat.label}>
                    <CardContent className="p-4">
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                      <div className="text-2xl font-bold">{stat.val}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex items-end gap-4 p-4 border rounded-lg">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Date</label>
                  <Input type="date" value={markDate} onChange={(e) => setMarkDate(e.target.value)} className="w-40" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Status</label>
                  <Select value={markStatus} onValueChange={(v) => setMarkStatus(v as "Present" | "Absent" | "Late" | "Leave")}>
                    <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Present">Present</SelectItem>
                      <SelectItem value="Absent">Absent</SelectItem>
                      <SelectItem value="Late">Late</SelectItem>
                      <SelectItem value="Leave">Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleMarkAttendance} size="sm">Mark</Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Source</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedRecords.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>{r.date}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            r.status === "Present"
                              ? "bg-emerald-50 text-emerald-700"
                              : r.status === "Absent"
                                ? "bg-red-50 text-red-700"
                                : r.status === "Late"
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-blue-50 text-blue-700"
                          }
                        >
                          {r.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="capitalize">{r.source}</TableCell>
                    </TableRow>
                  ))}
                  {sortedRecords.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground py-6">No attendance records found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
