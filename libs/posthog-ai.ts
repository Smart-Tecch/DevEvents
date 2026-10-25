import { PostHog } from "posthog-node";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export type AiGeneration = {
  traceId: string;
  sessionId?: string | null;
  distinctId?: string;
  model: string;
  provider: string;
  input?: JsonValue;
  inputTokens?: number;
  outputChoices?: JsonValue;
  outputTokens?: number;
  latency?: number;
  stream?: boolean;
  timeToFirstToken?: number;
};

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (!posthogKey && process.env.NODE_ENV === "development") {
  throw new Error(
    "NEXT_PUBLIC_POSTHOG_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_KEY is configured",
  );
}

const posthog = posthogKey
  ? new PostHog(posthogKey, {
      ...(posthogHost ? { host: posthogHost } : {}),
      privacyMode: false,
      enableExceptionAutocapture: true,
      flushAt: 1,
      flushInterval: 0,
    })
  : null;

export function getPostHogServer(): PostHog | null {
  return posthog;
}

/**
 * Captures one model response. Reuse a conversation ID as sessionId and create
 * one traceId per user turn. distinctId must be a stable internal identifier.
 */
export function captureAiGeneration({
  traceId,
  sessionId = null,
  distinctId,
  model,
  provider,
  input,
  inputTokens,
  outputChoices,
  outputTokens,
  latency,
  stream,
  timeToFirstToken,
}: AiGeneration): void {
  posthog?.captureAi({
    distinctId,
    event: "$ai_generation",
    properties: {
      $ai_trace_id: traceId,
      $ai_session_id: sessionId,
      $ai_model: model,
      $ai_provider: provider,
      ...(input === undefined ? {} : { $ai_input: input }),
      ...(inputTokens === undefined ? {} : { $ai_input_tokens: inputTokens }),
      ...(outputChoices === undefined
        ? {}
        : { $ai_output_choices: outputChoices }),
      ...(outputTokens === undefined
        ? {}
        : { $ai_output_tokens: outputTokens }),
      ...(latency === undefined ? {} : { $ai_latency: latency }),
      ...(stream === undefined ? {} : { $ai_stream: stream }),
      ...(timeToFirstToken === undefined
        ? {}
        : { $ai_time_to_first_token: timeToFirstToken }),
    },
  });
}
