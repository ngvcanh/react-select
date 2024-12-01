import {
  CSSProperties,
  forwardRef,
  PropsWithChildren,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from "react";
import { SelectPortalBackdrop, SelectPortalRef, SelectPrimitive } from "./types";
import { usePreventBodyScroll } from "./usePreventBodyScroll";
import { SelectPortal } from "./SelectPortal";
import clsx from "clsx";

export interface SelectDialogProps {
  opened?: boolean;
  onClose?(): void;
  backdrop?: SelectPortalBackdrop;
  className?: string;
  classNames?: {
    portal?: string;
    backdrop?: string;
  };
  animation: {
    backdrop: {
      open: string[];
      close: string[];
    };
    body: {
      open: string[];
      close: string[];
    };
  };
  maxHeight?: SelectPrimitive;
  style?: CSSProperties;
}

export const SelectDialog = forwardRef<SelectPortalRef, PropsWithChildren<SelectDialogProps>>(
  function SelectDialog(props, ref) {
    const {
      opened = false,
      onClose,
      backdrop = "closeable",
      className,
      classNames = {},
      animation,
      maxHeight = "100dvh",
      children,
      style = {}
    } = props;

    const [isOpen, setIsOpen] = useState(opened);

    const mounted = useRef(false);
    const bodyRef = useRef<HTMLDivElement | null>(null);
    const backdropRef = useRef<HTMLDivElement | null>(null);

    usePreventBodyScroll(isOpen);

    const animateBackdrop = useCallback((state?: boolean) => {
      if (typeof state === "undefined") {
        [...animation.backdrop.open, ...animation.backdrop.close].forEach((className) => {
          backdropRef.current?.classList.toggle(className);
        });
      } else if (state) {
        animation.backdrop.open.forEach((className) => {
          backdropRef.current?.classList.add(className);
        });
        animation.backdrop.close.forEach((className) => {
          backdropRef.current?.classList.remove(className);
        });
      } else {
        animation.backdrop.open.forEach((className) => {
          backdropRef.current?.classList.remove(className);
        });
        animation.backdrop.close.forEach((className) => {
          backdropRef.current?.classList.add(className);
        });
      }
    }, [animation.backdrop]);

    const animateBody = useCallback((state?: boolean) => {
      if (typeof state === "undefined") {
        [...animation.body.open, ...animation.body.close].forEach((className) => {
          bodyRef.current?.classList.toggle(className);
        });
      } else if (state) {
        animation.body.open.forEach((className) => {
          bodyRef.current?.classList.add(className);
        });
        animation.body.close.forEach((className) => {
          bodyRef.current?.classList.remove(className);
        });
      } else {
        animation.body.open.forEach((className) => {
          bodyRef.current?.classList.remove(className);
        });
        animation.body.close.forEach((className) => {
          bodyRef.current?.classList.add(className);
        });
      }
    }, [animation.body]);

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
        <div className={clsx("fixed inset-0 overflow-hidden z-50", classNames.portal)}>
          <div
            ref={backdropRef}
            className={clsx(
              "fixed inset-0 bg-black/40 transition-opacity duration-300",
              animation.backdrop.close,
              classNames.backdrop
            )}
            onClick={handleClickBackdrop}
          />
          <div
            ref={bodyRef}
            className={clsx(
              "relative overflow-y-auto bg-white text-slate-800 transition-all duration-300",
              animation.body.close,
              className
            )}
            style={{
              ...style,
              maxHeight,
            }}
          >
            {children}
          </div>
        </div>
      </SelectPortal>
    );
  }
);
