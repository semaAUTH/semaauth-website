"use client";

import { SemaAuthProvider } from "@semaauth/sdk-web";
import type { ReactNode } from "react";
import { BFF_PATHS } from "@/lib/semaauth/config";

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SemaAuthProvider
      refreshUrl={BFF_PATHS.refresh}
      sessionUrl={BFF_PATHS.session}
      logoutUrl={BFF_PATHS.logout}
    >
      {children}
    </SemaAuthProvider>
  );
}
