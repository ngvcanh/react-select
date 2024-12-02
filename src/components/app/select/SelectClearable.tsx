import { MouseEvent } from "react";
import { X } from "lucide-react";

export interface SelectClearableProps {
  enabled: boolean;
  onClick?(): void;
}

export function SelectClearable(props: SelectClearableProps) {
  const { enabled, onClick } = props;

  if (!enabled) {
    return null;
  }

  const handleClick = (e: MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onClick?.();
  };

  return (
    <span className="flex h-full items-center px-2" onClick={handleClick}>
      <X />
    </span>
  );
}