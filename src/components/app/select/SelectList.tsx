import { ReactNode } from "react";
import { SelectItem, SelectPrimitive, SelectRenderMenuLabel, SelectTriggerColumn } from "./types";
import { SelectOption } from "./SelectOption";
import clsx from "clsx";

export interface SelectListProps {
  options: SelectItem<SelectPrimitive>[];
  value: SelectPrimitive[];
  showCheckbox?: boolean;
  iconCheck?: ReactNode;
  iconUncheck?: ReactNode;
  iconGroup?: ReactNode;
  triggerColumn?: SelectTriggerColumn;
  splitColumns?: boolean;
  option?: SelectItem<SelectPrimitive> | null;
  renderMenuLabel?(params: SelectRenderMenuLabel): ReactNode;
  setValue(value: SelectPrimitive[]): void;
  onTrigger?(option: SelectItem<SelectPrimitive> | null): void;
  onSelect(option: SelectItem<SelectPrimitive>): void;
}

export function SelectList(props: SelectListProps) {
  const { options, splitColumns, value, option, renderMenuLabel, setValue, ...rest } = props;

  const listOptions = (option !== undefined ? (option?.children ?? []) : options) as SelectItem<SelectPrimitive>[];

  return (
    <div className={clsx("overflow-auto", splitColumns && "flex-grow w-full")}>
      {renderMenuLabel ? renderMenuLabel({
        values: value,
        option,
        setValue,
      }) : null}
      {listOptions.map((opt) => (
        <SelectOption
          {...rest}
          key={opt.value}
          value={value}
          option={opt}
          splitColumns={splitColumns}
          isLeft={option === undefined}
        />
      ))}
    </div>
  );
}