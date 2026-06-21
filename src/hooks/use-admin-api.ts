"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAccessToken } from "@semaauth/sdk-web";
import {
  getTenantSettings,
  listAuditEvents,
  listClients,
  listUsers,
  createClient,
  patchTenantSettings,
  revokeUserSessions,
} from "@/lib/semaauth/admin-client";

export function useAdminUsers() {
  const accessToken = useAccessToken();

  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => listUsers(accessToken!, { limit: 100 }),
    enabled: Boolean(accessToken),
  });
}

export function useAdminAuditEvents(params?: { event_type?: string; limit?: number }) {
  const accessToken = useAccessToken();

  return useQuery({
    queryKey: ["admin", "audit-events", params?.event_type ?? "all", params?.limit ?? 50],
    queryFn: () =>
      listAuditEvents(accessToken!, {
        limit: params?.limit ?? 50,
        event_type: params?.event_type,
      }),
    enabled: Boolean(accessToken),
  });
}

export function useTenantSettings() {
  const accessToken = useAccessToken();

  return useQuery({
    queryKey: ["admin", "tenant-settings"],
    queryFn: () => getTenantSettings(accessToken!),
    enabled: Boolean(accessToken),
  });
}

export function useRevokeUserSessions() {
  const accessToken = useAccessToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => revokeUserSessions(accessToken!, userId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "audit-events"] });
    },
  });
}

export function usePatchTenantSettings() {
  const accessToken = useAccessToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (patch: Record<string, unknown>) => patchTenantSettings(accessToken!, patch),
    onSuccess: (data) => {
      queryClient.setQueryData(["admin", "tenant-settings"], data);
    },
  });
}

export function useAdminClients() {
  const accessToken = useAccessToken();

  return useQuery({
    queryKey: ["admin", "clients"],
    queryFn: () => listClients(accessToken!, { limit: 100 }),
    enabled: Boolean(accessToken),
  });
}

export function useCreateClient() {
  const accessToken = useAccessToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: { name: string; redirect_uris: string[] }) =>
      createClient(accessToken!, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "clients"] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "audit-events"] });
    },
  });
}
