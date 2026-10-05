import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider, getLovableAiGatewayRunId, withLovableAiGatewayRunIdHeader } from "@/lib/ai-gateway.server";

const CHAT_MODEL = "google/gemini-3.7-flash";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env["LOVABLE_API_KEY"];
        if (!key) {
          return new Response(JSON.stringify({ error: "Missing LOVABLE_API_KEY" }), { status: 500, headers: { "Content-Type": "application/json" } });
        }

        const body = (await request.json().catch(() => ({}))) as { messages?: UIMessage[] };
        const messages = Array.isArray(body.messages) ? body.messages : [];
        if (!messages.length) {
          return new Response(JSON.stringify({ error: "Missing messages" }), { status: 400, headers: { "Content-Type": "application/json" } });
        }

        const runId = getLovableAiGatewayRunId(request);
        const gateway = createLovableAiGatewayProvider(key, runId);

        const result = streamText({
          model: gateway(CHAT_MODEL),
          system:
            "You are Sbaihi AI, a fun, friendly companion. Talk about the user's day, what's on their mind, or help them study. Keep replies warm, concise (under 120 words), and encouraging.",
          messages: await convertToModelMessages(messages),
        });


        return withLovableAiGatewayRunIdHeader(
          result.toUIMessageStreamResponse(),
          gateway,
        );
      },
    },
  },
});
