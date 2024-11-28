export type SelectPrimitive = string | number;

export interface SelectOption {
  label: SelectPrimitive;
  value: string | number;
  disabled?: boolean;
}

export interface SelectRenderValueParams {
  multiple: boolean;
  isLast: boolean;
  index: number;
}

export interface SelectPortalRef {
  open(): void;
  close(): void;
}
