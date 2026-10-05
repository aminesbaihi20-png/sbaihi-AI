import { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}

export function PageHeader({ eyebrow, title, description, children }: PageHeaderProps) {
  return (
    <div className="mb-8 min-w-0 sm:mb-10">
      {eyebrow && (
        <span className="neo-inset mb-3 inline-block rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-secondary-foreground">
          {eyebrow}
        </span>
      )}
      <h1 className="font-display text-balance text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
        {title}
      </h1>
      {description && (
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">{description}</p>
      )}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
