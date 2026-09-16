import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownContentProps = {
  content: string;
};

export default function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => <h1 className="font-title text-4xl leading-tight text-white md:text-5xl">{children}</h1>,
        h2: ({ children }) => <h2 className="font-title mt-10 text-3xl leading-tight text-white md:text-4xl">{children}</h2>,
        h3: ({ children }) => <h3 className="font-title mt-8 text-2xl leading-tight text-white">{children}</h3>,
        p: ({ children }) => <p className="text-base leading-8 text-gray-200/90 md:text-lg">{children}</p>,
        ul: ({ children }) => <ul className="list-disc space-y-3 pl-6 text-base leading-8 text-gray-200/90 md:text-lg">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal space-y-3 pl-6 text-base leading-8 text-gray-200/90 md:text-lg">{children}</ol>,
        li: ({ children }) => <li>{children}</li>,
        a: ({ href, children }) => {
          if (!href) return <span>{children}</span>;

          const isInternal = href.startsWith("/") || href.startsWith("#");
          const className = "underline decoration-white/30 underline-offset-4 transition-colors hover:text-white";

          if (isInternal) {
            return (
              <Link href={href} className={className}>
                {children}
              </Link>
            );
          }

          return (
            <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
              {children}
            </a>
          );
        },
        img: ({ src, alt }) => {
          const isBadge = typeof src === "string" && src.includes("shields.io");

          return (
            <img
              src={src ?? ""}
              alt={alt ?? ""}
              loading="lazy"
              className={
                isBadge
                  ? "inline-block h-8 w-auto max-w-full align-middle md:h-9"
                  : "inline-block h-auto max-h-[24rem] max-w-full align-middle object-contain"
              }
            />
          );
        },
        table: ({ children }) => (
          <div className="overflow-x-auto rounded-[1.5rem] border border-white/10 bg-black/20">
            <table className="min-w-full border-collapse text-left text-sm text-gray-200/90 md:text-base">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => <thead className="bg-white/[0.04]">{children}</thead>,
        tbody: ({ children }) => <tbody>{children}</tbody>,
        tr: ({ children }) => <tr className="border-t border-white/10">{children}</tr>,
        th: ({ children }) => (
          <th className="px-4 py-3 font-plex-mono text-xs uppercase tracking-[0.18em] text-sky-100/90 md:px-5">
            {children}
          </th>
        ),
        td: ({ children }) => <td className="px-4 py-3 align-top leading-7 md:px-5">{children}</td>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-sky-200/50 pl-5 italic text-gray-200/85">
            {children}
          </blockquote>
        ),
        hr: () => <hr className="border-white/10" />,
        code: ({ className, children }) => {
          const codeText = String(children).replace(/\n$/, "");
          const isBlockCode = Boolean(className) || codeText.includes("\n");

          if (!isBlockCode) {
            return <code className="rounded bg-white/8 px-2 py-1 font-plex-mono text-sm text-sky-100">{children}</code>;
          }

          return (
            <code className={["font-plex-mono text-sm text-gray-100", className].filter(Boolean).join(" ")}>
              {codeText}
            </code>
          );
        },
        pre: ({ children }) => (
          <pre className="overflow-x-auto rounded-2xl border border-white/10 bg-black/35 p-4 font-plex-mono text-sm text-gray-100">
            {children}
          </pre>
        ),
        strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
