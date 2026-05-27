import { ArrowLeft, Save } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import Header from "../../layouts/Header";

interface Props {
  onBack: () => void;
}

export default function AddResult({ onBack }: Props) {
  return (
    <div>
      <Header title="Add Result" />
      
      <div className="rounded-lg border bg-card p-6 max-w-2xl mx-auto space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Select Exam</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Choose exam" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="exam1">First Terminal Exam</SelectItem>
                <SelectItem value="exam2">Final Examination</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Select Student</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Choose student" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student1">John Doe</SelectItem>
                <SelectItem value="student2">Jane Smith</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Subject & Marks (Mockup)</Label>
          <div className="grid grid-cols-2 gap-2">
             <Input placeholder="Subject" />
             <Input type="number" placeholder="Marks" />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft size={14} className="mr-2" /> Back
          </Button>
          <Button>
            <Save size={14} className="mr-2" /> Save Result
          </Button>
        </div>
      </div>
    </div>
  );
}
