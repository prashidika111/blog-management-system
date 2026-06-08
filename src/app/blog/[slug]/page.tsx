import { getBlogBySlug } from "@/lib/blogs";
import MarkdownRenderer from "@/components/markdown-renderer";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
export const revalidate = 0;
interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) {
    return {
      title: "Blog Post Not Found | BlogPage",
    };
  }
  return {
    title: `${blog.title} | BlogPage`,
    description: blog.excerpt,
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) {
    notFound();
  }
  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <div style={{maxWidth: 720, margin: '40px auto', padding: '0 16px'}}>
      <div style={{marginBottom: 16}}>
        <Link href="/blog">← Back to articles</Link>
      </div>
      <h1 style={{fontSize: 26, marginBottom: 6}}>{blog.title}</h1>
      <div style={{color: '#666', fontSize: 13, marginBottom: 18}}>
        {blog.author.email} • {formattedDate}
      </div>
      <div>
        <MarkdownRenderer content={blog.content} />
      </div>
    </div>
  );
}
