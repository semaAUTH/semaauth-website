import type { Metadata } from "next";

type PageMetadataOptions = {
  title: string;
  description: string;
  path?: string;
  noIndex?: boolean;
};

export function pageMetadata({
  title,
  description,
  path,
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const url = path ? `https://semaauth.com${path}` : undefined;

  return {
    title,
    description,
    ...(noIndex && { robots: { index: false, follow: false } }),
    openGraph: {
      title: `${title} | semaAUTH`,
      description,
      ...(url && { url }),
      siteName: "semaAUTH",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | semaAUTH`,
      description,
    },
  };
}
