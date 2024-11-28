import { SyntheticEvent } from "react";
import { SelectItem, SelectItemGroup, SelectItemOption, SelectPrimitive, SelectRenderValueParams } from "./types";

export function defaultRenderValue(option: SelectItem, params: SelectRenderValueParams) {
  const { multiple, isLast } = params;
  return option?.label + (multiple && !isLast ? ", " : "");
}

export function createEvent(name: string | undefined, value: SelectPrimitive | SelectPrimitive[]) {
  return {
    target: { name, value },
    currentTarget: { name, value }
  } as unknown as SyntheticEvent;
}

export function normalizeValue(value?: SelectPrimitive | SelectPrimitive[]): SelectPrimitive[] {
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

export interface SelectNormalizedOptions {
  items: SelectItem[];
  asChild?: boolean;
  getOptionValue?(item: SelectItem): SelectPrimitive;
  getOptionLabel?(item: SelectItem): SelectPrimitive;
  isGroup?(item: SelectItem): item is SelectItemGroup;
}

export function normalizeOptions(props: SelectNormalizedOptions): SelectItem<SelectPrimitive>[] {
  const {
    items,
    asChild,
    isGroup,
    getOptionValue,
    getOptionLabel,
  } = props;

  if (asChild) {
    return items as SelectItem<SelectPrimitive>[];
  }

  const result: SelectItem[] = [];
  let group: SelectItemGroup | null = null;

  items.forEach((item) => {
    const isItemGroup = isGroup ? isGroup(item) : !!item.group;
    const value = getOptionValue ? getOptionValue(item) : item.value;
    const label = getOptionLabel ? getOptionLabel(item) : item.label || "";

    if (isItemGroup) {
      if (group) {
        result.push(group);
      }

      group = {
        ...item,
        value,
        label,
        group: true,
        children: []
      } as SelectItemGroup;
    } else if (group) {
      group.children?.push({
        ...item,
        value,
        label
      } as SelectItemOption);
    } else {
      result.push({
        ...item,
        value,
        label
      } as SelectItemOption);
    }

  });

  if (group) {
    result.push(group);
  }

  return result as SelectItem<SelectPrimitive>[];
}
