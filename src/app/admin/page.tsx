import { getAllBlogs } from "@/lib/blogs";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminBlogList from "@/components/admin-blog-list";
export const revalidate = 0;
export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/login");
  }
  const blogs = await getAllBlogs();
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="border-b border-border pb-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your blog's posts, drafts, and settings.
          </p>
        </div>
      </div>
      <AdminBlogList initialBlogs={blogs} userEmail={session.user.email || ""} />
    </div>
  );
}
