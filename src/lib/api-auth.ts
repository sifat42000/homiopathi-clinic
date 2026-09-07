import { auth } from "@/lib/auth";

export async function getApiSession(
  requestHeaders: Headers
) {
  return auth.api.getSession({
    headers: requestHeaders,
  });
}

export function userHasAdminRole(
  role: unknown
) {
  if (
    typeof role !== "string"
  ) {
    return false;
  }

  return role
    .split(",")
    .map((item) =>
      item.trim()
    )
    .includes("admin");
}

export async function isAdminRequest(
  requestHeaders: Headers
) {
  const session =
    await getApiSession(
      requestHeaders
    );

  if (!session) {
    return false;
  }

  return userHasAdminRole(
    session.user.role
  );
}