import ReactMarkdown, { defaultUrlTransform } from "react-markdown";
interface MarkdownRendererProps 
{
  content: string;
}
export default function MarkdownRenderer({ content }: MarkdownRendererProps) 
{
  return (
    <div className="markdown-content">
      <ReactMarkdown
        urlTransform={(value: string) => {
          if (value.startsWith("data:image/")) return value;
          return defaultUrlTransform(value);
        }}
        components={{
          h1: ({ ...props }) => (
            <h1 className="mt-8 mb-4 text-3xl font-extrabold tracking-tight text-card-foreground sm:text-4xl" {...props} />
          ),
          h2: ({ ...props }) => (
            <h2 className="mt-8 mb-4 text-2xl font-bold tracking-tight text-card-foreground border-b border-border pb-2" {...props} />
          ),
          h3: ({ ...props }) => (
            <h3 className="mt-6 mb-3 text-xl font-semibold text-card-foreground" {...props} />
          ),
          p: ({ ...props }) => (
            <p className="mb-5 text-base leading-8 text-muted-foreground" {...props} />
          ),
          ul: ({ ...props }) => (
            <ul className="mb-6 list-disc pl-6 space-y-2 text-muted-foreground" {...props} />
          ),
          ol: ({ ...props }) => (
            <ol className="mb-6 list-decimal pl-6 space-y-2 text-muted-foreground" {...props} />
          ),
          li: ({ ...props }) => (
            <li className="text-base leading-7" {...props} />
          ),
          blockquote: ({ ...props }) => (
            <blockquote className="my-6 border-l-4 border-primary pl-4 italic text-muted-foreground bg-muted/30 py-1 pr-2 rounded-r-md" {...props} />
          ),
          a: ({ ...props }) => (
            <a className="font-semibold text-primary underline underline-offset-4 hover:text-primary/80 transition-colors" {...props} />
          ),
          code: ({ className, children, ...props }) => {
            const isBlock = className && className.includes("language-");
            if (isBlock) {
              return (
                <pre className="my-6 overflow-x-auto rounded-xl border border-border bg-muted/80 p-5 font-mono text-sm leading-6 text-foreground">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              );
            }
            return (
              <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-sm text-foreground border border-border" {...props}>
                {children}
              </code>
            );
          },
          img: ({ ...props }) => (
            <img className="max-w-full h-auto rounded-lg my-6 border border-border mx-auto" alt={props.alt || "Blog Image"} {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
