"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import BlogForm from "@/components/blog-form";
import { createBlogAction } from "@/app/admin/actions";
import Link from "next/link";
export default function CreateBlogPage() 
{
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const handleCreateSubmit = async (data: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    tags?: string[];
    published: boolean;
  }) => {
    setIsLoading(true);
    setError(null);
    try 
    {
      const result = await createBlogAction(data);
      if (result.success) 
      {
        router.push("/admin");
        router.refresh();
      } 
      else 
      {
        setError(result.error || "Failed to create blog post. Check if the URL slug is already taken.");
      }
    } 
    catch (err) 
    {
      setError("An unexpected error occurred. Please try again.");
    } 
    finally 
    {
      setIsLoading(false);
    }
  };
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto mb-8 flex flex-col gap-4">
        <Link 
          href="/admin" 
          className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-primary transition-colors gap-1"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Create New Post
        </h1>
        <p className="text-sm text-muted-foreground">
          Write and format your article. Save as draft or publish immediately to the public feed.
        </p>
      </div>
      {error && (
        <div className="max-w-4xl mx-auto mb-6 rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive flex items-center gap-2">
          <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <span>{error}</span>
        </div>
      )}
      <BlogForm
        submitLabel="Publish Post"
        onSubmit={handleCreateSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
