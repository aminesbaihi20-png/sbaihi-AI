import { createFileRoute, Link } from "@tanstack/react-router";
import { HelpCircle, MessageCircle, BookOpen, GraduationCap, Zap, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help — Sbaihi AI" },
      {
        name: "description",
        content:
          "Get help with Sbaihi AI: credits, features, and how to make the most of your friendly learning companion.",
      },
      { property: "og:title", content: "Help — Sbaihi AI" },
      {
        property: "og:description",
        content:
          "Get help with Sbaihi AI: credits, features, and how to make the most of your friendly learning companion.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HelpPage,
});

const faqs = [
  {
    q: "What is Sbaihi AI?",
    a: "Sbaihi AI is a friendly learning companion. It can explain books and lessons, help you explore Moroccan universities, and chat with you about anything on your mind.",
  },
  {
    q: "Do I need to sign up?",
    a: "Nope. Sbaihi AI works without an account. Just open the app and start exploring.",
  },
  {
    q: "How do the free credits work?",
    a: "You get 5 free AI credits every day. Each explainer request or chat message uses one credit. Credits reset at midnight in your local timezone.",
  },
  {
    q: "What can I ask the Explainer?",
    a: "Anything — book titles, science topics, historical events, or even whole lessons. Sbaihi AI will give you a short, friendly summary with a hook, big idea, key points, and a takeaway.",
  },
  {
    q: "What is the CROC University Finder?",
    a: "It is a directory of Moroccan universities and grandes écoles. You can search by name, filter by city, field, or type (public/private) to find schools that match your interests.",
  },
  {
    q: "My credits ran out. What now?",
    a: "Come back tomorrow for 5 fresh credits. We reset them every day so you can keep learning.",
  },
];

function HelpPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        eyebrow="Help"
        title="How can we help?"
        description="Answers to common questions about Sbaihi AI, credits, and features."
      />

      <div className="neo-panel rounded-[2rem] p-5 sm:p-8 lg:rounded-[2.5rem]">
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="neo-inset rounded-2xl p-5">
              <h3 className="flex items-start gap-2 font-semibold text-foreground">
                <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {faq.q}
              </h3>
              <p className="mt-2 pl-6 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            to="/explainer"
            className="neo-raised neo-interactive flex items-center gap-3 rounded-2xl p-4"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo text-indigo-foreground">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-foreground">Try the Explainer</p>
              <p className="text-xs text-muted-foreground">Summarize any topic</p>
            </div>
          </Link>
          <Link
            to="/croc"
            className="neo-raised neo-interactive flex items-center gap-3 rounded-2xl p-4"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold text-gold-foreground">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-foreground">Find a university</p>
              <p className="text-xs text-muted-foreground">Browse Moroccan schools</p>
            </div>
          </Link>
          <Link
            to="/chat"
            className="neo-raised neo-interactive flex items-center gap-3 rounded-2xl p-4"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal text-teal-foreground">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-foreground">Chat with Sbaihi</p>
              <p className="text-xs text-muted-foreground">Ask anything</p>
            </div>
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="neo-raised neo-interactive flex w-full items-center gap-3 rounded-2xl p-4 text-left"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
              <RefreshCw className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-foreground">Refresh the page</p>
              <p className="text-xs text-muted-foreground">If something looks off</p>
            </div>
          </button>
        </div>

        <div className="neo-inset mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl p-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Zap className="h-4 w-4 text-primary" />
            <span>
              <strong className="text-foreground">5 free credits</strong> refresh every day at
              midnight.
            </span>
          </div>
          <Link to="/chat" className="font-medium text-primary hover:underline">
            Start chatting →
          </Link>
        </div>
      </div>
    </div>
  );
}
