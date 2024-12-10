import { Fragment, ReactNode, useMemo } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { SelectCheck } from "./SelectCheck";
import { htmlHighlighter, isSelectedStatus } from "./utils";
import {
  SelectItem,
  SelectItemGroup,
  SelectItemOption,
  SelectOptionHandler,
  SelectPrimitive,
  SelectTriggerColumn
} from "./types";
import clsx from "clsx";

export interface SelectOptionProps {
  option: SelectItem<SelectPrimitive>;
  value: SelectPrimitive[];
  showCheckbox?: boolean;
  iconCheck?: ReactNode;
  iconUncheck?: ReactNode;
  iconGroup?: ReactNode;
  splitColumns?: boolean;
  triggerColumn?: SelectTriggerColumn;
  isLeft?: boolean;
  search?: string;
  highlight?: boolean;
  highlightColor?: string;
  setSelectedRef?(instance: HTMLDivElement): void;
  onSelect(option: SelectItem<SelectPrimitive>): void;
  onTrigger?(option: SelectItem<SelectPrimitive> | null): void;
  getHighlighter?: SelectOptionHandler<string>;
}

export function SelectOption(props: SelectOptionProps) {
  const {
    option,
    value,
    showCheckbox,
    iconCheck,
    iconUncheck,
    splitColumns,
    triggerColumn = "hover",
    isLeft,
    iconGroup,
    search = "",
    highlight,
    highlightColor = "#2c96ff",
    setSelectedRef,
    onSelect,
    onTrigger,
    getHighlighter,
  } = props;

  const optionLabel = useMemo(() => {
    if (!highlight) {
      return option.label?.toString() || "";
    }
    console.log({
      option,
      search,
      highlight,
      highlightColor,
      getHighlighter,
    });
    if (getHighlighter) {
      return getHighlighter(option, search);
    }
    const highlighted = htmlHighlighter(option.label?.toString() || "", search, {
      color: highlightColor,
    });
    console.log(highlighted)
    return highlighted;
  }, [getHighlighter, option, search, highlight, highlightColor]);

  const handleClickOption = (option: SelectItem<SelectPrimitive>) => () => {
    if (option.disabled || (option.group && !splitColumns)) {
      return;
    }

    if (!option.group) {
      onSelect(option);
      return;
    }

    if (triggerColumn === "clicked") {
      onTrigger?.(option);
    } else if (triggerColumn === "clickset") {
      onTrigger?.(option);
      onSelect(option);
    }
  }

  const handleMouseOver = () => {
    if (option.disabled) {
      return;
    }

    if (!splitColumns || triggerColumn !== "hover" || !isLeft) {
      return;
    }

    onTrigger?.(option.group ? option : null);
  };

  const selected = !option.group && value.includes(option.value!);
  const GroupRightIcon = splitColumns ? ChevronRight : ChevronDown;

  const handleRef = (instance: HTMLDivElement) => {
    if (option.group && !splitColumns) {
      return;
    }

    if (option.group) {
      const status = isSelectedStatus(option.children! as SelectItemOption<SelectPrimitive>[], value);
      if (status.all || status.some) {
        setSelectedRef?.(instance);
      }
      return;
    }

    setSelectedRef?.(instance);
  };

  return (
    <>
      <div
        ref={handleRef}
        className={clsx(
          "flex items-center gap-2 p-2 cursor-pointer",
          {
            "opacity-50 cursor-not-allowed": option.disabled,
            "hover:bg-gray-100": !option.disabled && !option.group,
            "bg-gray-200": option.group && !splitColumns,
            "bg-blue-50": selected,
          }
        )}
        onClick={handleClickOption(option)}
        onMouseOver={handleMouseOver}
      >
        {showCheckbox || splitColumns ? (
          <SelectCheck
            value={value}
            options={(option.group
              ? (option as SelectItemGroup<SelectPrimitive>).children
              : [option]) as SelectItemOption<SelectPrimitive>[]
            }
            size="md"
          />
        ) : null}
        <div
          className="flex-grow"
          dangerouslySetInnerHTML={{
            __html: optionLabel,
          }}
        />
        {iconGroup !== null && option.group && (
          <span className="inline-flex h-full items-center px-2 -mr-2">
            {iconGroup ?? <GroupRightIcon className="w-4 h-4" />}
          </span>
        )}
      </div>
      {option.group && !!option.children?.length && !splitColumns && (
        option.children.map((child: SelectItemOption) => (
          <Fragment key={child.value as SelectPrimitive}>
            <SelectOption
              option={child as SelectItem<SelectPrimitive>}
              value={value}
              showCheckbox={showCheckbox}
              iconCheck={iconCheck}
              iconUncheck={iconUncheck}
              onSelect={onSelect}
              highlight={highlight}
              highlightColor={highlightColor}
              getHighlighter={getHighlighter}
              search={search}
            />
          </Fragment>
        ))
      )}
    </>
  );
}
