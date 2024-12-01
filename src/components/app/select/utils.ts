import { SyntheticEvent } from "react";
import { SelectItem, SelectItemGroup, SelectItemOption, SelectPrimitive, SelectRenderValueParams } from "./types";

export function defaultRenderValue(option: SelectItem, params: SelectRenderValueParams) {
  const { multiple, isLast } = params;
  return option?.label + (multiple && !isLast ? ", " : "");
}

export function createEvent(
  name: string | undefined,
  values: SelectPrimitive[],
  multiple: boolean | undefined
) {
  const value = multiple ? values : (values[0] ?? null);
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

export function toggleValue(values: SelectPrimitive[], current: SelectPrimitive[], maxSelect = -1) {
  if (values.every(value => current.includes(value))) {
    return current.filter(value => !values.includes(value));
  }

  maxSelect = Math.round(maxSelect);
  const missingValues = values.filter(value => !current.includes(value));

  return missingValues.reduce((acc, value) => {
    if (maxSelect > 0 && acc.length >= maxSelect) {
      return acc;
    }

    return [...acc, value];
  }, current);
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

export function calcDropdownWidth(menuWidth: SelectPrimitive | undefined, ratio: number) {
  if (typeof menuWidth === "undefined") {
    return undefined;
  }

  if (typeof menuWidth === "number") {
    return `${menuWidth * ratio}px`;
  }

  if (menuWidth.endsWith("px")) {
    return +menuWidth.replace("px", "") * ratio + "px";
  }

  if (menuWidth.endsWith("%")) {
    return +menuWidth.replace("%", "") * ratio + "%";
  }

  return menuWidth;
}

export function isSelectedStatus(options: SelectItemOption<SelectPrimitive>[], value: SelectPrimitive[]) {
  const members = options.map((option) => option.value!);
  const selected = members.filter((member) => value.includes(member));
  return {
    all: !!members.length && members.length === selected.length,
    some: !!selected.length && selected.length < options.length
  };

}
