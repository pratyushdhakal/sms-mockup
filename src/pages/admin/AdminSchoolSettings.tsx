import { useState } from "react";
import { Save, Calendar } from "lucide-react";
import { SCHOOL_CONFIG as DATA_SCHOOL_CONFIG, BATCHES } from "../../data";
import type { SchoolConfig } from "../../types";
import { useNavigate } from "../../NavContext";
import Header from "../../layouts/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function AdminSchoolSettings() {
  const { navigate } = useNavigate();
  const [config, setConfig] = useState<SchoolConfig>(DATA_SCHOOL_CONFIG);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <Header title="School Settings" subtitle="Configure school information and active session" />

      <div className="rounded-lg border bg-card max-w-2xl">
        <div className="p-6 space-y-5">
          <h2 className="text-sm font-semibold">General Information</h2>

          <div className="space-y-1.5">
            <Label>School Name</Label>
            <Input
              value={config.schoolName}
              onChange={(e) => setConfig((p) => ({ ...p, schoolName: e.target.value }))}
              placeholder="Enter school name"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Address</Label>
            <Input
              value={config.address}
              onChange={(e) => setConfig((p) => ({ ...p, address: e.target.value }))}
              placeholder="Enter school address"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Phone</Label>
            <Input
              value={config.phone}
              onChange={(e) => setConfig((p) => ({ ...p, phone: e.target.value }))}
              placeholder="Enter phone number"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Active Academic Year</Label>
            <Select
              value={config.activeAcademicYear}
              onValueChange={(v) => setConfig((p) => ({ ...p, activeAcademicYear: v }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select active year" />
              </SelectTrigger>
              <SelectContent>
                {BATCHES.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button onClick={handleSave}>
              <Save size={14} /> Save Settings
            </Button>
            <Button variant="outline" onClick={() => navigate("academic-years")}>
              <Calendar size={14} /> Manage Years
            </Button>
            {saved && (
              <span className="text-xs text-emerald-600 font-medium">Settings saved successfully!</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
