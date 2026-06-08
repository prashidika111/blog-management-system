import prisma from "@/lib/prisma";
type Author = { id: string; email: string };
type Blog = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags?: string[];
  published: boolean;
  createdAt: string;
  author: Author;
};
function mapPrismaBlog(blog: any): Blog {
  return {
    ...blog,
    tags: blog.tags ? blog.tags.split(",") : [],
    createdAt: blog.createdAt.toISOString(),
    author: {
      id: blog.authorId,
      email: "admin@devblog.com",
    },
  };
}
export async function getPublishedBlogs() {
  const blogs = await prisma.blog.findMany({
    where: {
      published: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return blogs.map(mapPrismaBlog);
}

export async function getBlogBySlug(slug: string) {
  const blog = await prisma.blog.findUnique({
    where: {
      slug,
    },
  });

  return blog ? mapPrismaBlog(blog) : null;
}

export async function getAllBlogs() {
  const blogs = await prisma.blog.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return blogs.map(mapPrismaBlog);
}

export async function getBlogById(id: string) {
  const blog = await prisma.blog.findUnique({
    where: {
      id,
    },
  });

  return blog ? mapPrismaBlog(blog) : null;
}

export async function createBlog(data: {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags?: string[];
  published: boolean;
  authorId: string;
  images: string[];
}) {
  const newBlog = await prisma.blog.create({
    data: {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      tags: data.tags ? data.tags.join(",") : "",
      published: data.published,
      authorId: data.authorId,

      images: {
        create: data.images.map((imageId) => ({
          imageId,
        })),
      },
    },
  });

  return mapPrismaBlog(newBlog);
}

export async function updateBlog(
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
  const updatedBlog = await prisma.blog.update({
    where: {
      id,
    },
    data: {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      tags: data.tags ? data.tags.join(",") : undefined,
      published: data.published,
    },
  });

  return mapPrismaBlog(updatedBlog);
}

export async function deleteBlog(id: string) {
  const blog = await prisma.blog.findUnique({
    where: { id },
    include: {
      images: {
        include: {
          image: true,
        },
      },
    },
  });

  if (!blog) {
    return null;
  }

  const imageIds = blog.images.map((relation) => relation.imageId);

  await prisma.blog.delete({
    where: {
      id,
    },
  });

  if (imageIds.length > 0) {
    await prisma.image.deleteMany({
      where: {
        id: {
          in: imageIds,
        },
      },
    });
  }

  return mapPrismaBlog(blog);
}
