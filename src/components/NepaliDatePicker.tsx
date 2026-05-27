import { useState, useCallback, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import NepaliDate, { yearMonthDays } from "@zener/nepali-date";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const MONTHS_BS = [
  "Baisakh", "Jestha", "Ashad", "Shrawan",
  "Bhadra", "Ashwin", "Kartik", "Mangsir",
  "Poush", "Magh", "Falgun", "Chaitra",
];

const WEEKDAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDaysInMonth(bsYear: number, bsMonth: number): number {
  const idx = bsYear - 2000;
  if (idx >= 0 && idx < yearMonthDays.length && yearMonthDays[idx]) {
    return yearMonthDays[idx][bsMonth] ?? 31;
  }
  return 31;
}

interface NepaliDatePickerProps {
  value: string;
  onChange: (bsDate: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function NepaliDatePicker({
  value,
  onChange,
  placeholder = "Select date",
  disabled,
}: NepaliDatePickerProps) {
  const [open, setOpen] = useState(false);
  const todayRef = useRef(new NepaliDate());

  const parsed = parseBsDate(value);
  const [viewYear, setViewYear] = useState(parsed?.year ?? todayRef.current.getFullYear() as number);
  const [viewMonth, setViewMonth] = useState(parsed?.month ?? todayRef.current.getMonth() as number);

  useEffect(() => {
    if (open) {
      const p = parseBsDate(value);
      setViewYear(p?.year ?? todayRef.current.getFullYear() as number);
      setViewMonth(p?.month ?? todayRef.current.getMonth() as number);
    }
  }, [open, value]);

  const todayYear = todayRef.current.getFullYear() as number;
  const todayMonth = todayRef.current.getMonth() as number;
  const todayDate = todayRef.current.getDate() as number;

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = new NepaliDate(viewYear, viewMonth, 1).getDay() as number;

  const handlePrevMonth = useCallback(() => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  }, [viewMonth]);

  const handleNextMonth = useCallback(() => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  }, [viewMonth]);

  const handleSelect = useCallback(
    (day: number) => {
      const y = String(viewYear);
      const m = String(viewMonth + 1).padStart(2, "0");
      const d = String(day).padStart(2, "0");
      onChange(`${y}-${m}-${d}`);
      setOpen(false);
    },
    [viewYear, viewMonth, onChange]
  );

  const handleToday = useCallback(() => {
    const t = new NepaliDate();
    const y = t.getFullYear() as number;
    const m = t.getMonth() as number;
    const d = t.getDate() as number;
    const ys = String(y);
    const ms = String(m + 1).padStart(2, "0");
    const ds = String(d).padStart(2, "0");
    onChange(`${ys}-${ms}-${ds}`);
    setOpen(false);
  }, [onChange]);

  const displayText = value
    ? formatBsDisplay(value)
    : "";

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const selectedParsed = parseBsDate(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal h-9 px-3",
            !value && "text-muted-foreground"
          )}
        >
          <Calendar size={14} className="mr-2 shrink-0" />
          {displayText || placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        <div className="p-3">
          <div className="flex items-center justify-between mb-3">
            <Button variant="ghost" size="icon" onClick={handlePrevMonth} className="h-7 w-7">
              <ChevronLeft size={14} />
            </Button>
            <div className="text-sm font-medium">
              {MONTHS_BS[viewMonth]} {viewYear}
            </div>
            <Button variant="ghost" size="icon" onClick={handleNextMonth} className="h-7 w-7">
              <ChevronRight size={14} />
            </Button>
          </div>
          <div className="grid grid-cols-7 gap-0 text-center mb-1">
            {WEEKDAYS_SHORT.map((w) => (
              <div key={w} className="text-xs text-muted-foreground h-7 leading-7">
                {w}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-0">
            {cells.map((cell, i) => {
              if (cell === null) {
                return <div key={`empty-${i}`} className="h-7 w-full" />;
              }
              const isToday =
                cell === todayDate && viewMonth === todayMonth && viewYear === todayYear;
              const isSelected =
                selectedParsed &&
                cell === selectedParsed.date &&
                viewMonth === selectedParsed.month &&
                viewYear === selectedParsed.year;
              return (
                <button
                  key={`day-${cell}`}
                  onClick={() => handleSelect(cell)}
                  className={cn(
                    "h-7 w-full text-sm rounded hover:bg-accent transition-colors",
                    isToday && "font-semibold text-primary",
                    isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                  )}
                >
                  {cell}
                </button>
              );
            })}
          </div>
          <div className="mt-2 pt-2 border-t flex justify-center">
            <button
              onClick={handleToday}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Today: {formatBsDisplay(formatNepaliDate(todayYear, todayMonth, todayDate))}
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function parseBsDate(value: string): { year: number; month: number; date: number } | null {
  if (!value) return null;
  const parts = value.split("-");
  if (parts.length !== 3) return null;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const date = parseInt(parts[2], 10);
  if (isNaN(year) || isNaN(month) || isNaN(date)) return null;
  return { year, month, date };
}

function formatBsDisplay(value: string): string {
  const p = parseBsDate(value);
  if (!p) return value;
  const monthName = MONTHS_BS[p.month] || "";
  return `${monthName} ${p.date}, ${p.year}`;
}

function formatNepaliDate(year: number, month: number, day: number): string {
  const y = String(year);
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
