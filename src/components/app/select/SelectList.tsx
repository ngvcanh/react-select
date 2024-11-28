import { ReactNode } from "react";
import { SelectItem, SelectPrimitive } from "./types";
import { SelectOption } from "./SelectOption";
import clsx from "clsx";

export interface SelectListProps {
  options: SelectItem<SelectPrimitive>[];
  value: SelectPrimitive[];
  showCheckbox?: boolean;
  iconCheck?: ReactNode;
  iconUncheck?: ReactNode;
  iconGroup?: ReactNode;
  isLeft?: boolean;
  triggerColumn?: "hover" | "selected";
  splitColumns?: boolean;
  onTrigger?(option: SelectItem<SelectPrimitive> | null): void;
  onSelect(option: SelectItem<SelectPrimitive>): void;
}

export function SelectList(props: SelectListProps) {
  const {
    options,
    value,
    showCheckbox,
    iconCheck,
    iconUncheck,
    triggerColumn,
    isLeft,
    splitColumns,
    iconGroup,
    onSelect,
    onTrigger
  } = props;

  return (
    <div className={clsx("max-h-60 overflow-auto", splitColumns && "flex-grow w-full")}>
      {options.map((option) => (
        <SelectOption
          key={option.value}
          option={option}
          value={value}
          showCheckbox={showCheckbox}
          iconCheck={iconCheck}
          iconUncheck={iconUncheck}
          iconGroup={iconGroup}
          isLeft={isLeft}
          triggerColumn={triggerColumn}
          splitColumns={splitColumns}
          onSelect={onSelect}
          onTrigger={onTrigger}
        />
      ))}
    </div>
  );
}