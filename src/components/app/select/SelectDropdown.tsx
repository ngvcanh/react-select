import { forwardRef, PropsWithChildren, RefObject, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { SelectPortal } from "./SelectPortal";
import { SelectPortalRef, SelectPrimitive } from "./types";

export interface SelectDropdownProps {
  anchorRef: RefObject<HTMLDivElement>;
  offset?: number;
  maxHeight?: SelectPrimitive;
  onClose?(): void;
}

export const SelectDropdown = forwardRef<SelectPortalRef, PropsWithChildren<SelectDropdownProps>>(
  function SelectDropdown(props, ref) {
    const { offset = 4, anchorRef, maxHeight, onClose, children } = props;

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

        const containerRect = anchorRef.current.getBoundingClientRect();
        const dropdownRect = dropdownRef.current.getBoundingClientRect();

        const topOfDropdown = containerRect.bottom + offset;
        const dropdownHeight = dropdownRect.height;

        dropdownRef.current.style.width = `${containerRect.width}px`;
        dropdownRef.current.style.left = `${containerRect.left}px`;

        if (
          topOfDropdown + dropdownHeight > window.innerHeight &&
          dropdownHeight + offset < containerRect.top
        ) {
          dropdownRef.current.style.top = `${containerRect.top - offset -dropdownHeight}px`;
        } else {
          dropdownRef.current.style.top = `${containerRect.bottom + offset}px`;
        }
      }

      const resizeObserver = new ResizeObserver(updatePosition);
      const mutationServer = new MutationObserver(updatePosition);
      const intersectionObserver = new IntersectionObserver(updatePosition, {
        root: null,
        rootMargin: "0px",
        threshold: [0, 1],
      });

      resizeObserver.observe(anchorRef.current);
      resizeObserver.observe(dropdownRef.current);
      intersectionObserver.observe(anchorRef.current);

      mutationServer.observe(dropdownRef.current, {
        childList: true,
        subtree: true,
        characterData: true,
      });

      requestAnimationFrame(updatePosition);

      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition);

      return () => {
        resizeObserver.disconnect();
        mutationServer.disconnect();
        intersectionObserver.disconnect();
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition);
      };
    }, [isOpen, offset, anchorRef]);

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

    const getMaxHeight = useCallback(() => {
      if (typeof window === "undefined" || !anchorRef.current || typeof maxHeight !== "undefined") {
        return maxHeight;
      }

      const { innerHeight } = window;
      const anchorHeight = anchorRef.current.getBoundingClientRect().height + offset;

      return `${innerHeight - anchorHeight}px`;
    }, [anchorRef, maxHeight, offset]);

    return (
      <SelectPortal show={isOpen}>
        <div
          ref={dropdownRef}
          className="fixed z-10 w-full bg-white border rounded shadow-lg text-slate-950 text-sm"
          style={{ maxHeight: getMaxHeight() }}
        >
          {children}
        </div>
      </SelectPortal>
    );
  }
);
