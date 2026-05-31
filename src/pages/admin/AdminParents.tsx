import { useState } from "react";
import { Search, Link2, Unlink } from "lucide-react";
import { MOCK_USERS as DATA_USERS, PARENT_STUDENT as DATA_PARENT_STUDENT, STUDENTS as DATA_STUDENTS } from "../../data";
import type { User, ParentStudent, Student } from "../../types";
import Header from "../../layouts/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function AdminParents() {
  const [parents] = useState<User[]>(DATA_USERS.filter((u) => u.type === "parent"));
  const [parentStudent, setParentStudent] = useState<ParentStudent[]>(DATA_PARENT_STUDENT);
  const [students] = useState<Student[]>(DATA_STUDENTS);
  const [search, setSearch] = useState("");

  const [linkTargetParent, setLinkTargetParent] = useState<User | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [unlinkTarget, setUnlinkTarget] = useState<{ parentId: string; studentId: string } | null>(null);

  const filtered = parents.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  function getStudentName(id: string) {
    return students.find((s) => s.id === id)?.name || id;
  }

  function getLinkedStudents(parentId: string) {
    return parentStudent.filter((ps) => ps.parentId === parentId);
  }

  function handleLinkStudent() {
    if (!linkTargetParent || !selectedStudentId) return;
    setParentStudent((prev) => [...prev, { parentId: linkTargetParent.id, studentId: selectedStudentId }]);
    setLinkTargetParent(null);
    setSelectedStudentId("");
  }

  function handleUnlink() {
    if (!unlinkTarget) return;
    setParentStudent((prev) => prev.filter(
      (ps) => !(ps.parentId === unlinkTarget.parentId && ps.studentId === unlinkTarget.studentId)
    ));
    setUnlinkTarget(null);
  }

  const availableStudents = students.filter(
    (s) => !parentStudent.some((ps) => ps.studentId === s.id)
  );

  return (
    <div>
      <Header title="Parents" subtitle="Manage parent accounts and student relationships" />

      <div className="rounded-lg border bg-card">
        <div className="flex items-center p-3 border-b">
          <div className="flex items-center gap-2">
            <Search size={14} className="text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search parents..." className="h-8 w-56 text-sm" />
          </div>
          <Badge variant="secondary" className="ml-auto">{parents.length} parents</Badge>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Linked Students</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground text-sm">
                  No parent accounts found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((p) => {
                const linked = getLinkedStudents(p.id);
                return (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{p.email}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{p.phone}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {linked.length === 0 ? (
                          <span className="text-xs text-muted-foreground">None</span>
                        ) : (
                          linked.map((l) => (
                            <Badge key={l.studentId} variant="secondary" className="text-xs">
                              {getStudentName(l.studentId)}
                            </Badge>
                          ))
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost" size="icon" className="h-8 w-8"
                          onClick={() => { setLinkTargetParent(p); setSelectedStudentId(""); }}
                        >
                          <Link2 size={13} className="text-indigo-500" />
                        </Button>
                        {linked.length > 0 && (
                          <Button
                            variant="ghost" size="icon" className="h-8 w-8 text-red-500"
                            onClick={() => setUnlinkTarget({ parentId: p.id, studentId: linked[0].studentId })}
                          >
                            <Unlink size={13} />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!linkTargetParent} onOpenChange={(o) => { if (!o) { setLinkTargetParent(null); setSelectedStudentId(""); } }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Link Student to Parent</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground mb-3">
            Link a student to <strong>{linkTargetParent?.name}</strong>
          </p>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label>Student</Label>
              <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                <SelectContent>
                  {availableStudents.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name} ({s.rollNumber})</SelectItem>
                  ))}
                  {availableStudents.length === 0 && (
                    <SelectItem value="__none__" disabled>No unlinked students</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setLinkTargetParent(null); setSelectedStudentId(""); }}>Cancel</Button>
            <Button onClick={handleLinkStudent} disabled={!selectedStudentId}>Link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!unlinkTarget} onOpenChange={(o) => { if (!o) setUnlinkTarget(null); }}>
        <DialogContent className="sm:max-w-xs">
          <DialogHeader><DialogTitle>Unlink Student</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">
            Unlink <strong>{unlinkTarget ? getStudentName(unlinkTarget.studentId) : ""}</strong> from this parent?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUnlinkTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleUnlink}>Unlink</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
