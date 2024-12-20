import {
  forwardRef,
  PropsWithChildren,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from "react";
import { SelectPortal } from "./SelectPortal";
import { SelectPortalRef, SelectPrimitive, SelectRefs } from "./types";
import { calcDropdownWidth } from "./utils";
import clsx from "clsx";

export interface SelectDropdownProps {
  offset?: number;
  maxHeight?: SelectPrimitive;
  splitColumns?: boolean;
  menuWidth?: SelectPrimitive;
  autoFit?: boolean;
  refs: Pick<SelectRefs, "listLeft" | "listRight" | "anchor">;
  zIndex?: number;
  onClose?(): void;
}

export const SelectDropdown = forwardRef<SelectPortalRef, PropsWithChildren<SelectDropdownProps>>(
  function SelectDropdown(props, ref) {
    const {
      refs,
      offset = 4,
      maxHeight,
      splitColumns,
      menuWidth,
      children,
      autoFit = true,
      zIndex,
      onClose
    } = props;

    const [isOpen, setIsOpen] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }));

    useEffect(() => {
      if (!isOpen || !refs.anchor.current || !dropdownRef.current) {
        return;
      }

      function updatePosition() {
        if (!refs.anchor.current || !dropdownRef.current || typeof window === "undefined") {
          return;
        }

        dropdownRef.current.style.top = "";
        dropdownRef.current.style.bottom = "";
        dropdownRef.current.style.height = "";

        const containerRect = refs.anchor.current.getBoundingClientRect();
        const dropdownRect = dropdownRef.current.getBoundingClientRect();

        const topOfDropdown = containerRect.bottom + offset;
        const ratio = splitColumns ? 2 : 1;

        const dropdownHeight = Math.min(
          window.innerHeight - containerRect.height - offset,
          maxHeight === undefined
            ? dropdownRef.current.scrollHeight
            : Math.min(dropdownRef.current.scrollHeight, dropdownRect.height)
        );

        const w = calcDropdownWidth(menuWidth, ratio);
        const rectWidth = containerRect.width * ratio;
        const dropdownWidth = w ? w === "auto" ? rectWidth : w : rectWidth;

        dropdownRef.current.style.width = dropdownWidth as string;
        dropdownRef.current.style.left = `${containerRect.left}px`;

        if (autoFit) {
          const above = containerRect.top - offset;
          const bellow = window.innerHeight - containerRect.bottom - offset;

          if (dropdownHeight > bellow) {
            if (above > bellow) {
              const height = Math.min(dropdownHeight, above);
              dropdownRef.current.style.top = `${window.scrollY + containerRect.top - height}px`;
              dropdownRef.current.style.height = `${height - offset}px`;
            } else {
              dropdownRef.current.style.top = `${containerRect.bottom + offset + window.scrollY}px`;
              dropdownRef.current.style.height = `${Math.min(dropdownHeight, bellow)}px`;
            }
          } else {
            dropdownRef.current.style.top = `${containerRect.bottom + offset + window.scrollY}px`;
            dropdownRef.current.style.height = `${Math.min(dropdownHeight, bellow)}px`;
          }
        } else if (
          topOfDropdown + dropdownHeight > window.innerHeight &&
          dropdownHeight + offset < containerRect.top
        ) {
          dropdownRef.current.style.top = `${containerRect.top - offset - dropdownHeight + window.scrollY}px`;
        } else {
          dropdownRef.current.style.top = `${containerRect.bottom + offset + window.scrollY}px`;
        }
      }

      requestAnimationFrame(updatePosition);

      const resizeObserver = new ResizeObserver(updatePosition);
      const intersectionObserver = new IntersectionObserver(updatePosition);
      resizeObserver.observe(refs.anchor.current!);
      resizeObserver.observe(dropdownRef.current);
      resizeObserver.observe(refs.listLeft.current!);
      refs.listRight.current && resizeObserver.observe(refs.listRight.current);
      intersectionObserver.observe(refs.anchor.current!);

      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition);

      return () => {
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition);
        resizeObserver.disconnect();
        intersectionObserver.disconnect();
      };
    }, [isOpen, offset, refs, splitColumns, menuWidth, autoFit, maxHeight]);

    useEffect(() => {
      if (typeof document === "undefined") {
        return;
      }

      function handleClickOutside(e: MouseEvent) {
        if (!refs.anchor.current || !dropdownRef.current) {
          return;
        }

        if (
          !refs.anchor.current ||
          !dropdownRef.current ||
          refs.anchor.current?.contains(e.target as Node) ||
          refs.anchor.current.isEqualNode(e.target as Node) ||
          dropdownRef.current?.contains(e.target as Node) ||
          dropdownRef.current?.isEqualNode(e.target as Node)
        ) {
          return;
        }

        onClose?.();
        setIsOpen(false);
      }

      document.addEventListener("click", handleClickOutside);

      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }, [onClose, refs.anchor]);

    return (
      <SelectPortal show={isOpen}>
        <div
          ref={dropdownRef}
          className={clsx(
            "absolute w-full bg-white border rounded shadow-lg text-slate-950 text-sm overflow-y-auto",
            zIndex === undefined && "z-10"
          )}
          style={{ maxHeight, zIndex }}
        >
          {children}
        </div>
      </SelectPortal>
    );
  }
);
