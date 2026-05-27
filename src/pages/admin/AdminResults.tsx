import { useState } from "react";
import { Search, Plus } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../../components/ui/table";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import Header from "../../layouts/Header";
import AddResult from "./AddResult";

export default function AdminResults() {
  const [view, setView] = useState<"list" | "add">("list");
  const [results] = useState([]);

  if (view === "add") {
    return <AddResult onBack={() => setView("list")} />;
  }

  return (
    <div>
      <Header title="Exam Results" />

      <div className="rounded-lg border bg-card">
        <div className="flex items-center justify-between p-3 border-b">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search exams..." className="pl-8 h-8 w-64 text-sm" />
          </div>
          <Button size="sm" onClick={() => setView("add")}>
            <Plus size={14} className="mr-2" /> Add Result
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center text-muted-foreground">
                  No data
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
