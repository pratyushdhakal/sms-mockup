import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function CategoryManager() {
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
              <Input id="category-name" placeholder="eg: Project Work" />
            </div>
            <Button>Submit</Button>
          </TabsContent>
          <TabsContent value="list">
            <p className="text-sm text-muted-foreground">Category list content placeholder.</p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
