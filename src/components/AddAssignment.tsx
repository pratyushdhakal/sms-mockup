import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BATCHES, CLASS_GROUPS, TEACHERS, SUBJECTS } from "../data";
import type { Assignment } from "../types";

interface AddAssignmentProps {
  onAdd?: (assignment: Assignment) => void;
}

export function AddAssignment({ onAdd }: AddAssignmentProps) {
  const [batch, setBatch] = useState("");
  const [classId, setClassId] = useState("");
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  function handleSubmit() {
    if (!batch || !classId || !subject || !title || !dueDate) return;
    const assignment: Assignment = {
      id: `AS${Date.now()}`,
      title,
      description,
      classId,
      subject,
      teacherId: TEACHERS[0]?.userId || "",
      dueDate,
      batch,
      createdAt: new Date().toISOString(),
      schoolId: "SCH001",
    };
    if (onAdd) onAdd(assignment);
    setBatch("");
    setClassId("");
    setSubject("");
    setTitle("");
    setDescription("");
    setDueDate("");
  }

  const classOptions = CLASS_GROUPS.map((cg) => ({
    value: cg.id,
    label: `${cg.name} (${cg.section})`,
  }));

  const subjectOptions = SUBJECTS.map((s) => ({
    value: s.name,
    label: s.name,
  }));

  return (
    <Card className="w-full">
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Batch Year</Label>
            <Select value={batch} onValueChange={setBatch}>
              <SelectTrigger>
                <SelectValue placeholder="Select Batch" />
              </SelectTrigger>
              <SelectContent>
                {BATCHES.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Class</Label>
            <Select value={classId} onValueChange={setClassId}>
              <SelectTrigger>
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent>
                {classOptions.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Subject</Label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent>
                {subjectOptions.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Due Date</Label>
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Assignment Title" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Assignment Description" />
        </div>

        <Button onClick={handleSubmit} disabled={!batch || !classId || !subject || !title || !dueDate}>Submit</Button>
      </CardContent>
    </Card>
  );
}
