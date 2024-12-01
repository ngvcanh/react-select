import { ComponentType, forwardRef, Fragment, MouseEvent, PropsWithChildren, ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { SelectSeparator } from "./SelectSeparator";
import clsx from "clsx";
import { SelectSize } from "./types";
import { getSelectSize } from "./utils";

export interface SelectAnchorProps {
  className?: string;
  wrapper?: ComponentType;
  truncate?: boolean;
  separator?: boolean;
  iconDropdown?: ReactNode;
  opened?: boolean;
  size: SelectSize;
  onClick?(e: MouseEvent<HTMLDivElement>): void;
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
      truncate,
      size,
      onClick
    } = props;

    const selectSize = getSelectSize(size);

    return (
      <div
        ref={ref}
        className={clsx(
          "border rounded cursor-pointer w-full hover:border-blue-500",
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
            <div className={clsx("flex-1 min-w-0", truncate ? "truncate" : "", selectSize.classes?.anchorText)}>
              {children}
            </div>
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
