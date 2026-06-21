/** Matches @semaauth/adapter-core bff-session (keep in sync until deps pin new release). */
export const BFF_SESSION_REQUEST_HEADER = "X-Semaauth-Bff-Session";
export const BFF_SESSION_REQUEST_VALUE = "1";

export function isValidBffSessionRequest(request: Request): boolean {
  return request.headers.get(BFF_SESSION_REQUEST_HEADER) === BFF_SESSION_REQUEST_VALUE;
}

export function bffSessionRequestHeaders(): Record<string, string> {
  return {
    [BFF_SESSION_REQUEST_HEADER]: BFF_SESSION_REQUEST_VALUE,
  };
}
