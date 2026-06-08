"use server";
import { createBlog, updateBlog, deleteBlog } from "@/lib/blogs";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
export async function deleteBlogAction(id: string) {
  try {
    await deleteBlog(id);
    revalidatePath("/admin");
    revalidatePath("/blog");
    return { success: true };
  } catch (error) {
    console.error("Delete action failed:", error);
    return { success: false, error: "Failed to delete blog post." };
  }
}

export async function createBlogAction(data: {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags?: string[];
  published: boolean;
  images: string[];
})
{
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized access" };
    }
    const authorId = (session.user as any).id;
    if (!authorId) {
      return { success: false, error: "Invalid author session" };
    }
    const newBlog = await createBlog({...data,
      authorId,
    });
    revalidatePath("/admin");
    revalidatePath("/blog");
    return { success: true };
  } catch (error: any) {
    console.error("Create action failed:", error);
    return { success: false, error: error.message || "Failed to create blog post." };
  }
}

export async function updateBlogAction(
  id: string,
  data: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    tags?: string[];
    published: boolean;
  }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized access" };
    }

    await updateBlog(id, data);

    revalidatePath("/admin");
    revalidatePath("/blog");
    revalidatePath(`/blog/${data.slug}`);

    return { success: true };
  } catch (error: any) {
    console.error("Update action failed:", error);
    return { success: false, error: error.message || "Failed to update blog post." };
  }
}
