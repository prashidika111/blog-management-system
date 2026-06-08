import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "BlogPage",
  description:"This is a demo blog website",
  keywords: ["Next.js", "TypeScript", "Tailwind CSS", "Developer Blog"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="flex min-h-screen flex-col bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
        <TooltipProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <footer className="border-t border-border bg-card/50 py-8 text-center text-sm text-muted-foreground">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <p> Footer </p>
            </div>
          </footer>
        </TooltipProvider>
      </body>
    </html>
  );
}
