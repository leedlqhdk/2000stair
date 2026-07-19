export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;

  if (!oauthPortalUrl || !appId) {
    console.warn("OAuth login is not configured for this deployment.");
    return "/admin/blog?login=not-configured";
  }

  try {
    const redirectUri = `${window.location.origin}/api/oauth/callback`;
    const state = btoa(redirectUri);
    const baseUrl = oauthPortalUrl.startsWith("http")
      ? oauthPortalUrl
      : `https://${oauthPortalUrl}`;

    const url = new URL("/app-auth", baseUrl);
    url.searchParams.set("appId", appId);
    url.searchParams.set("redirectUri", redirectUri);
    url.searchParams.set("state", state);
    url.searchParams.set("type", "signIn");

    return url.toString();
  } catch (error) {
    console.error("Failed to build OAuth login URL", error);
    return "/admin/blog?login=invalid-url";
  }
};
