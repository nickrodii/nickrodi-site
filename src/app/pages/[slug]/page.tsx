import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NavBar from "@/components/navigation";
import ContentPagePanel from "@/components/content-page-panel";
import MarkdownContent from "@/components/markdown-content";
import { getContentPageBySlug, getContentPageSlugs } from "@/lib/content-pages";

type ContentPageRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const slugs = await getContentPageSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ContentPageRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getContentPageBySlug(slug);

  if (!page) {
    return {
      title: "Page Not Found",
    };
  }

  return {
    title: page.title,
    description: page.description,
  };
}

export default async function ContentPageRoute({ params }: ContentPageRouteProps) {
  const { slug } = await params;
  const page = await getContentPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <>
      <NavBar anchorPrefix="/" />
      <main className="mx-auto min-h-screen w-full max-w-[90rem] px-4 pb-20 pt-24 sm:px-6 sm:pb-24 sm:pt-28 md:px-10 xl:px-16">
        <ContentPagePanel
          slug={page.slug}
          title={page.title}
          eyebrow={page.eyebrow}
          description={page.description}
          backHref={page.backHref}
          showRepositoryReadmeNotice={page.showRepositoryReadmeNotice}
          download={page.download}
        >
          <MarkdownContent content={page.body} />
        </ContentPagePanel>
      </main>
    </>
  );
}
