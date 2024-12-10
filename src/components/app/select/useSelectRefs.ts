import { useRef } from "react";
import { SelectPortalRef } from "./types";

export function useSelectRefs() {
  const listLeft = useRef<HTMLDivElement>(null);
  const listRight = useRef<HTMLDivElement>(null);
  const anchor = useRef<HTMLDivElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const portal = useRef<SelectPortalRef>(null);

  return {
    anchor,
    listLeft,
    listRight,
    search,
    portal,
  } as const;
}