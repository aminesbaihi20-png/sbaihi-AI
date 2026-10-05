import { ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Sidebar } from "./Sidebar";
import { MobileNav, MobileMenuButton } from "./MobileNav";
import { RippleEffect } from "@/components/effects/RippleEffect";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isChat = pathname.startsWith("/chat");

  return (
    <div className="flex min-h-[100dvh] bg-background selection:bg-primary/40 selection:text-foreground">
      <RippleEffect />
      <Sidebar />
      <MobileNav />
      <main className="min-w-0 flex-1 pt-14 lg:pl-64 lg:pt-0">
        {isChat ? (
          children
        ) : (
          <div className="mx-auto w-full max-w-7xl px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-6 sm:px-6 sm:pt-8 lg:px-10 lg:pb-14 lg:pt-10">
            {children}
          </div>
        )}
      </main>
      {!isChat && (
        <div
          className={cn(
            "neo-raised fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-4 z-40 rounded-full lg:hidden",
          )}
        >
          <MobileMenuButton className="text-foreground" />
        </div>
      )}
    </div>
  );
}
