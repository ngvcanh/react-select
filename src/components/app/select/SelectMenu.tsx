import { ReactNode } from "react";
import { SelectItem, SelectPrimitive } from "./types";
import { SelectOption } from "./SelectOption";

export interface SelectMenuProps {
  options: SelectItem<SelectPrimitive>[];
  value: SelectPrimitive[];
  showCheckbox?: boolean;
  iconCheck?: ReactNode;
  iconUncheck?: ReactNode;
  onSelect(option: SelectItem<SelectPrimitive>): void;
}

export function SelectMenu(props: SelectMenuProps) {
  const { options, value, showCheckbox, iconCheck, iconUncheck, onSelect } = props;

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
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
