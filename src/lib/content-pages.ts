import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const contentPagesDirectory = path.join(process.cwd(), "content", "pages");

type ContentPageFrontmatter = {
  title?: string;
  description?: string;
  eyebrow?: string;
  backHref?: string;
  showRepositoryReadmeNotice?: boolean;
  download?: {
    label?: string;
    href?: string;
    fileName?: string;
  };
};

export type ContentPageDownload = {
  label: string;
  href: string;
  fileName?: string;
};

export type ContentPage = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  backHref: string;
  showRepositoryReadmeNotice: boolean;
  download: ContentPageDownload | null;
  body: string;
};

async function readContentPageFilenames() {
  try {
    const entries = await fs.readdir(contentPagesDirectory, { withFileTypes: true });

    return entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
      .map((entry) => entry.name);
  } catch {
    return [];
  }
}

export async function getContentPageSlugs() {
  const filenames = await readContentPageFilenames();
  return filenames.map((filename) => filename.replace(/\.md$/, ""));
}

export async function getContentPageBySlug(slug: string): Promise<ContentPage | null> {
  const filePath = path.join(contentPagesDirectory, `${slug}.md`);

  try {
    const fileContents = await fs.readFile(filePath, "utf8");
    const { data, content } = matter(fileContents);
    const frontmatter = data as ContentPageFrontmatter;
    const download =
      frontmatter.download?.href
        ? {
            label: frontmatter.download.label ?? "Download",
            href: frontmatter.download.href,
            fileName: frontmatter.download.fileName,
          }
        : null;

    return {
      slug,
      title: frontmatter.title ?? slug,
      description: frontmatter.description ?? "",
      eyebrow: frontmatter.eyebrow ?? "Page",
      backHref: frontmatter.backHref ?? "/",
      showRepositoryReadmeNotice: frontmatter.showRepositoryReadmeNotice ?? false,
      download,
      body: content.trim(),
    };
  } catch {
    return null;
  }
}
