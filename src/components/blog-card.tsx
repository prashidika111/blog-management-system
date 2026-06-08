import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BlogCardProps {
  blog: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    createdAt: string;
    tags?: string[];
    author: {
      email: string;
    };
  };
}

export default function BlogCard({ blog }: BlogCardProps) {
  const date = new Date(blog.createdAt).toDateString();
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">
          <Link href={`/blog/${blog.slug}`} className="hover:underline">
            {blog.title}
          </Link>
        </CardTitle>
        <CardDescription>
          {date} • {blog.author.email}
        </CardDescription>
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {blog.tags.map((t) => (
              <Badge key={t} variant="secondary">
                {t}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{blog.excerpt}</p>
      </CardContent>
    </Card>
  );
}
