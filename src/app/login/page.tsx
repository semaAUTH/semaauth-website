import { Suspense } from "react";
import { LoginPageContent } from "@/components/auth/login-page-content";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Sign in",
  description: "Sign in to the semaAUTH admin console.",
  path: "/login",
  noIndex: true,
});

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageContent />
    </Suspense>
  );
}
