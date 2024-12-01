import { ReactNode, useState } from "react";
import { SelectItem, SelectItemGroup, SelectPrimitive, SelectTriggerColumn } from "./types";
import { SelectList } from "./SelectList";
import clsx from "clsx";

export interface SelectMenuProps {
  options: SelectItem<SelectPrimitive>[];
  value: SelectPrimitive[];
  showCheckbox?: boolean;
  iconCheck?: ReactNode;
  iconUncheck?: ReactNode;
  iconGroup?: ReactNode;
  splitColumns?: boolean;
  triggerColumn?: SelectTriggerColumn;
  onSelect(option: SelectItem<SelectPrimitive>): void;
}

export function SelectMenu(props: SelectMenuProps) {
  const { splitColumns } = props;
  const [hovered, setHovered] = useState<SelectItemGroup<SelectPrimitive> | null>(null);

  const handleTrigger = (option: SelectItemGroup<SelectPrimitive> | null) => {
    setHovered(option);
  };

  return (
    <div className={clsx("w-full", splitColumns ? "flex" : "")}>
      <SelectList {...props} isLeft onTrigger={handleTrigger} />
      {splitColumns && (
        <div className="flex-grow w-full">
          {!!hovered && (
            <SelectList {...props} options={hovered.children as SelectItem<SelectPrimitive>[]} />
          )}
        </div>
      )}
    </div>
  );
}
