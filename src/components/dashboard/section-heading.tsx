import * as React from "react";

interface SectionHeadingProps {
  title: string;
  /** Small leading icon, e.g. the pin on the "Pinned" section. */
  icon?: React.ReactNode;
  /** Right-aligned affordance, typically a "View all" link. */
  action?: React.ReactNode;
}

/** Shared heading row for the dashboard sections. */
export function SectionHeading({ title, icon, action }: SectionHeadingProps) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="font-heading flex items-center gap-2 text-[0.95rem] font-semibold">
        {icon}
        {title}
      </h2>
      {action}
    </div>
  );
}
