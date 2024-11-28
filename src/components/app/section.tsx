import { PropsWithChildren } from "react";
import clsx from "clsx";

export interface SectionProps {
  title: string;
  className?: string;
}

export function Section(props: PropsWithChildren<SectionProps>) {
  const { title, className, children } = props;

  return (
    <section className={clsx("mb-10", className)}>
      <div className="font-semibold text-slate-200 text-lg mb-4 border-b bg-slate-600/30 border-slate-700 p-2">
        {title}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {children}
      </div>
    </section>
  );
}
