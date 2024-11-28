import { ReactNode } from "react";
import { SelectItem, SelectPrimitive } from "./types";
import { SelectOption } from "./SelectOption";

export interface SelectListProps {
  options: SelectItem<SelectPrimitive>[];
  value: SelectPrimitive[];
  showCheckbox?: boolean;
  iconCheck?: ReactNode;
  iconUncheck?: ReactNode;
  isLeft?: boolean;
  triggerColumn?: "hover" | "selected";
  onSelect(option: SelectItem<SelectPrimitive>): void;
}

export function SelectList(props: SelectListProps) {
  const { options, value, showCheckbox, iconCheck, iconUncheck, triggerColumn, isLeft, onSelect } = props;

  return (
    <div className="max-h-60 overflow-auto">
      {options.map((option) => (
        <SelectOption
          key={option.value}
          option={option}
          value={value}
          showCheckbox={showCheckbox}
          iconCheck={iconCheck}
          iconUncheck={iconUncheck}
          isLeft={isLeft}
          tiggerColumn={triggerColumn}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}