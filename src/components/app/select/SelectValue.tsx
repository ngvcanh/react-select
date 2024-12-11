import { ChangeEvent, Fragment, MouseEvent, ReactNode, RefObject } from "react";
import { SelectItem, SelectItemOption, SelectPrimitive, SelectRenderValueParams, SelectSize } from "./types";
import { SelectSearch } from "./SelectSearch";
import { defaultRenderValue, getSelectSize, isSelectedStatus } from "./utils";
import { X } from "lucide-react";
import clsx from "clsx";

export interface SelectValueProps {
  options: SelectItem<SelectPrimitive>[];
  value: SelectPrimitive[];
  searchable?: boolean;
  search?: string;
  searchRef?: RefObject<HTMLInputElement>;
  placeholder?: string;
  searchPosition?: "anchor" | "dropdown";
  opened?: boolean;
  displayCount?: number;
  chip?: boolean;
  multiple?: boolean;
  truncate?: boolean;
  removable?: boolean;
  iconRemove?: ReactNode;
  size: SelectSize;
  groupCollapse?: boolean;
  setSearchTerm(value: string): void;
  setShouldFilter(value: boolean): void;
  onRemove(option: SelectItem<SelectPrimitive>): void;
  renderValue?(option: SelectItem<SelectPrimitive>, params: SelectRenderValueParams): ReactNode;
  renderChip?(option: SelectItem<SelectPrimitive> | number): JSX.Element;
}

export function SelectValue(props: SelectValueProps) {
  const {
    searchable,
    options,
    value,
    search,
    searchRef,
    placeholder = "",
    searchPosition,
    opened,
    displayCount = 0,
    chip,
    multiple = false,
    truncate,
    removable = true,
    iconRemove,
    size,
    groupCollapse,
    setSearchTerm,
    setShouldFilter,
    renderValue = defaultRenderValue,
    renderChip,
    onRemove,
  } = props;

  const selected = options.reduce((acc, option) => {
    if (!option.group) {
      value.includes(option.value!) && acc.push(option);
      return acc;
    }

    const status = isSelectedStatus(option.children! as SelectItemOption<SelectPrimitive>[], value);

    if (!groupCollapse || (!status.all && status.some)) {
      return [
        ...acc,
        ...option.children?.filter(
          (child) => value.includes((child as SelectItemOption<SelectPrimitive>).value!)
        ) ?? [],
      ] as SelectItem<SelectPrimitive>[];
    }

    if (status.all) {
      return [ ...acc, option ];
    }

    return acc;
  }, [] as SelectItem<SelectPrimitive>[]);

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setShouldFilter(true);
    setSearchTerm(e.target.value);
  };

  if (!searchable && !selected.length && !search) {
    return (
      <span className="opacity-80">{placeholder}</span>
    );
  }

  if (searchable && searchPosition === "anchor" && opened) {
    return (
      <SelectSearch
        ref={searchRef}
        placeholder={placeholder}
        value={search || ""}
        onChange={handleChangeSearch}
        position="anchor"
      />
    );
  }

  const displayOptions = displayCount > 0 ? selected.slice(0, displayCount) : selected;
  const remaining = selected.length - displayOptions.length;

  if (!chip) {
    return (
      <>
        {displayOptions.map((option, index) => (
          <span key={option.value} className={clsx("w-full", truncate ? "truncate" : "whitespace-nowrap")}>
            {renderValue(option, {
              multiple,
              index,
              isLast: index === displayOptions.length - 1,
            })}
          </span>
        ))}
        {remaining > 0 && (
          <span>, +{remaining}</span>
        )}
      </>
    );
  }

  const handleRemove = (option: SelectItem<SelectPrimitive>) => (e: MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove(option);
  }

  const selectSize = getSelectSize(size);

  return (
    <div
      className={clsx(
        "flex gap-1",
        truncate ? "flex-nowrap overflow-hidden" : "flex-wrap",
        selectSize.classes?.chipWrapper
      )}
    >
      {displayOptions.map((option) => {
        if (renderChip) {
          return (
            <Fragment key={option.value}>
              {renderChip(option)}
            </Fragment>
          );
        }

        return (
          <div
            key={option.value}
            className={clsx(
              "inline-flex items-center flex-1 w-auto max-w-max py-1 text-sm bg-blue-100/20 backdrop-blur-md",
              "rounded min-w-max",
              selectSize.classes?.chip,
            )}
          >
            <span className={truncate ? "truncate" : ""}>{option?.label}</span>
            {removable && (
              <span className={clsx("px-1 h-full inline-flex items-center", selectSize.classes?.chipIcon)} onClick={handleRemove(option)}>
                {iconRemove || <X className="w-3 h-3 cursor-pointer hover:text-red-500" />}
              </span>
            )}
          </div>
        );
      })}
      {remaining > 0 && (
        renderChip ? renderChip(remaining) : (
          <div className="px-2 py-1 text-sm bg-blue-100/10 backdrop-blur-md rounded">
            +{remaining}
          </div>
        )
      )}
    </div>
  );
}
