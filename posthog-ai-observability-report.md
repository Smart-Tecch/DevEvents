# PostHog AI Observability setup

> **Status: wired and build-verified; runtime delivery pending.** The project has no LLM provider SDK, API route, server action, or model-call site to invoke. A reusable server-side capture helper is ready for the first LLM integration, but there is no application path that can yet send a test generation.

## What changed

- Selected the **manual-capture** AI Observability variant because `package.json` has no vendor LLM SDK and the application contains no model calls.
- Added `posthog-node` (`^5.57.1`) to `package.json` and updated `pnpm-lock.yaml`.
- Added `libs/posthog-ai.ts`, which:
  - initializes a server-side PostHog client only when the existing PostHog environment key is present;
  - reads the existing `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` variables rather than embedding configuration in code;
  - sends `$ai_generation` events through the dedicated AI ingestion method; and
  - accepts a session ID, per-turn trace ID, stable internal distinct ID, model/provider metadata, token counts, latency, and optional prompt/completion payloads.
- Configured the two existing PostHog environment variable names in `.env.local`.
- Added `.posthog-wizard-cache/.posthog-ai.json` for the Wizard's AI Observability run record.

## How to use the helper

When a server-side LLM call is added, import `captureAiGeneration` from `libs/posthog-ai.ts` immediately after receiving the provider response.

- Reuse one `sessionId` for every turn in the same conversation.
- Create one `traceId` for a whole user turn and reuse it for every model generation or tool span in that turn.
- Supply `distinctId` only as a stable internal identifier—never an email address, name, or other user-entered PII.
- Pass the actual provider and model name plus the response's token usage and latency where available.
- If the workload is single-turn rather than conversational, leave `sessionId` as `null`.

The project has no registered model tools, so no `$ai_span` tool events were added.

## Verification

- Confirmed the helper imports `posthog-node`, uses the configured environment variables, and emits `$ai_generation` via `captureAi`.
- Confirmed `posthog-node` is present in both the manifest and the pnpm lockfile.
- `pnpm lint` completed successfully.
- `pnpm build` completed successfully, including compilation, TypeScript validation, and static page generation.
- No test request could be run because the application has no LLM call path. After adding one, run a single turn (then a second turn in the same conversation) and inspect the newest trace in AI Observability. Expect one session containing both turns and one trace for each turn.

## Privacy mode

Privacy mode is explicitly **off** in `libs/posthog-ai.ts`. Prompt and completion payloads passed to the manual helper can therefore be sent to PostHog. Enable privacy controls before sending prompts or responses whose sensitive content must not be stored.

For this manual-capture setup, enabling `privacyMode: true` on the client does not retroactively remove data or automatically sanitize arbitrary manually supplied `$ai_input` and `$ai_output_choices` payloads. Omit or redact those payload fields at the call site when required. See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).
