import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, Loader2, Sparkles, Wand2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { explainTopic } from "@/lib/ai.functions";
import { useCredits } from "@/lib/credits";
import { PageHeader } from "@/components/layout/PageHeader";

export const Route = createFileRoute("/explainer")({
  head: () => ({
    meta: [
      { title: "Book & Lesson Explainer — Sbaihi AI" },
      {
        name: "description",
        content: "Turn any book or lesson into a simple, friendly explainer with Sbaihi AI.",
      },
      { property: "og:title", content: "Book & Lesson Explainer — Sbaihi AI" },
      {
        property: "og:description",
        content: "Turn any book or lesson into a simple, friendly explainer with Sbaihi AI.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ExplainerPage,
});

function ExplainerPage() {
  const [topic, setTopic] = useState("");
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { remaining, canSpend, spend, ready } = useCredits();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || !canSpend) return;

    if (!spend()) return;
    setLoading(true);
    setError(null);
    setExplanation(null);

    try {
      const result = await explainTopic({ data: { topic: topic.trim() } });
      setExplanation(result.explanation);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        eyebrow="Study & Exam Assistant"
        title="Turn difficult lessons into clear understanding"
        description="Enter a lesson, book, or exam topic for a focused explanation with key ideas and a memorable takeaway."
      />

      <div className="neo-panel rounded-[2rem] p-5 sm:p-8 lg:rounded-[2.5rem] lg:p-10">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <BookOpen className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Try: The French Revolution"
              className="neo-inset neo-focus h-14 w-full rounded-2xl border-0 py-4 pl-12 pr-4 text-foreground outline-none placeholder:text-muted-foreground"
              maxLength={200}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              {ready ? (
                <span>
                  <span className="font-semibold text-foreground">{remaining}</span> free credit
                  {remaining === 1 ? "" : "s"} left today
                </span>
              ) : (
                <span>Loading credits…</span>
              )}
            </div>
            <button
              type="submit"
              disabled={!topic.trim() || loading || !canSpend}
              className="neo-focus inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-md transition-transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="h-4 w-4" />
              )}
              {loading ? "Explaining…" : "Explain it"}
            </button>
          </div>
        </form>

        {!canSpend && ready && (
          <div className="mt-4 rounded-2xl bg-destructive/10 p-4 text-sm text-destructive">
            You've used all your free credits for today. Come back tomorrow for 5 more!
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-2xl bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {explanation && (
          <div className="neo-inset mt-8 rounded-3xl p-6 sm:p-8">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="font-bold text-foreground">Explanation</h2>
            </div>
            <div className="prose prose-sm max-w-none text-foreground">
              <ReactMarkdown>{explanation}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
