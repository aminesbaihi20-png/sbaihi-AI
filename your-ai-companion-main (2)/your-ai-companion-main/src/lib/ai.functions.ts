import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const EXPLAIN_MODEL = "google/gemini-3.7-flash";

const ExplainInput = z.object({
  topic: z.string().min(1).max(200),
});

export const explainTopic = createServerFn({ method: "POST" })
  .validator(ExplainInput)
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);
    const { text } = await generateText({
      model: gateway(EXPLAIN_MODEL),
      system:
        "You are Sbaihi AI, a warm, friendly learning companion. Explain books and lessons in a simple, fun, non-academic way. Use markdown. Structure your answer with: a short hook, the big idea, 3-5 key points, and a one-sentence takeaway. Keep it under 250 words.",
      messages: [
        {
          role: "user",
          content: `Explain this topic or book in a friendly way: ${data.topic}`,
        },
      ],
    });

    return { explanation: text };
  });

const CHAT_MODEL = "google/gemini-3.7-flash";

const ChatInput = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    }),
  ),
});

export const chatWithSbaihi = createServerFn({ method: "POST" })
  .validator(ChatInput)
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);
    const { text } = await generateText({
      model: gateway(CHAT_MODEL),
      system:
        "You are Sbaihi AI, a fun, friendly companion. Talk about the user's day, what's on their mind, or help them study. Keep replies warm, concise (under 120 words), and encouraging.",
      messages: data.messages.map((m) => ({ role: m.role, content: m.content })),
    });

    return { reply: text };
  });
