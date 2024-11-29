import { useEffect, useRef } from "react";

export function usePreventBodyScroll(isOpen: boolean) {
  const overflow = useRef<string>("");

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
}