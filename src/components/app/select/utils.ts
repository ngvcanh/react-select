import { SyntheticEvent } from "react";
import { SelectAsChild, SelectItem, SelectItemGroup, SelectItemOption, SelectPrimitive, SelectRenderValueParams, SelectSize } from "./types";

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

export interface SelectNormalizeOption {
  getOptionValue?(item: SelectItem): SelectPrimitive;
  getOptionLabel?(item: SelectItem): SelectPrimitive;
  isGroup?(item: SelectItem): item is SelectItemGroup;
}

export interface SelectNormalizedOptions extends SelectNormalizeOption {
  items: SelectItem[];
  asChild?: SelectAsChild;
  getRelatedKey?(): string;
}

export function normalizeOption(option: SelectItem, props: SelectNormalizeOption) {
  const { isGroup, getOptionLabel, getOptionValue } = props;

  const group = !!(isGroup?.(option) || !!option.group);
  const label = getOptionLabel?.(option) || option.label || "";
  const value = getOptionValue?.(option) || option.value || label;
  const children: SelectItemOption[] | undefined = group ? [] : undefined;

  return { value, label, group, children } as SelectItem<SelectPrimitive>;
}

export function normalizeParentOptions(props: SelectNormalizedOptions) {
  const { items, getRelatedKey } = props;
  const relatedKey = getRelatedKey?.() || "children";
  
  return items.map((item) => {
    const normalized = normalizeOption(item, props);

    normalized.children = normalizeParentOptions({
      ...props,
      items: Array.isArray(item[relatedKey]) ? item[relatedKey] : [],
    }) as SelectItemOption<SelectPrimitive>[];

    normalized.group = !!normalized.children?.length

    return { ...item, ...normalized };
  }) as SelectItem<SelectPrimitive>[];
}

export function normalizeRelatedOptions(
  props: SelectNormalizedOptions,
  parent?: SelectPrimitive
): SelectItem<SelectPrimitive>[] {
  const { items, getRelatedKey } = props;
  const relatedKey = getRelatedKey?.() || "parent";

  return items
    .filter((item) => parent === undefined ? !item[relatedKey] : item[relatedKey] === parent)
    .map((item) => {
      const normalized = normalizeOption(item, props);
      normalized.children = normalizeRelatedOptions(props, normalized.value) as SelectItemOption<SelectPrimitive>[];

      return {
        ...item,
        ...normalized,
        group: !!normalized.children?.length
      } as SelectItem<SelectPrimitive>
    }) as SelectItem<SelectPrimitive>[];
}

export function normalizeFlatOptions(props: SelectNormalizedOptions) {
  const { items } = props;
  const result: SelectItem<SelectPrimitive>[] = [];
  let group: SelectItemGroup<SelectPrimitive> | null = null;

  items.forEach((item) => {
    const normalized = normalizeOption(item, props);

    if (normalized.group) {
      group && result.push(group);
      group = { ...item, ...normalized } as SelectItemGroup<SelectPrimitive>;
    } else if (group) {
      group.children?.push({ ...item, ...normalized } as SelectItemOption<SelectPrimitive>);
    } else {
      result.push({ ...item, ...normalized } as SelectItemOption<SelectPrimitive>);
    }
  });

  group && result.push(group);
  return result as SelectItem<SelectPrimitive>[];
}

export function normalizeOptions(props: SelectNormalizedOptions): SelectItem<SelectPrimitive>[] {
  const { asChild } = props;

  if (asChild === "parent") {
    return normalizeParentOptions(props);
  }

  if (asChild === "related") {
    return normalizeRelatedOptions(props);
  }

  return normalizeFlatOptions(props);
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
