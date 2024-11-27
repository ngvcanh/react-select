import clsx from "clsx";
import { PropsWithChildren } from "react";

export interface CardProps {
  className?: string;
  title: string;
}

export function Card(props: PropsWithChildren<CardProps>) {
  const { className, children, title } = props;

  return (
    <div className={clsx("shadow-md rounded-md p-4 border border-slate-700", className)}>
      <div className="font-semibold text-slate-200 text-sm mb-1">
        {title}
      </div>
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}
