// components/BlogSchema.tsx

import { HOST, SITE_NAME } from "@/lib/constants/constants";

interface Author {
  name?: string;
  url?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
}

// ✅ must be defined before the component
function buildSameAs(author?: Author): string[] {
  return [
    author?.linkedin,
    author?.twitter,
    author?.facebook,
    author?.instagram,
  ].filter(Boolean) as string[];
}

interface BlogSchemaProps {
  slug: string;
  title: string;
  description: string;
  image?: string;
  author?: Author;
  datePublished: string;
  dateModified?: string;
  breadcrumbs: { label: string; redirectionUrl: string | null }[];
}

export default function BlogSchema({
  slug,
  title,
  description,
  image,
  author,
  datePublished,
  dateModified,
  breadcrumbs,
}: BlogSchemaProps) {
  const pageUrl = `https://village.trendswe.com/blog/${slug}`;
  const resolvedImage = image || `${HOST}/images/default-share.jpg`;

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    image: resolvedImage,
    url: pageUrl,
    author: {
      "@type": "Person",
      name: author?.name ?? "Village Trends",
      // url = primary website only
      ...(author?.url ? { url: author.url } : {}),
      // social profiles go in sameAs
      ...(buildSameAs(author).length > 0
        ? { sameAs: buildSameAs(author) }
        : {}),
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: "https://www.google.com/s2/favicons?domain=trendswe.com&sz=128",
      },
    },
    datePublished,
    dateModified: dateModified ?? datePublished,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.redirectionUrl
        ? { item: `https://village.trendswe.com${item.redirectionUrl}` }
        : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
