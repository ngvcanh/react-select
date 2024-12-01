import { ReactNode } from "react";
import { SelectItem, SelectPrimitive, SelectTriggerColumn } from "./types";
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
  triggerColumn?: SelectTriggerColumn;
  splitColumns?: boolean;
  onTrigger?(option: SelectItem<SelectPrimitive> | null): void;
  onSelect(option: SelectItem<SelectPrimitive>): void;
}

export function SelectList(props: SelectListProps) {
  const { options, splitColumns, ...rest } = props;

  return (
    <div className={clsx("overflow-auto", splitColumns && "flex-grow w-full")}>
      {options.map((option) => (
        <SelectOption
          {...rest}
          key={option.value}
          option={option}
          splitColumns={splitColumns}
        />
      ))}
    </div>
  );
}