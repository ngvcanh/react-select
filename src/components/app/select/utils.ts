import { SyntheticEvent } from "react";
import { SelectItem, SelectItemGroup, SelectItemOption, SelectPrimitive, SelectRenderValueParams, SelectSize } from "./types";

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

export function flattenOptions(options: SelectItem<SelectPrimitive>[]): SelectItem<SelectPrimitive>[] {
  return options.reduce((acc, option) => {
    if (option.group) {
      return [...acc, ...option.children ?? []] as SelectItem<SelectPrimitive>[];
    }

    return [...acc, option];
  }, [] as SelectItem<SelectPrimitive>[]);
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

export const sizes = {
  "3xs": {
    select: "min-h-6",
    anchor: "min-h-[22px] px-1",
    anchorText: "text-xs",
    chipWrapper: "py-1",
    chip: "h-[14px] text-[10px] px-1 gap-0.5",
    chipIcon: "-mr-1"
  },
  "2xs": {
    select: "min-h-7",
    anchor: "min-h-[26px] px-1",
    anchorText: "text-xs",
    chipWrapper: "py-1",
    chip: "h-[18px] px-1 text-xs gap-0.5",
    chipIcon: "-mr-1"
  },
  xs: {
    select: "min-h-8",
    anchor: "min-h-[30px] px-2",
    anchorText: "text-sm",
    chipWrapper: "py-1",
    chip: "h-[22px] px-1 text-xs gap-0.5",
    chipIcon: "-mr-1"
  },
  sm: {
    select: "min-h-9",
    anchor: "min-h-[34px] px-2",
    anchorText: "text-sm",
    chipWrapper: "py-1",
    chip: "h-6 px-1 text-xs gap-0.5",
    chipIcon: "-mr-1"
  },
  md: {
    select: "min-h-10",
    anchor: "min-h-[38px] px-2",
    anchorText: "text-sm",
    chipWrapper: "py-1.5",
    chip: "h-[26px] px-1.5 gap-1 text-sm",
    chipIcon: "-mr-1.5"
  },
  lg: {
    select: "min-h-11",
    anchor: "min-h-[42px] px-2",
    anchorText: "text-base",
    chipWrapper: "py-1.5",
    chip: "h-[30px] px-2 gap-1.5 text-base",
    chipIcon: "-mr-2"
  },
  "xl": {
    select: "min-h-12",
    anchor: "min-h-[46px] px-2",
    anchorText: "text-base",
    chipWrapper: "py-1.5",
    chip: "h-[34px] px-2 gap-1.5 text-base",
    chipIcon: "-mr-2"
  },
  "2xl": {
    select: "min-h-13",
    anchor: "min-h-[50px] px-2",
    anchorText: "text-lg",
    chipWrapper: "py-2",
    chip: "h-[36px] px-2 gap-1.5 text-lg",
    chipIcon: "-mr-2"
  },
  "3xl": {
    select: "min-h-14",
    anchor: "min-h-[54px] px-2",
    anchorText: "text-lg",
    chipWrapper: "py-2",
    chip: "h-[38px] px-2 gap-1.5 text-lg",
    chipIcon: "-mr-2"
  },
};

export function getSelectSize(size: SelectSize) {
  if (typeof size === "string") {
    const classes = sizes[size];
    return { classes };
  }
  
  const styles = {};
  return { styles };
}
