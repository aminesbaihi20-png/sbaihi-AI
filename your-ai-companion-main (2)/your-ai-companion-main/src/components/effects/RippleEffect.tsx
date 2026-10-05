import { useEffect } from "react";

const INTERACTIVE_SELECTOR =
  'button, a, input, textarea, select, summary, label[for], [role="button"], [role="tab"], [role="link"], [data-ripple]';

function resolveGlow(el: Element): string {
  let node: Element | null = el;
  for (let i = 0; i < 4 && node; i++) {
    const bg = getComputedStyle(node).backgroundColor;
    if (bg && bg !== "transparent" && !bg.startsWith("rgba(0, 0, 0, 0)")) {
      return `color-mix(in oklab, ${bg}, white 55%)`;
    }
    node = node.parentElement;
  }
  return "color-mix(in oklab, var(--primary), white 45%)";
}

/** Global water-ripple feedback: only fires on interactive elements, never on empty background. */
export function RippleEffect() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Element | null;
      const el = target?.closest?.(INTERACTIVE_SELECTOR) as HTMLElement | null;
      if (!el || el.hasAttribute("data-no-ripple") || (el as HTMLButtonElement).disabled) return;

      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const style = getComputedStyle(el);
      const clip = document.createElement("span");
      clip.className = "ripple-clip";
      clip.style.top = `${rect.top}px`;
      clip.style.left = `${rect.left}px`;
      clip.style.width = `${rect.width}px`;
      clip.style.height = `${rect.height}px`;
      clip.style.borderRadius = style.borderRadius;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const size = Math.max(rect.width, rect.height) * 1.15;

      const ripple = document.createElement("span");
      ripple.className = "ripple-drop";
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${x - size / 2}px`;
      ripple.style.top = `${y - size / 2}px`;
      ripple.style.setProperty("--ripple-color", resolveGlow(el));

      clip.appendChild(ripple);
      document.body.appendChild(clip);
      const cleanup = () => clip.remove();
      ripple.addEventListener("animationend", cleanup);
      window.setTimeout(cleanup, 900);
    };

    document.addEventListener("pointerdown", onPointerDown, { passive: true });
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return null;
}
