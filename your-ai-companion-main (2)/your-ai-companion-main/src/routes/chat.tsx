import { createFileRoute, Link } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage, type FileUIPart } from "ai";
import { Lightbulb, Send, Volume2, Square, BookOpenCheck, FileText, X } from "lucide-react";
import { useCredits } from "@/lib/credits";
import { speakText } from "@/lib/speech";
import { cn } from "@/lib/utils";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
  ConversationEmptyState,
} from "@/components/ai-elements/conversation";
import {
  Message as AiMessage,
  MessageContent,
  MessageResponse,
  MessageActions,
  MessageAction,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
  PromptInputFooter,
} from "@/components/ai-elements/prompt-input";
import { useState, useCallback, useEffect, useRef } from "react";


export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Chat with Sbaihi AI" },
      {
        name: "description",
        content: "Chat with Sbaihi AI about your day, your studies, or anything on your mind.",
      },
      { property: "og:title", content: "Chat with Sbaihi AI" },
      {
        property: "og:description",
        content: "Chat with Sbaihi AI about your day, your studies, or anything on your mind.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChatPage,
});

const starterPrompts = [
  "Help me plan my study session",
  "What is the CROC?",
  "Tell me a fun science fact",
  "How do I choose a university?",
];

function LightbulbAvatar({ state }: { state: "idle" | "thinking" | "streaming" }) {
  return (
    <div
      className={cn(
        "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy",
        "transition-all duration-500",
      )}
    >
      {/* soft yellow glow halo */}
      <span
        className={cn(
          "absolute inset-0 rounded-full transition-all duration-500",
          state === "thinking" && "thinking-bulb",
          state === "streaming" && "bulb-glow",
        )}
      />
      <Lightbulb
        className={cn(
          "relative z-10 h-5 w-5 transition-all duration-300",
          state === "idle" && "text-gold",
          state === "thinking" && "thinking-bulb text-gold",
          state === "streaming" && "bulb-glow text-gold",
        )}
      />
    </div>
  );
}

