import {
  forwardRef,
  PropsWithChildren,
  RefObject,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from "react";
import { SelectPortal } from "./SelectPortal";
import { SelectPortalRef, SelectPrimitive } from "./types";
import { calcDropdownWidth } from "./utils";

export interface SelectDropdownProps {
  anchorRef: RefObject<HTMLDivElement>;
  offset?: number;
  maxHeight?: SelectPrimitive;
  splitColumns?: boolean;
  menuWidth?: SelectPrimitive;
  autoFit?: boolean;
  onClose?(): void;
}

export const SelectDropdown = forwardRef<SelectPortalRef, PropsWithChildren<SelectDropdownProps>>(
  function SelectDropdown(props, ref) {
    const {
      offset = 4,
      anchorRef,
      maxHeight,
      splitColumns,
      menuWidth,
      children,
      autoFit = true,
      onClose
    } = props;

    const [isOpen, setIsOpen] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }));

    useEffect(() => {
      if (!isOpen || !anchorRef.current || !dropdownRef.current) {
        return;
      }

      function updatePosition() {
        if (!anchorRef.current || !dropdownRef.current || typeof window === "undefined") {
          return;
        }

        dropdownRef.current.style.top = "";
        dropdownRef.current.style.bottom = "";
        dropdownRef.current.style.height = "";

        const containerRect = anchorRef.current.getBoundingClientRect();
        const dropdownRect = dropdownRef.current.getBoundingClientRect();

        const topOfDropdown = containerRect.bottom + offset;
        const ratio = splitColumns ? 2 : 1;

        const dropdownHeight = maxHeight === undefined
          ? dropdownRef.current.scrollHeight
          : Math.min(dropdownRef.current.scrollHeight, dropdownRect.height);
        

        const w = calcDropdownWidth(menuWidth, ratio);
        const rectWidth = containerRect.width * ratio;
        const dropdownWidth = w ? w === "auto" ? rectWidth : w : rectWidth;

        dropdownRef.current.style.width = `${dropdownWidth}px`;
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

      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition);

      return () => {
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition);
      };
    }, [isOpen, offset, anchorRef, splitColumns, menuWidth, autoFit, maxHeight]);

    useEffect(() => {
      if (typeof document === "undefined") {
        return;
      }

      function handleClickOutside(e: MouseEvent) {
        if (
          anchorRef.current?.contains(e.target as Node) ||
          dropdownRef.current?.contains(e.target as Node)
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
    }, [onClose, anchorRef]);

    return (
      <SelectPortal show={isOpen}>
        <div
          ref={dropdownRef}
          className="absolute z-10 w-full bg-white border rounded shadow-lg text-slate-950 text-sm overflow-y-auto"
          style={{ maxHeight }}
        >
          {children}
        </div>
      </SelectPortal>
    );
  }
);
