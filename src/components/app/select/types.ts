import { RefObject } from "react";

export type SelectPrimitive = string | number;
export type SelectTriggerColumn = "hover" | "clicked" | "clickset";
export type SelectResponsiveType = "modal" | "sheet";
export type SelectPortalBackdrop = "static" | "closeable";
export type SelectSize = "3xs" | "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
export type SelectAsChild = "related" | "parent";

export interface SelectRenderValueParams {
  multiple: boolean;
  isLast: boolean;
  index: number;
}

export interface SelectPortalRef {
  open(): void;
  close(): void;
}

export interface SelectItemGroup<Type = unknown> extends Record<string, unknown> {
  group: true;
  label?: Type;
  value?: Type;
  disabled?: boolean;
  children?: SelectItemOption<Type>[];
}

export interface SelectItemOption<Type = unknown> extends Record<string, unknown> {
  group?: false;
  label?: Type;
  value?: Type;
  disabled?: boolean;
  children?: SelectItemOption<Type>[];
}

export type SelectItem<Type = unknown> = SelectItemGroup<Type> | SelectItemOption<Type>;

export interface SelectRenderMenuLabel {
  values: SelectPrimitive[];
  option?: SelectItem<SelectPrimitive> | null;
  setValue(value: SelectPrimitive[]): void;
}

export type SelectOptionHandler<ReturnType> = (option: SelectItem, search: string) => ReturnType;

export interface SelectRefs {
  listLeft: RefObject<HTMLDivElement>;
  listRight: RefObject<HTMLDivElement>;
  anchor: RefObject<HTMLDivElement>;
  search: RefObject<HTMLInputElement>;
  portal: RefObject<SelectPortalRef>;
}
