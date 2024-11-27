import { createPortal } from "react-dom";

export function SelectPortal() {

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <></>,
    document.body
  );
}