import { notFound, redirect } from "next/navigation";
import { getLinkByCode } from "@/lib/db";
import { RESERVED_CODES } from "@/lib/utils";

interface RedirectPageProps {
  params: Promise<{
    code: string;
  }>;
}

export default async function RedirectPage({ params }: RedirectPageProps) {
  const { code } = await params;

  // Protect against reserved routes or empty code
  if (!code || RESERVED_CODES.has(code.toLowerCase())) {
    notFound();
  }

  try {
    const link = await getLinkByCode(code);
    if (!link) {
      notFound();
    }

    // Perform HTTP redirect to the destination URL
    redirect(link.url);
  } catch (error) {
    // If redirect() was called, rethrow it so Next.js handles the redirect response
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof (error as { digest?: string }).digest === "string" &&
      (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    console.error("Error resolving short code:", error);
    notFound();
  }
}
