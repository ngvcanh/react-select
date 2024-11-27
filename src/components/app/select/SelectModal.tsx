import { forwardRef, PropsWithChildren, useImperativeHandle, useState } from "react";
import { SelectPrimitive } from "./types";
import { createPortal } from "react-dom";

export interface SelectModalRef {
  open(): void;
  close(): void;
}

export interface SelectModalProps {
  width?: SelectPrimitive;
  maxHeight?: SelectPrimitive;
}

export const SelectModal = forwardRef<SelectModalRef, PropsWithChildren<SelectModalProps>>(
  function SelectModal(props, ref) {
    const { width, maxHeight, children } = props;
    const [isOpen, setIsOpen] = useState(false);

    useImperativeHandle(ref, () =>({
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }));

    const handleClickBackdrop = () => {
      setIsOpen(false);
    };

    if (!isOpen || typeof document === "undefined") {
      return null;
    }

    return createPortal(
      <div className="fixed inset-0 overflow-hidden flex items-center justify-center">
        <div
          className="fixed inset-0 bg-black/40"
          onClick={handleClickBackdrop}
        />
        <div
          className="overflow-y-auto"
          style={{
            width,
            maxWidth: "100dvw",
            maxHeight: maxHeight || "100dvh",
          }}
        >
          {children}
        </div>
      </div>,
      document.body
    );
  }
);
