import { SyntheticEvent } from "react";
import { SelectOption, SelectPrimitive, SelectRenderValueParams } from "./types";

export function defaultRenderValue(option: SelectOption, params: SelectRenderValueParams) {
  const { multiple, isLast } = params;
  return option?.label + (multiple && !isLast ? ", " : "");
}

export function createEvent(name: string | undefined, value: SelectPrimitive | SelectPrimitive[]) {
  return {
    target: { name, value },
    currentTarget: { name, value }
  } as unknown as SyntheticEvent;
}

export function normalize(value?: SelectPrimitive | SelectPrimitive[]): SelectPrimitive[] {
  return Array.isArray(value) ? value : typeof value !== "undefined" ? [value] : [];
}

export function isEquals(newValue: SelectPrimitive[], oldValue: SelectPrimitive[]) {
  newValue = newValue.filter((v, i, s) => v && s.indexOf(v) === i);
  oldValue = oldValue.filter((v, i, s) => v && s.indexOf(v) === i);

  if (newValue.length !== oldValue.length) {
    return false;
  }

  return newValue.every((value) => oldValue.includes(value));
}

export function toggleValue(value: SelectPrimitive, current: SelectPrimitive[], maxSelect = -1) {
  return current.includes(value)
    ? current.filter((val) => val !== value)
    : (
      maxSelect < 1 || current.length < maxSelect
        ? [...current, value]
        : current
    );
}
