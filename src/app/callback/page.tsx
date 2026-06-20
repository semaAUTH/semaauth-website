import { Suspense } from "react";
import { CallbackPageContent } from "@/components/auth/callback-page-content";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Signing in",
  description: "Completing semaAUTH sign-in.",
  noIndex: true,
});

export default function CallbackPage() {
  return (
    <Suspense>
      <CallbackPageContent />
    </Suspense>
  );
}
