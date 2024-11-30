import { Fragment, ReactNode } from "react";
import { SelectItem, SelectItemGroup, SelectItemOption, SelectPrimitive } from "./types";
import { ChevronDown, ChevronRight } from "lucide-react";
import { SelectCheck } from "./SelectCheck";
import clsx from "clsx";

export interface SelectOptionProps {
  option: SelectItem<SelectPrimitive>;
  value: SelectPrimitive[];
  showCheckbox?: boolean;
  iconCheck?: ReactNode;
  iconUncheck?: ReactNode;
  iconGroup?: ReactNode;
  splitColumns?: boolean;
  triggerColumn?: "hover" | "selected";
  isLeft?: boolean;
  onSelect(option: SelectItem<SelectPrimitive>): void;
  onTrigger?(option: SelectItem<SelectPrimitive> | null): void;
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
    onSelect,
    onTrigger
  } = props;

  const handleClickOption = (option: SelectItem<SelectPrimitive>) => () => {
    if (option.disabled || option.group) {
      return;
    }

    onSelect(option);
  }

  const handleMouseOver = () => {
    if (!splitColumns || triggerColumn !== "hover" || !isLeft) {
      return;
    }

    onTrigger?.(option.group ? option : null);
  };

  const selected = !option.group && value.includes(option.value!);
  const GroupRightIcon = splitColumns ? ChevronRight : ChevronDown;

  

  return (
    <>
      <div
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
        <span className="flex-grow">{option.label}</span>
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
            />
          </Fragment>
        ))
      )}
    </>
  );
}
