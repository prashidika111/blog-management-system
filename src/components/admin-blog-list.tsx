"use client";
import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { deleteBlogAction } from "@/app/admin/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminBlogList({ initialBlogs, userEmail }: any) {
  const [blogs, setBlogs] = useState(initialBlogs || []);
  const handleLogout = async () => await signOut({ callbackUrl: "/" });
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    const res = await deleteBlogAction(id);
    if (res.success) setBlogs(blogs.filter((b: any) => b.id !== id));
    else alert(res.error || "Failed to delete");
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-6 border-b border-border mb-4 space-y-0">
        <div>
          <CardTitle className="text-xl">Your Posts</CardTitle>
          <div className="text-sm text-muted-foreground mt-1">Logged in as {userEmail}</div>
        </div>
        <div className="flex items-center gap-4">
          <Button render={<Link href="/admin/create" />} variant="default">
            Create New Post
          </Button>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {blogs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-xl bg-muted/20">
            No posts found. Create your first one.
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogs.map((b: any) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium">{b.title}</TableCell>
                    <TableCell>{new Date(b.createdAt).toDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button render={<Link href={`/admin/edit/${b.id}`} />} variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(b.id)}>Delete</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
