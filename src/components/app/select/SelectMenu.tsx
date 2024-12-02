import { ReactNode, useState } from "react";
import { SelectItem, SelectItemGroup, SelectPrimitive, SelectRenderMenuLabel, SelectTriggerColumn } from "./types";
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
  scrollToSelected?: boolean;
  renderMenuLabel?(params: SelectRenderMenuLabel): ReactNode;
  setValue(value: SelectPrimitive[]): void;
  onSelect(option: SelectItem<SelectPrimitive>): void;
}

export function SelectMenu(props: SelectMenuProps) {
  const { splitColumns } = props;
  const [hovered, setHovered] = useState<SelectItemGroup<SelectPrimitive> | null>(null);

  const handleTrigger = (option: SelectItemGroup<SelectPrimitive> | null) => {
    setHovered(option);
  };

  return (
    <div className={clsx("w-full relative flex-1 h-full overflow-hidden", splitColumns ? "flex" : "")}>
      <SelectList {...props} onTrigger={handleTrigger} />
      {splitColumns && (
        <div className="flex-grow w-full">
          <SelectList {...props} option={hovered} />
        </div>
      )}
    </div>
  );
}
