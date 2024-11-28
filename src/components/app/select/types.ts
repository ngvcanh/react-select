export type SelectPrimitive = string | number;

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
  children?: SelectItemOption[];
}

export interface SelectItemOption<Type = unknown> extends Record<string, unknown> {
  group?: false;
  label?: Type;
  value?: Type;
  disabled?: boolean;
}

export type SelectItem<Type = unknown> = SelectItemGroup<Type> | SelectItemOption<Type>;