function ChatPage() {
  const { remaining, limit, canSpend, spend, ready } = useCredits();
  const [creditError, setCreditError] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [pdf, setPdf] = useState<{ file: File; dataUrl: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const welcome =
    "Hey! I'm Sbaihi AI. Ask me about your studies, your day, or anything you're curious about.";

  const { messages, status, sendMessage, stop, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    messages: [
      {
        id: "welcome",
        role: "assistant",
        parts: [{ type: "text", text: welcome }],
      } satisfies UIMessage,
    ],
    onError: (err) => {
      console.error("Chat error:", err);
    },
  });

  const isThinking = status === "submitted";
  const isStreaming = status === "streaming";

  const onPickPdf = useCallback(() => {
    setCreditError(null);
    if (!canSpend) {
      setCreditError("You've used all your free document credits for today.");
      return;
    }
    fileInputRef.current?.click();
  }, [canSpend]);

  const onFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.type !== "application/pdf") {
      setCreditError("Please choose a PDF file.");
      return;
    }
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Could not read the file."));
      reader.readAsDataURL(file);
    }).catch(() => null);
    if (!dataUrl) {
      setCreditError("Could not read that PDF. Please try another file.");
      return;
    }
    setCreditError(null);
    setPdf({ file, dataUrl });
  }, []);

  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed && !pdf) return;
      setCreditError(null);

      // Text chat is free & unlimited. Credits only apply to document analysis.
      if (pdf) {
        if (!canSpend || !spend()) {
          setCreditError("You've used all your free document credits for today.");
          return;
        }
        const files: FileUIPart[] = [
          {
            type: "file",
            mediaType: "application/pdf",
            filename: pdf.file.name,
            url: pdf.dataUrl,
          },
        ];
        setInput("");
        setPdf(null);
        void sendMessage({ text: trimmed || `Analyse this document: ${pdf.file.name}`, files });
        return;
      }

      setInput("");
      void sendMessage({ text: trimmed });
    },
    [canSpend, spend, sendMessage, pdf],
  );

  const onSubmit = useCallback(
    (message: { text?: string }) => {
      send(message.text ?? input);
    },
    [send, input],
  );

  const onStarterClick = useCallback((prompt: string) => send(prompt), [send]);

  useEffect(() => {
    if (input.trim()) setCreditError(null);
  }, [input]);


  const lastAssistant = messages.filter((m) => m.role === "assistant").pop();
  const avatarState: "idle" | "thinking" | "streaming" = isStreaming
    ? "streaming"
    : isThinking
      ? "thinking"
      : "idle";

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] flex-col lg:h-[100dvh]">
      {/* Mobile header */}
      <header className="fixed inset-x-0 top-0 z-40 grid h-14 grid-cols-[3rem_1fr_3rem] items-center border-b border-border bg-sidebar px-2 pt-[env(safe-area-inset-top)] lg:hidden">
        <div className="flex items-center justify-start">
          <Link
            to="/"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-sidebar-foreground transition-colors active:bg-sidebar-accent"
            aria-label="Back to home"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Link>
        </div>
        <Link to="/" className="truncate text-center text-base font-bold text-sidebar-foreground">
          Sbaihi AI
        </Link>
        <div />
      </header>

      <div className="mx-auto hidden w-full max-w-4xl px-4 pt-7 sm:px-6 lg:block lg:px-8">
        <div className="neo-panel mb-5 flex items-center gap-4 rounded-3xl px-6 py-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
            <BookOpenCheck className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Study & Exam Assistant
            </p>
            <h1 className="font-display truncate text-2xl font-bold text-foreground">
              Ask, understand, prepare
            </h1>
          </div>
        </div>
      </div>

      <Conversation
        className={cn("min-h-0 flex-1", messages.length > 12 && "smooth-scrollbar overflow-y-auto")}
      >
        <ConversationContent className="mx-auto w-full max-w-4xl space-y-6 px-4 pb-4 pt-4 sm:px-6">
          {messages.length === 0 ? (
            <ConversationEmptyState
              icon={<Lightbulb className="size-10 text-gold" />}
              title="Start a conversation"
              description="Ask Sbaihi AI about your studies, your day, or anything on your mind."
            />
          ) : (
            messages.map((m, i) => {
              const isLast = i === messages.length - 1;
              const isAssistant = m.role === "assistant";
              return (
                <AiMessage from={m.role} key={m.id} className={cn(isAssistant && "max-w-[95%]")}>
                  <div className={cn("flex gap-3", !isAssistant && "flex-row-reverse")}>
                    {isAssistant ? (
                      <LightbulbAvatar state={isLast ? avatarState : "idle"} />
                    ) : (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>
                    )}
                    <MessageContent>
                      {m.parts.map((part, idx) => {
                        if (part.type !== "text") return null;
                        return (
                          <div key={`${m.id}-${idx}`} className="relative">
                            <MessageResponse>{part.text}</MessageResponse>
                            {isAssistant && isLast && (
                              <MessageActions>
                                <MessageAction
                                  onClick={() => speakText(part.text)}
                                  label="Read aloud"
                                  tooltip="Read aloud"
                                >
                                  <Volume2 className="size-3.5" />
                                </MessageAction>
                              </MessageActions>
                            )}
                          </div>
                        );
                      })}
                    </MessageContent>
                  </div>
                </AiMessage>
              );
            })
          )}

          {messages.length === 1 && (
            <div className="grid grid-cols-1 gap-2 pt-2 sm:grid-cols-2">
              {starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => onStarterClick(prompt)}
                  disabled={!canSpend || status !== "ready"}
                  className="neo-raised neo-interactive neo-focus rounded-2xl p-4 text-left text-sm font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Lightbulb className="mb-1 h-3.5 w-3.5 text-gold" />
                  {prompt}
                </button>
              ))}
            </div>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="glass-surface sticky bottom-0 z-30 border-t border-border/60 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 sm:px-6">
        {(creditError || error) && (
          <div className="mx-auto mb-2 max-w-3xl rounded-2xl bg-destructive/10 px-4 py-2 text-sm text-destructive">
            {creditError || (error?.message ?? "Something went wrong. Please try again.")}
          </div>
        )}
        <PromptInput onSubmit={onSubmit} className="neo-raised mx-auto max-w-4xl rounded-3xl p-1">
          <PromptInputTextarea
            value={input}
            onChange={(e) => setInput(e.currentTarget.value)}
            placeholder={canSpend ? "Message Sbaihi AI…" : "No free credits left today"}
            disabled={!canSpend}
            className="min-h-[52px] rounded-2xl bg-transparent pr-12 placeholder:text-muted-foreground"
          />
          <PromptInputFooter className="justify-end">
            <PromptInputSubmit
              status={status}
              onStop={stop}
              disabled={(status === "ready" && !input.trim()) || !canSpend}
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {status === "streaming" ? (
                <Square className="size-4 fill-current" />
              ) : (
                <Send className="size-4" />
              )}
            </PromptInputSubmit>
          </PromptInputFooter>
        </PromptInput>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          {ready
            ? `${remaining} free credit${remaining === 1 ? "" : "s"} left today`
            : "Loading credits…"}
        </p>
      </div>
    </div>
  );
}
