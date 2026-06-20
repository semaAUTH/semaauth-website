/** Admin API response shapes (backend-core /admin/*). */

export type AdminUser = {
  id: string;
  email: string;
  is_email_verified: boolean;
  created_at: string;
  display_name?: string;
  avatar_url?: string;
};

export type AdminUsersResponse = {
  users: AdminUser[];
  limit: number;
  offset: number;
};

export type AdminUserDetailResponse = {
  user: AdminUser;
  mfa?: {
    totp_enabled: boolean;
    sms_enabled: boolean;
    phone_verified: boolean;
  };
};

export type AdminAuditEvent = {
  id: string;
  event_type: string;
  created_at: string;
  actor_user_id?: string;
  subject_user_id?: string;
  client_id?: string;
  ip_address?: string;
  metadata?: Record<string, unknown>;
};

export type AdminAuditEventsResponse = {
  events: AdminAuditEvent[];
  limit: number;
  offset: number;
};

export type AdminTenantSettingsResponse = {
  tenant_id: string;
  settings: Record<string, unknown>;
};

export type AdminApiErrorBody = {
  error: string;
  error_description?: string;
};
