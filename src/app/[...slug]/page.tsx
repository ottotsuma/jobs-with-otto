// app/[...slug]/page.tsx
import { redirect } from "next/navigation";

export default function CatchAllSlug({
  params,
}: {
  params: { slug: string[] };
}) {
  const { slug } = params;

  // If the slug is empty, assume home page
  if (!slug.length) {
    redirect("/en"); // Redirect to home in default locale
    return; // Prevent rendering anything
  }

  // If the first segment of the slug does not start with a locale
  if (slug[0] !== "en" && slug[0] !== "ja") {
    // Redirect to the same path with the default locale
    const newPath = `/en/${slug.join("/")}`; // or `/ja/${slug.join('/')}`
    redirect(newPath);
    return; // Prevent rendering anything
  }

  // If locale is properly defined, return null or render the actual content for valid routes
  return null; // Render your fallback or component logic here if necessary
}
