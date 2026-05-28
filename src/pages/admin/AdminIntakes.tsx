import { useState } from "react";
import { Search } from "lucide-react";
import { useStore } from "../../StoreContext";
import { CLASSES_LIST } from "../../data";
import Header from "../../layouts/Header";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export default function AdminIntakes() {
  const { intakes } = useStore();
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");

  const filtered = intakes.filter((i) => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.grade.toLowerCase().includes(search.toLowerCase());
    const matchGrade = !gradeFilter || i.grade === gradeFilter;
    return matchSearch && matchGrade;
  });

  return (
    <div>
      <Header title="Batch Management" subtitle="Manage group enrollment capacity" />
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-lg border bg-card p-4">
          <span className="text-xs text-muted-foreground font-medium">Total Batches</span>
          <p className="text-2xl font-semibold">{intakes.length}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <span className="text-xs text-muted-foreground font-medium">Total Capacity</span>
          <p className="text-2xl font-semibold">{intakes.reduce((s, i) => s + i.capacity, 0)}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <span className="text-xs text-muted-foreground font-medium">Total Enrolled</span>
          <p className="text-2xl font-semibold">{intakes.reduce((s, i) => s + i.enrolled, 0)}</p>
        </div>
      </div>
      <div className="rounded-lg border bg-card">
        <div className="flex items-center gap-2 p-3 border-b">
          <Search size={14} className="text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search batches..." className="h-8 w-56 text-sm" />
          <Select value={gradeFilter} onValueChange={setGradeFilter}>
            <SelectTrigger className="w-32 h-8 text-sm"><SelectValue placeholder="All Grades" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Grades</SelectItem>
              {CLASSES_LIST.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Batch Name</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Enrolled</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((intake) => (
              <TableRow key={intake.id}>
                <TableCell className="font-medium">{intake.name}</TableCell>
                <TableCell>{intake.grade}</TableCell>
                <TableCell>{intake.academicYear}</TableCell>
                <TableCell>{intake.capacity}</TableCell>
                <TableCell>{intake.enrolled}</TableCell>
                <TableCell>
                  <Badge variant={intake.status === "open" ? "default" : "secondary"}>{intake.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
