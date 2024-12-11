import { forwardRef, PropsWithChildren } from "react";
import { SelectPortalRef, SelectPrimitive } from "./types";
import { SelectDialog } from "./SelectDialog";
import clsx from "clsx";

export interface SelectModalProps {
  opened?: boolean;
  width?: SelectPrimitive;
  maxHeight?: SelectPrimitive;
  className?: string;
  backdrop?: "static" | "closeable";
  zIndex?: number;
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
    open: ["opacity-100", "scale-100"],
    close: ["opacity-0", "scale-90"],
  },
};

export const SelectModal = forwardRef<SelectPortalRef, PropsWithChildren<SelectModalProps>>(
  function SelectModal(props, ref) {
    const {
      opened,
      width = 500,
      maxHeight,
      className,
      classNames = {},
      children,
      backdrop,
      zIndex,
      onClose
    } = props;

    return (
      <SelectDialog
        ref={ref}
        opened={opened}
        onClose={onClose}
        animation={Animated}
        zIndex={zIndex}
        className={clsx("rounded-lg", className)}
        backdrop={backdrop}
        maxHeight={maxHeight}
        classNames={{
          ...classNames,
          portal: clsx("flex items-center justify-center", classNames.portal)
        }}
        style={{
          width,
          maxWidth: "100dvw",
        }}
      >
        {children}
      </SelectDialog>
    );
  }
);
