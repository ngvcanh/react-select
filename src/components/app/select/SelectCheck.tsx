import clsx from "clsx";
import { SelectItemOption, SelectPrimitive } from "./types";
import { isSelectedStatus } from "./utils";

type SelectCheckSize = "sm" | "md" | "lg";

export interface SelectCheckProps {
  size?: SelectCheckSize;
  value: SelectPrimitive[];
  options: SelectItemOption<SelectPrimitive>[];
}

const sizes = {
  sm: "w-4 min-w-4 h-4",
  md: "w-5 min-w-5 h-5",
  lg: "w-6 min-w-6 h-6",
}

const beforeSizes = {
  checkedall: {
    sm: "before:w-2 before:h-1 before:-translate-y-[0.5px]",
    md: "before:w-3 before:h-1.5 before:-translate-y-[1px]",
    lg: "before:w-[14px] before:h-1.5 before:-translate-y-[1.5px]",
  },
  checkedmember: {
    sm: "before:w-[10px] before:h-0",
    md: "before:w-3 before:h-0",
    lg: "before:w-[14px] before:h-0",
  },
  uncheck: {},
};

export function SelectCheck(props: SelectCheckProps) {
  const { value, options, size = "md" } = props;

  const status = isSelectedStatus(options, value);
  const isUncheck = !status.some && !status.all;
  const state = status.all ? "checkedall" : status.some ? "checkedmember" : "uncheck";

  return (
    <span 
      className={clsx(
        "inline-flex items-center justify-center border border-blue-400 rounded relative transition-all duration-200",
        "before:absolute before:border-b-2 before:border-l-2 before:transition-all before:duration-200",
        sizes[size],
        {
          "bg-blue-400": !isUncheck,
          "before:border-transparent before:rotate-0 before:border-0 before:scale-0": isUncheck,
          "before:border-white": !isUncheck,
          "before:scale-100 before:rotate-0": status.some,
          "before:-rotate-45 before:scale-100": status.all,
        },
        state !== "uncheck" && beforeSizes[state][size],
      )}
    />
  );
}