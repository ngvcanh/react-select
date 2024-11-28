import { ComponentType, forwardRef, Fragment, MouseEvent, PropsWithChildren, ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { SelectSeparator } from "./SelectSeparator";
import clsx from "clsx";

export interface SelectAnchorProps {
  className?: string;
  wrapper?: ComponentType;
  truncate?: boolean;
  separator?: boolean;
  iconDropdown?: ReactNode;
  opened?: boolean;
  onClick?(e: MouseEvent<HTMLDivElement>): void;
}

export const SelectAnchor = forwardRef<HTMLDivElement, PropsWithChildren<SelectAnchorProps>>(
  function SelectAnchor(props, ref) {
    const { children, className, iconDropdown, opened, wrapper: Wrapper = Fragment, separator, truncate, onClick } = props;

    return (
      <div ref={ref} className={clsx("border rounded cursor-pointer w-full hover:border-blue-500", className)}>
        <Wrapper>
          <div
            className="flex items-center justify-between w-full p-2 overflow-hidden text-sm"
            onClick={onClick}
          >
            <div className={clsx("flex-1 min-w-0", truncate ? "truncate" : "")}>
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
