import { forwardRef, PropsWithChildren } from "react";
import { SelectPortalRef, SelectPrimitive } from "./types";
import { SelectDialog } from "./SelectDialog";
import clsx from "clsx";

export interface SelectSheetProps {
  opened?: boolean;
  maxHeight?: SelectPrimitive;
  menuHeight?: SelectPrimitive;
  backdrop?: "static" | "closeable";
  className?: string;
  classNames?: {
    portal?: string;
    backdrop?: string;
  }
  onClose?(): void;
}

const Animated = {
  backdrop: {
    open: ["opacity-100"],
    close: ["opacity-0"],
  },
  body: {
    open: ["translate-y-0"],
    close: ["translate-y-full"],
  },
};

export const SelectSheet = forwardRef<SelectPortalRef, PropsWithChildren<SelectSheetProps>>(
  function SelectSheet(props, ref) {
    const { opened, maxHeight, menuHeight, children, backdrop = "closeable", className, classNames = {}, onClose } = props;

    return (
      <SelectDialog
        ref={ref}
        opened={opened}
        animation={Animated}
        backdrop={backdrop}
        onClose={onClose}
        className={clsx("rounded-t-lg w-full", className)}
        classNames={{
          ...classNames,
          portal: clsx("flex items-end", classNames.portal)
        }}
        maxHeight={maxHeight}
        style={{
          height: menuHeight,
        }}
      >
        {children}
      </SelectDialog>
    );
  }
);