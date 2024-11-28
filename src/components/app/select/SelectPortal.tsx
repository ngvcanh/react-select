import { PropsWithChildren } from "react";
import { createPortal } from "react-dom";

export interface SelectPortalProps {
  show: boolean;
}

export function SelectPortal(props: PropsWithChildren<SelectPortalProps>) {
  const { children, show } = props;

  if (!show || typeof document === "undefined") {
    return null;
  }

  return createPortal(<>{children}</>, document.body);
}