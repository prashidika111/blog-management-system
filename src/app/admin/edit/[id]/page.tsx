import { getBlogById } from "@/lib/blogs";
import EditBlogClient from "./edit-client";
import { notFound } from "next/navigation";
export const revalidate = 0; 
interface PageProps 
{
  params: Promise<{
    id: string;
  }>;
}
export default async function EditBlogPage({ params }: PageProps) 
{
  const { id } = await params;
  const blog = await getBlogById(id);
  if (!blog) 
  {
    notFound();
  }
  return <EditBlogClient blog={blog} />;
}
