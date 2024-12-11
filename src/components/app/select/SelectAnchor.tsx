import { ComponentType, forwardRef, Fragment, MouseEvent, PropsWithChildren, ReactNode } from "react";
import { SelectSeparator } from "./SelectSeparator";
import { SelectSize } from "./types";
import { getSelectSize } from "./utils";
import { SelectClearable } from "./SelectClearable";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

export interface SelectAnchorProps {
  className?: string;
  wrapper?: ComponentType;
  separator?: boolean;
  iconDropdown?: ReactNode;
  opened?: boolean;
  size: SelectSize;
  disabled?: boolean;
  clearable?: boolean;
  onClick?(e: MouseEvent<HTMLDivElement>): void;
  onClearable?(): void;
}

export const SelectAnchor = forwardRef<HTMLDivElement, PropsWithChildren<SelectAnchorProps>>(
  function SelectAnchor(props, ref) {
    const {
      children,
      className,
      iconDropdown,
      opened,
      wrapper: Wrapper = Fragment,
      separator,
      size,
      disabled,
      clearable,
      onClick,
      onClearable
    } = props;

    const selectSize = getSelectSize(size);

    return (
      <div
        ref={ref}
        className={clsx(
          "border rounded cursor-pointer w-full overflow-x-hidden",
          {
            "bg-gray-400/40": disabled,
            "hover:border-blue-500": !disabled,
          },
          selectSize.classes?.select,
          className
        )}
      >
        <Wrapper>
          <div
            className={clsx(
              "flex items-center justify-between w-full overflow-hidden text-sm",
              selectSize.classes?.anchor
            )}
            onClick={onClick}
          >
            <div className={clsx(
              "flex-1 min-w-0 w-full overflow-hidden whitespace-nowrap",
              selectSize.classes?.anchorText
            )}>
              {children}
            </div>
            <SelectClearable enabled={!!clearable} onClick={onClearable} />
            <SelectSeparator enabled={!!separator} />
            {iconDropdown || (
              <span className="flex h-full px-2 -mr-2">
                <ChevronDown
                  className={clsx(
                    "w-4 h-4 transition-transform",
                    { "transform rotate-180": opened }
                  )}
                />
              </span>
            )}
          </div>
        </Wrapper>
      </div>
    );
  }
);
