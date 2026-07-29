import React from "react";
import type { Metadata } from "next";
import { ShortenForm } from "@/components/shorten-form";
import { BloodMoonBackground } from "@/components/blood-moon-bg";

export const metadata: Metadata = {
  title: "Crimson Blood Moon | Production URL Shortener",
  description:
    "Eclipsing long links in shadow. Transform unruly URLs into clean, permanent short links with zero friction. Secured in Neon PostgreSQL.",
  openGraph: {
    title: "Crimson Blood Moon | Production URL Shortener",
    description:
      "Transform unruly URLs into clean, permanent short links with zero friction. Secured in Neon PostgreSQL.",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <div className="relative min-h-[calc(100vh-130px)] flex flex-col items-center justify-center py-12 px-4 sm:px-6">
      <BloodMoonBackground />
      <ShortenForm />
    </div>
  );
}
