"use client";
import { useState, useEffect } from "react";
import MarkdownRenderer from "./markdown-renderer";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Card, CardContent } from "@/components/ui/card";
type Props = {
  initialData?: {
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    published?: boolean;
    tags?: string[];
  };
  submitLabel: string;
  onSubmit: (data: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    published: boolean;
    tags?: string[];
    images: string[];
  }) => Promise<void>;
  isLoading?: boolean;
};
export default function BlogForm({
  initialData,
  submitLabel,
  onSubmit,
  isLoading,
}: Props) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [published, setPublished] = useState(initialData?.published ?? true);
  const [tags, setTags] = useState((initialData?.tags ?? []).join(", "));
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageIds, setImageIds] = useState<string[]>([]);
  const uploadImageAndInsert = async (file: File, altText: string) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();

      setImageIds((prev) => [...prev, data.id]);

      setContent((prev) => prev + `\n![${altText}](${data.url})\n`);
    } catch (err) {
      setError("Failed to upload image.");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };
  const uploadUrlAndInsert = async (url: string, altText: string) => {
    setIsUploading(true);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();

      setImageIds((prev) => [...prev, data.id]);

      setContent((prev) => prev + `\n![${altText}](${data.url})\n`);
    } catch (err) {
      setError("Failed to upload URL image.");
      console.error(err);
      setContent((prev) => prev + `\n![${altText}](${url})\n`);
    } finally {
      setIsUploading(false);
    }
  };
  useEffect(() => {
    if (!slug && title) {
      setSlug(
        title
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^\w\-]+/g, ""),
      );
    }
  }, [title]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title || !slug || !excerpt || !content) {
      setError("All fields are required.");
      return;
    }
    const parsedTags = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    await onSubmit({
      title,
      slug,
      excerpt,
      content,
      published,
      tags: parsedTags,
      images: imageIds,
    });
  };
  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        e.preventDefault();
        const file = items[i].getAsFile();
        if (file) {
          await uploadImageAndInsert(file, "Pasted Image");
        }
        break;
      }
    }
  };
  return (
    <Card className="shadow-sm">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Slug</label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Excerpt</label>
            <Textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Tags (comma separated)
            </label>
            <Input value={tags} onChange={(e) => setTags(e.target.value)} />
          </div>
          <div className="space-y-4">
            <div className="flex gap-2 items-center flex-wrap">
              <Button
                type="button"
                variant={tab === "write" ? "default" : "outline"}
                onClick={() => setTab("write")}
              >
                Write
              </Button>
              <Button
                type="button"
                variant={tab === "preview" ? "default" : "outline"}
                onClick={() => setTab("preview")}
              >
                Preview
              </Button>
              <div className="ml-auto flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={async () => {
                    const url = prompt("Enter image URL:");
                    if (url) await uploadUrlAndInsert(url, "Image");
                  }}
                  disabled={isUploading}
                >
                  Add Image URL
                </Button>
                <label
                  className={`cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
                >
                  {isUploading ? "Uploading..." : "Upload Image"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={isUploading}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        await uploadImageAndInsert(file, "Uploaded Image");
                      }
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>
            </div>
            {tab === "write" ? (
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onPaste={handlePaste}
                rows={12}
                className="font-mono text-sm"
              />
            ) : (
              <div className="min-h-[200px] border border-border rounded-md p-6 bg-muted/20">
                {content.trim() ? (
                  <MarkdownRenderer content={content} />
                ) : (
                  <div className="text-muted-foreground text-sm">
                    Nothing to preview.
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-border mt-6">
            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
              />
              Publish
            </label>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : submitLabel}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
