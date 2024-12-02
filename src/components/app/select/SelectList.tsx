import { ReactNode, useEffect, useRef } from "react";
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
  scrollToSelected?: boolean;
  renderMenuLabel?(params: SelectRenderMenuLabel): ReactNode;
  setValue(value: SelectPrimitive[]): void;
  onTrigger?(option: SelectItem<SelectPrimitive> | null): void;
  onSelect(option: SelectItem<SelectPrimitive>): void;
}

export function SelectList(props: SelectListProps) {
  const { options, splitColumns, value, option, scrollToSelected = true, renderMenuLabel, setValue, ...rest } = props;

  const listRef = useRef<HTMLDivElement>(null);
  const firstSelected = useRef<HTMLDivElement>();

  const listOptions = (option !== undefined ? (option?.children ?? []) : options) as SelectItem<SelectPrimitive>[];

  useEffect(() => {
    if (!scrollToSelected) {
      return;
    }

    setTimeout(() => {
      if (!firstSelected.current || !listRef.current) {
        return;
      }
  
      if (listRef.current.scrollHeight <= listRef.current.clientHeight) {
        return;
      }

      const listRect = listRef.current.getBoundingClientRect();
      const optionRect = firstSelected.current.getBoundingClientRect();

      const scrollSize = Math.min(
        optionRect.top - listRect.top + (listRect.height - optionRect.height) / 2,
        listRef.current.scrollHeight - listRef.current.clientHeight
      );

      listRef.current.scrollTop = scrollSize;
    }, 50);
  }, [scrollToSelected]);

  const handleFirstSelected = (instance: HTMLDivElement) => {
    if (!firstSelected.current) {
      firstSelected.current = instance;
    }
  };

  return (
    <div
      ref={listRef}
      className={clsx("overflow-y-auto", splitColumns && "flex-grow w-full")}
    >
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
          setSelectedRef={handleFirstSelected}
        />
      ))}
    </div>
  );
}