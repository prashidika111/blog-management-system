"use client";
import { useMemo, useState } from "react";
import BlogCard from "./blog-card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem 
} from "@/components/ui/pagination";
import { Search } from "lucide-react";

type Blog = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags?: string[];
  published: boolean;
  createdAt: string;
  author: { id: string; email: string };
};

export default function BlogListClient({ initialBlogs }: { initialBlogs: Blog[] }) {
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const allTags = useMemo(() => {
    const s = new Set<string>();
    initialBlogs.forEach((b) => (b.tags || []).forEach((t) => s.add(t)));
    return Array.from(s).sort();
  }, [initialBlogs]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = initialBlogs;
    if (selectedTag) {
      list = list.filter((b) => (b.tags || []).includes(selectedTag));
    }
    if (q) {
      list = list.filter((b) => {
        return (
          b.title.toLowerCase().includes(q) ||
          b.excerpt.toLowerCase().includes(q) ||
          b.content.toLowerCase().includes(q) ||
          (b.tags || []).some((t) => t.toLowerCase().includes(q))
        );
      });
    }
    return list;
  }, [initialBlogs, query, selectedTag]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleTagClick = (t: string | null) => {
    setPage(1);
    setSelectedTag(t);
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Blog</h1>
        <p className="mt-4 text-lg text-muted-foreground"></p>
      </div>

      <div className="relative max-w-lg mx-auto mb-8">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <Input
          type="text"
          placeholder="Search articles..."
          className="pl-10 h-12 text-base rounded-xl"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(1); }}
        />
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-10">
        <Badge
          variant={selectedTag === null ? "default" : "outline"}
          className="cursor-pointer text-sm py-1 px-3"
          onClick={() => handleTagClick(null)}
        >
          All
        </Badge>
        {allTags.map((t) => (
          <Badge
            key={t}
            variant={selectedTag === t ? "default" : "outline"}
            className="cursor-pointer text-sm py-1 px-3"
            onClick={() => handleTagClick(t)}
          >
            {t}
          </Badge>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
          No posts match your search or filter.
        </div>
      ) : (
        <div className="space-y-6">
          {current.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-10">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button 
                  variant="ghost" 
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
              </PaginationItem>
              <PaginationItem>
                <span className="text-sm text-muted-foreground px-4">
                  Page {page} of {totalPages}
                </span>
              </PaginationItem>
              <PaginationItem>
                <Button 
                  variant="ghost" 
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
