import { ReactNode } from "react";
import { SelectItem, SelectPrimitive } from "./types";
import { SelectList } from "./SelectList";

export interface SelectMenuProps {
  options: SelectItem<SelectPrimitive>[];
  value: SelectPrimitive[];
  showCheckbox?: boolean;
  iconCheck?: ReactNode;
  iconUncheck?: ReactNode;
  splitColumns?: boolean;
  onSelect(option: SelectItem<SelectPrimitive>): void;
}

export function SelectMenu(props: SelectMenuProps) {
  return (
    <>
      <SelectList {...props} isLeft />
    </>
  );
}
