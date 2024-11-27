import { ChangeEvent, Fragment, MouseEvent, ReactNode, RefObject } from "react";
import { SelectOption, SelectPrimitive, SelectRenderValueParams } from "./types";
import { defaultRenderValue } from "./utils";
import { X } from "lucide-react";
import clsx from "clsx";

export interface RenderSelected {
  options: SelectOption[];
  currentValue: SelectPrimitive[];
  placeholder?: string;
  chip?: boolean;
  displayCount: number;
  multiple?: boolean;
  truncate?: boolean;
  iconRemove?: ReactNode;
  searchTerm?: string;
  searchable?: boolean;
  searchPosition?: "anchor" | "dropdown";
  isOpen?: boolean;
  removable?: boolean;
  searchRef?: RefObject<HTMLInputElement>;
  setSearchTerm(value: string): void;
  setShouldFilter(value: boolean): void;
  renderChip?(option: SelectOption | number): JSX.Element;
  renderValue?(option: SelectOption, params: SelectRenderValueParams): ReactNode;
  onRemove(option: SelectOption): (e: MouseEvent) => void;
}

export function renderSelected(props: RenderSelected) {
  const {
    options,
    currentValue,
    placeholder = "",
    chip,
    displayCount = 0,
    multiple = false,
    truncate,
    iconRemove,
    searchTerm,
    searchable,
    searchPosition = "anchor",
    isOpen,
    removable = true,
    searchRef,
    setSearchTerm,
    setShouldFilter,
    renderValue = defaultRenderValue,
    renderChip,
    onRemove,
  } = props;

  const selectedOptions = options.filter((opt) => currentValue.includes(opt.value));
  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setShouldFilter(true);
    setSearchTerm(e.target.value);
  };

  if (!searchable && !selectedOptions.length && !searchTerm) {
    return (
      <span className="opacity-80">{placeholder}</span>
    );
  }

  if (searchable && searchPosition === "anchor" && isOpen) {
    return (
      <div className="flex items-center flex-1 h-full">
        <input
          ref={searchRef}
          type="text"
          className="w-full h-full bg-transparent focus:outline-none"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleChangeSearch}
        />
      </div>
    );
  }

  const displayOptions = displayCount > 0 ? selectedOptions.slice(0, displayCount) : selectedOptions;
  const remaining = selectedOptions.length - displayOptions.length;

  if (!chip) {
    return (
      <>
        {displayOptions.map((option, index) => (
          <Fragment key={option.value}>
            {renderValue(option, {
              multiple,
              index,
              isLast: index === displayOptions.length - 1,
            })}
          </Fragment>
        ))}
        {remaining > 0 && (
          <span>, +{remaining}</span>
        )}
      </>
    );
  }

  return (
    <div className={clsx("flex gap-1", truncate ? "flex-nowrap overflow-hidden" : "flex-wrap")}>
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
              "inline-flex items-center flex-1 w-auto max-w-max gap-1 px-2 py-1 text-sm bg-blue-100/20 backdrop-blur-md",
              "rounded min-w-max",
            )}
          >
            <span className={truncate ? "truncate" : ""}>{option?.label}</span>
            {removable && (
              <span className="-mr-2 px-1 h-full inline-flex items-center" onClick={onRemove(option)}>
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
};
