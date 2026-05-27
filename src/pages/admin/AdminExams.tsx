import { useState } from "react";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import NepaliDatePicker from "../../components/NepaliDatePicker";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "../../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import Header from "../../layouts/Header";

type ExamType = "Theory" | "Practical" | "Internal" | "Viva" | "Project" | "Written" | "Oral" | "Mcq" | "Assignment" | "Quiz" | "Terminal" | "Final" | "Midterm" | "Semester";
type ExamStatus = "Draft" | "Published" | "Ongoing" | "Completed" | "Cancelled";

interface Exam {
  id: string;
  name: string;
  type: ExamType;
  year: string;
  status: ExamStatus;
  startDate: string;
  endDate: string;
  description: string;
}

const MOCK_EXAMS: Exam[] = [];

export default function AdminExams() {
  const [exams] = useState<Exam[]>(MOCK_EXAMS);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div>
      <Header title="Exams" />

      <div className="rounded-lg border bg-card">
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search exams..." className="pl-8 h-8 w-64 text-sm" />
            </div>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus size={14} className="mr-2" /> Add Exam
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Exam</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Name *</Label>
                  <Input placeholder="e.g. First Terminal Exam" />
                </div>
                <div className="space-y-2">
                  <Label>Type *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {["Theory", "Practical", "Internal", "Viva", "Project", "Written", "Oral", "Mcq", "Assignment", "Quiz", "Terminal", "Final", "Midterm", "Semester"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Year</Label>
                  <Input defaultValue="2026" />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Draft" />
                    </SelectTrigger>
                    <SelectContent>
                      {["Draft", "Published", "Ongoing", "Completed", "Cancelled"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <NepaliDatePicker
                    value={""}
                    onChange={() => {}}
                    placeholder="Select start date"
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <NepaliDatePicker
                    value={""}
                    onChange={() => {}}
                    placeholder="Select end date"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Add description..." rows={3} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button>Add Exam</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exams.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              exams.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell className="font-medium text-primary">{exam.id}</TableCell>
                  <TableCell>{exam.name}</TableCell>
                  <TableCell>{exam.type}</TableCell>
                  <TableCell>{exam.year}</TableCell>
                  <TableCell>
                    <Badge variant={exam.status === "Published" ? "default" : "secondary"}>{exam.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon"><Edit2 size={14} /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive"><Trash2 size={14} /></Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
