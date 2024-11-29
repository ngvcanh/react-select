import { forwardRef, PropsWithChildren, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { SelectPortalRef, SelectPrimitive } from "./types";
import { SelectPortal } from "./SelectPortal";
import clsx from "clsx";

export interface SelectModalProps {
  width?: SelectPrimitive;
  maxHeight?: SelectPrimitive;
  className?: string;
  backdrop?: "static" | "closeable";
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
      width = 500,
      maxHeight,
      className,
      classNames = {},
      children,
      backdrop = "closeable",
      onClose
    } = props;
    const [isOpen, setIsOpen] = useState(false);

    const mounted = useRef(false);
    const overflow = useRef<string>("");
    const bodyRef = useRef<HTMLDivElement | null>(null);
    const backdropRef = useRef<HTMLDivElement | null>(null);

    const animateBackdrop = useCallback((state?: boolean) => {
      if (typeof state === "undefined") {
        [...Animated.backdrop.open, ...Animated.backdrop.close].forEach((className) => {
          backdropRef.current?.classList.toggle(className);
        });
      } else if (state) {
        Animated.backdrop.open.forEach((className) => {
          backdropRef.current?.classList.add(className);
        });
        Animated.backdrop.close.forEach((className) => {
          backdropRef.current?.classList.remove(className);
        });
      } else {
        Animated.backdrop.open.forEach((className) => {
          backdropRef.current?.classList.remove(className);
        });
        Animated.backdrop.close.forEach((className) => {
          backdropRef.current?.classList.add(className);
        });
      }
    }, []);

    const animateBody = useCallback((state?: boolean) => {
      if (typeof state === "undefined") {
        [...Animated.body.open, ...Animated.body.close].forEach((className) => {
          bodyRef.current?.classList.toggle(className);
        });
      } else if (state) {
        Animated.body.open.forEach((className) => {
          bodyRef.current?.classList.add(className);
        });
        Animated.body.close.forEach((className) => {
          bodyRef.current?.classList.remove(className);
        });
      } else {
        Animated.body.open.forEach((className) => {
          bodyRef.current?.classList.remove(className);
        });
        Animated.body.close.forEach((className) => {
          bodyRef.current?.classList.add(className);
        });
      }
    }, []);

    const animate = useCallback((state?: boolean) => {
      animateBackdrop(state);
      animateBody(state);
    }, [animateBackdrop, animateBody]);

    const handleClose = useCallback(() => {
      if (!isOpen) {
        return;
      }

      animate(false);
      setTimeout(() => {
        mounted.current && setIsOpen(false);
        onClose?.();
      }, 300);
    }, [animate, isOpen, onClose]);

    useImperativeHandle(ref, () =>({
      open: () => setIsOpen(true),
      close: handleClose
    }));

    useEffect(() => {
      if (typeof document === "undefined") {
        return;
      }

      if (isOpen) {
        overflow.current = document.body.style.overflow;
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = overflow.current;
        overflow.current = "";
      }
    }, [isOpen]);

    useEffect(() => {
      if (!isOpen) {
        return;
      }

      requestAnimationFrame(() => animate(true));
    }, [isOpen, animate]);

    useEffect(() => {
      mounted.current = true;

      return () => {
        mounted.current = false;
      };
    }, []);

    const handleClickBackdrop = () => backdrop === "closeable" && handleClose();

    return (
      <SelectPortal show={isOpen}>
        <div className={clsx("fixed inset-0 overflow-hidden flex items-center justify-center", classNames.portal)}>
          <div
            ref={backdropRef}
            className={clsx(
              "fixed inset-0 bg-black/40 transition-opacity duration-300",
              Animated.backdrop.close,
              classNames.backdrop
            )}
            onClick={handleClickBackdrop}
          />
          <div
            ref={bodyRef}
            className={clsx(
              "relative overflow-y-auto bg-white text-slate-800 rounded-lg transition-all duration-300",
              Animated.body.close,
              className
            )}
            style={{
              width,
              maxWidth: "100dvw",
              maxHeight: maxHeight || "100dvh",
            }}
          >
            {children}
          </div>
        </div>
      </SelectPortal>
    );
  }
);
