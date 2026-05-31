import { useState } from "react";
import { Plus, Trash2, Check, AlertCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CLASS_GROUPS, TEACHERS } from "../data";
import { useStore } from "../StoreContext";

type Period = {
  id: string;
  type: "class" | "break";
  startTime: string;
  endTime: string;
  subject: string;
  teacherId: string;
};

function resetPeriods(): Period[] {
  return [{ id: "p1", type: "class", startTime: "", endTime: "", subject: "", teacherId: "" }];
}

type FormErrors = {
  classId?: string;
  day?: string;
  periods?: string;
};

export function CreateRoutine({ onSaved }: { onSaved?: (classId: string) => void }) {
  const { setRoutineSlots } = useStore();
  const [classId, setClassId] = useState("");
  const [day, setDay] = useState("");
  const [firstStartTime, setFirstStartTime] = useState("");
  const [classDuration, setClassDuration] = useState("45");
  const [breakDuration, setBreakDuration] = useState("10");
  const [recurring, setRecurring] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [periods, setPeriods] = useState<Period[]>(resetPeriods());

  const addPeriod = (type: "class" | "break") => {
    setPeriods([...periods, { id: `p${Date.now()}`, type, startTime: "", endTime: "", subject: "", teacherId: "" }]);
    setErrors((prev) => ({ ...prev, periods: undefined }));
  };

  const removePeriod = (id: string) => {
    setPeriods(periods.filter((p) => p.id !== id));
  };

  const updatePeriod = (id: string, field: keyof Period, value: string) => {
    setPeriods(periods.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
    setErrors((prev) => ({ ...prev, periods: undefined }));
  };

  const daysToCreate = recurring ? ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] : day ? [day] : [];

  function validate(): boolean {
    const errs: FormErrors = {};
    if (!classId) errs.classId = "Please select a class section";
    if (!recurring && !day) errs.day = "Please select a day or enable recurring";
    const classPeriods = periods.filter((p) => p.type === "class");
    const validPeriods = classPeriods.filter((p) => p.subject && p.teacherId);
    if (classPeriods.length > 0 && validPeriods.length === 0) {
      errs.periods = "Fill subject and teacher for at least one class period";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function resetForm() {
    setClassId("");
    setDay("");
    setFirstStartTime("");
    setClassDuration("45");
    setBreakDuration("10");
    setRecurring(false);
    setPeriods(resetPeriods());
    setErrors({});
  }

  function handleSave() {
    if (!validate()) return;

    const classPeriods = periods.filter((p) => p.type === "class" && p.subject && p.teacherId);
    if (classPeriods.length === 0) return;

    const newSlots = daysToCreate.flatMap((d) =>
      classPeriods.map((p, i) => ({
        id: `R${Date.now()}-${d}-${i}`,
        classId,
        day: d,
        period: i + 1,
        subject: p.subject,
        teacherId: p.teacherId,
        room: CLASS_GROUPS.find((c) => c.id === classId)?.room || "",
        schoolId: "SCH001",
      }))
    );

    setRoutineSlots((prev) => [...prev, ...newSlots]);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    resetForm();
    onSaved?.(classId);
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Section Name</Label>
            <Select value={classId} onValueChange={(v) => { setClassId(v); setErrors((prev) => ({ ...prev, classId: undefined })); }}>
              <SelectTrigger>
                <SelectValue placeholder="Select Class Section" />
              </SelectTrigger>
              <SelectContent>
                {CLASS_GROUPS.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name} ({c.section})</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.classId && <p className="text-xs text-red-500 flex items-center gap-1 mt-1"><AlertCircle size={12} />{errors.classId}</p>}
          </div>
          <div className="space-y-2">
            <Label>Day of Week</Label>
            <Select value={day} onValueChange={(v) => { setDay(v); setErrors((prev) => ({ ...prev, day: undefined })); }} disabled={recurring}>
              <SelectTrigger>
                <SelectValue placeholder="Select Day" />
              </SelectTrigger>
              <SelectContent>
                {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.day && <p className="text-xs text-red-500 flex items-center gap-1 mt-1"><AlertCircle size={12} />{errors.day}</p>}
          </div>
          <div className="space-y-2">
            <Label>First Period Start Time</Label>
            <Input type="time" value={firstStartTime} onChange={(e) => setFirstStartTime(e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Class Duration (minutes)</Label>
            <Input type="number" placeholder="45" value={classDuration} onChange={(e) => setClassDuration(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Break Duration (minutes)</Label>
            <Input type="number" placeholder="10" value={breakDuration} onChange={(e) => setBreakDuration(e.target.value)} />
          </div>
          <div className="flex items-center space-x-2 pt-8">
            <Label>Recurring (All Days)</Label>
            <Switch checked={recurring} onCheckedChange={(v) => { setRecurring(v); setErrors((prev) => ({ ...prev, day: undefined })); }} />
          </div>
        </div>

        {errors.periods && (
          <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
            <AlertCircle size={14} /><span>{errors.periods}</span>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Classes & Breaks</h3>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => addPeriod("class")}><Plus className="mr-2 h-4 w-4" /> Add Class</Button>
              <Button size="sm" variant="outline" onClick={() => addPeriod("break")}><Plus className="mr-2 h-4 w-4" /> Add Break</Button>
            </div>
          </div>

          {periods.map((period, index) => (
            <div key={period.id} className={`p-4 rounded-lg border ${period.type === 'break' ? 'bg-red-50 border-red-200' : 'bg-indigo-50 border-indigo-200'}`}>
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">{period.type === 'break' ? 'Break' : 'Class'} {index + 1}</span>
                <Button variant="ghost" size="sm" onClick={() => removePeriod(period.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{period.type === 'break' ? 'Break Start Time' : 'Class Start Time'}</Label>
                  <Input type="time" value={period.startTime} onChange={(e) => updatePeriod(period.id, "startTime", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>{period.type === 'break' ? 'Break End Time' : 'Class End Time'}</Label>
                  <Input type="time" value={period.endTime} onChange={(e) => updatePeriod(period.id, "endTime", e.target.value)} />
                </div>
                {period.type === 'class' && (
                  <>
                    <div className="space-y-2">
                      <Label>Subject</Label>
                      <Input placeholder="e.g. Mathematics" value={period.subject} onChange={(e) => updatePeriod(period.id, "subject", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Teacher</Label>
                      <Select value={period.teacherId} onValueChange={(v) => updatePeriod(period.id, "teacherId", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Teacher" />
                        </SelectTrigger>
                        <SelectContent>
                          {TEACHERS.map((t) => (
                            <SelectItem key={t.userId} value={t.userId}>{t.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <Button className="w-full" onClick={handleSave} disabled={saved}>
          {saved ? (
            <><Check className="mr-2 h-4 w-4" /> Saved!</>
          ) : (
            "Save Routine"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
