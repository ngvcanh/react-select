"use client";

import clsx from "clsx";
import { useState } from "react";

type CheckSize = "sm" | "md" | "lg";

const sizes = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
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
  }
};

export default function CheckPage() {
  const [state, setState] = useState<"uncheck" | "checkedmember" | "checkedall">("uncheck");
  const [size, setSize] = useState<CheckSize>("md");

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <div className="mb-10 flex gap-6">
        <button onClick={() => setState("uncheck")} className={state === "uncheck" ? "text-blue-400" : ""}>
          Uncheck
        </button>
        <button onClick={() => setState("checkedmember")} className={state === "checkedmember" ? "text-blue-400" : ""}>
          Checked Member
        </button>
        <button onClick={() => setState("checkedall")} className={state === "checkedall" ? "text-blue-400" : ""}>
          Checked All
        </button>
      </div>
      <div className="w-10 h-10 min-h-10 flex items-center justify-center">
        <span 
          className={clsx(
            "inline-flex items-center justify-center border border-blue-400 rounded relative transition-all duration-200",
            "before:absolute before:border-b-2 before:border-l-2 before:transition-all before:duration-200",
            sizes[size],
            {
              "bg-blue-400": state !== "uncheck",
              "before:border-transparent before:rotate-0 before:border-0 before:scale-0": state === "uncheck",
              "before:border-white": state !== "uncheck",
              "before:scale-100 before:rotate-0": state === "checkedmember",
              "before:-rotate-45 before:scale-100": state === "checkedall",
            },
            state !== "uncheck" && beforeSizes[state][size],
          )}
        />
      </div>
      <div className="mt-10 flex gap-6">
        <button onClick={() => setSize("sm")} className={size === "sm" ? "text-blue-400" : ""}>
          sm
        </button>
        <button onClick={() => setSize("md")} className={size === "md" ? "text-blue-400" : ""}>
          md
        </button>
        <button onClick={() => setSize("lg")} className={size === "lg" ? "text-blue-400" : ""}>
          lg
        </button>
      </div>
    </div>
  );
}
