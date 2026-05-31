import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

interface Category {
  id: string;
  name: string;
}

export function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([
    { id: "CAT001", name: "Homework" },
    { id: "CAT002", name: "Classwork" },
    { id: "CAT003", name: "Project Work" },
    { id: "CAT004", name: "Lab Report" },
  ]);
  const [newName, setNewName] = useState("");

  function handleAdd() {
    if (!newName.trim()) return;
    const id = `CAT${String(categories.length + 1).padStart(3, "0")}`;
    setCategories((prev) => [...prev, { id, name: newName.trim() }]);
    setNewName("");
  }

  function handleDelete(id: string) {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <Tabs defaultValue="add" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="add">Add Assignment Category</TabsTrigger>
            <TabsTrigger value="list">Assignment Categories</TabsTrigger>
          </TabsList>
          <TabsContent value="add" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="category-name">Assignment Category Name</Label>
              <Input id="category-name" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="eg: Project Work" onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }} />
            </div>
            <Button onClick={handleAdd} disabled={!newName.trim()}>Submit</Button>
          </TabsContent>
          <TabsContent value="list" className="mt-6">
            {categories.length === 0 ? (
              <p className="text-sm text-muted-foreground">No categories defined.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Category Name</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((c, idx) => (
                    <TableRow key={c.id}>
                      <TableCell className="text-xs text-muted-foreground">{idx + 1}</TableCell>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDelete(c.id)}>
                          <Trash2 size={13} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
