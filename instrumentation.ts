import type { Instrumentation } from "next";

export function register(): void {
  // PostHog is initialized lazily for Node.js requests below.
}

export const onRequestError: Instrumentation.onRequestError = async (
  error,
  request,
) => {
  if (process.env.NEXT_RUNTIME !== "nodejs") {
    return;
  }

  const { getPostHogServer } = await import("./libs/posthog-ai");
  const posthog = getPostHogServer();

  if (!posthog) {
    return;
  }

  const cookieHeader = Array.isArray(request.headers.cookie)
    ? request.headers.cookie.join("; ")
    : request.headers.cookie;
  let distinctId: string | undefined;

  if (cookieHeader) {
    const posthogCookie = cookieHeader.match(/ph_[^=;]+_posthog=([^;]+)/)?.[1];

    if (posthogCookie) {
      try {
        const cookieData: unknown = JSON.parse(decodeURIComponent(posthogCookie));

        if (
          typeof cookieData === "object" &&
          cookieData !== null &&
          "distinct_id" in cookieData &&
          typeof cookieData.distinct_id === "string"
        ) {
          distinctId = cookieData.distinct_id;
        }
      } catch {
        // A malformed analytics cookie should not interfere with error handling.
      }
    }
  }

  await posthog.captureException(error, distinctId);
  await posthog.flush();
};
