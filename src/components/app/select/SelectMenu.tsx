import { ReactNode, useState } from "react";
import { SelectList } from "./SelectList";
import {
  SelectItem,
  SelectItemGroup,
  SelectOptionHandler,
  SelectPrimitive,
  SelectRefs,
  SelectRenderMenuLabel,
  SelectTriggerColumn
} from "./types";
import clsx from "clsx";

export interface SelectMenuProps {
  refs: Pick<SelectRefs, "listLeft" | "listRight">;
  options: SelectItem<SelectPrimitive>[];
  value: SelectPrimitive[];
  showCheckbox?: boolean;
  iconCheck?: ReactNode;
  iconUncheck?: ReactNode;
  iconGroup?: ReactNode;
  splitColumns?: boolean;
  triggerColumn?: SelectTriggerColumn;
  scrollToSelected?: boolean;
  highlight?: boolean;
  highlightColor?: string;
  search?: string;
  getHighlighter?: SelectOptionHandler<string>;
  renderMenuLabel?(params: SelectRenderMenuLabel): ReactNode;
  setValue(value: SelectPrimitive[]): void;
  onSelect(option: SelectItem<SelectPrimitive>): void;
}

export function SelectMenu(props: SelectMenuProps) {
  const { splitColumns, refs, ...rest } = props;
  const [hovered, setHovered] = useState<SelectItemGroup<SelectPrimitive> | null>(null);

  const handleTrigger = (option: SelectItemGroup<SelectPrimitive> | null) => {
    setHovered(option);
  };

  return (
    <div className={clsx("w-full relative flex-1 h-full overflow-hidden", splitColumns ? "flex" : "")}>
      <SelectList {...rest} ref={refs.listLeft} splitColumns={splitColumns} onTrigger={handleTrigger} />
      {splitColumns && (
        <div className="flex-grow w-full">
          <SelectList {...rest} ref={refs.listRight} splitColumns={splitColumns} option={hovered} />
        </div>
      )}
    </div>
  );
}
