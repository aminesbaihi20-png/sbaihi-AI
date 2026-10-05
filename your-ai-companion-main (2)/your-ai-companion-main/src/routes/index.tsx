import { createFileRoute } from "@tanstack/react-router";
import LampLoginAnimationV3 from "@/components/auth/LampLoginAnimationV3";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sbaihi AI — Learn Anything, the Fun Way" },
      {
        name: "description",
        content:
          "Sbaihi AI turns dense books and tricky lessons into simple, friendly explainers. Find medical universities, chat with an AI friend, and learn the fun way.",
      },
      { property: "og:title", content: "Sbaihi AI — Learn Anything, the Fun Way" },
      {
        property: "og:description",
        content: "Sbaihi AI turns dense books and tricky lessons into simple, friendly explainers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <LampLoginAnimationV3 />;
}
