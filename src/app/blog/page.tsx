import { getPublishedBlogs } from "@/lib/blogs";
import BlogListClient from "@/components/blog-list-client";
export const revalidate = 0;
export default async function BlogListPage() {
  const blogs = await getPublishedBlogs();
  return (
    <BlogListClient initialBlogs={blogs} />
  );
}
