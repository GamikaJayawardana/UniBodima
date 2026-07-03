import { cache } from "react";
import type { Metadata } from "next";
import { getPostSeo } from "@/app/actions/postActions";
import PostDetailClient from "./PostDetailClient";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.boardingfor.me";

// Deduped across generateMetadata + the page render within one request.
const loadPost = cache(async (id: string) => getPostSeo(id));

function stripToText(input: string, max = 160): string {
  const clean = (input || "").replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const result = await loadPost(id);

  if (!result.success || !result.post) {
    return {
      title: "Listing Not Found",
      description: "This boarding listing is no longer available on BoardingFor.me.",
      robots: { index: false, follow: false },
    };
  }

  const post = result.post;
  const isOffer = post.type === "offer";
  const priceLabel = isOffer
    ? `LKR ${Number(post.price || 0).toLocaleString()}/month`
    : `Budget LKR ${Number(post.budgetRange?.min || 0).toLocaleString()} - ${Number(
        post.budgetRange?.max || 0
      ).toLocaleString()}`;

  const locationBits = [post.district, post.targetUniversity].filter(Boolean).join(", ");
  const title = `${post.title}${locationBits ? ` — ${locationBits}` : ""}`;
  const description = stripToText(
    post.description ||
      `${isOffer ? "Boarding place" : "Boarding request"} near ${
        post.targetUniversity || "your university"
      } in Sri Lanka. ${priceLabel}.`
  );
  const url = `${SITE_URL}/posts/${id}`;
  const image = Array.isArray(post.images) && post.images[0] ? post.images[0] : undefined;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await loadPost(id);
  const post = result.success ? result.post : null;

  const jsonLd = post
    ? {
        "@context": "https://schema.org",
        "@type": post.type === "offer" ? "Product" : "Thing",
        name: post.title,
        description: stripToText(post.description || "", 300),
        image: Array.isArray(post.images) ? post.images : undefined,
        url: `${SITE_URL}/posts/${id}`,
        ...(post.type === "offer"
          ? {
              category: "Student Accommodation",
              offers: {
                "@type": "Offer",
                price: Number(post.price || 0),
                priceCurrency: "LKR",
                availability: "https://schema.org/InStock",
                url: `${SITE_URL}/posts/${id}`,
              },
              areaServed: post.targetUniversity,
            }
          : {}),
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <PostDetailClient id={id} initialPost={post} />
    </>
  );
}
