import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Menu,
  X,
  Home,
  BookOpen,
  GraduationCap,
  MessageCircle,
  HelpCircle,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/explainer", icon: BookOpen, label: "Explainer" },
  { to: "/croc", icon: GraduationCap, label: "CROC" },
  { to: "/chat", icon: MessageCircle, label: "Chat" },
  { to: "/help", icon: HelpCircle, label: "Help" },
];

/** Minimal mobile top header: title only, with a back arrow on the chat page. */
export function MobileNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isChat = pathname.startsWith("/chat");

  return (
    <header className="glass-surface fixed inset-x-0 top-0 z-40 grid h-14 grid-cols-[3rem_1fr_3rem] items-center border-b border-border/60 px-2 pt-[env(safe-area-inset-top)] lg:hidden">
      <div className="flex items-center justify-start">
        {isChat && (
          <Link
            to="/"
            className="neo-focus inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors active:bg-accent"
            aria-label="Back to home"
          >
            <ChevronLeft className="h-6 w-6" />
          </Link>
        )}
      </div>
      <Link
        to="/"
        className="font-display truncate text-center text-base font-bold text-foreground"
      >
        Sbaihi AI
      </Link>
      <div />
    </header>
  );
}

/** Compact menu trigger + sheet, meant to live inside the bottom input bar. */
export function MobileMenuButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className={cn(
          "neo-focus inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors active:bg-accent lg:hidden",
          className,
        )}
      >
        <Menu className="h-5 w-5" />
      </button>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity duration-200 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      <nav
        aria-label="Menu"
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 rounded-t-3xl bg-sidebar p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] text-sidebar-foreground shadow-2xl transition-transform duration-300 ease-out lg:hidden",
          open ? "translate-y-0" : "pointer-events-none translate-y-full",
        )}
      >
        <div className="mb-1 flex items-center justify-between px-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
            Menu
          </span>
          <button
            onClick={() => setOpen(false)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-sidebar-foreground active:bg-sidebar-accent"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {navItems.map((item) => {
          const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={cn(
                "flex min-h-12 items-center gap-3 rounded-2xl px-4 py-3 text-base font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 active:bg-sidebar-accent/60",
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
