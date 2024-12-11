import { CSSProperties, SyntheticEvent } from "react";
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
  const value = getOptionValue?.(option) ?? option.value ?? label;
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

export interface SelectSlugifyOptions {
  separator?: string;
}

export function slugify(str: string, options: SelectSlugifyOptions = {}) {
  str = str
    .toLowerCase()
    .replace(/á|à|ả|ã|ạ|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/g, "a")
    .replace(/đ|Đ/g, "d")
    .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/g, "e")
    .replace(/í|ì|ỉ|ĩ|ị/g, "i")
    .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/g, "o")
    .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/g, "u")
    .replace(/ý|ỳ|ỷ|ỹ|ỵ/g, "y")
    .replace(/\s+/g, "-")
    .replace(/[^\w|-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (options.separator) {
    str = str.replace(/-/g, options.separator);
  }

  return str;
}

export interface SelectSearchResult {
  match: string;
  length: number;
  start: number;
  end: number;
}

const slugOptions = { separator: " " };

export function searchText(original: string, search: string): SelectSearchResult[] {
  const slugified = slugify(search, slugOptions);
  const searchLength = slugified.length;
  const result: SelectSearchResult[] = [];

  if (!searchLength) {
    return result;
  }

  const originalChars = [...original.split("")].map((char, originIndex) => ({
    char,
    originIndex,
    slugified: slugify(char, slugOptions),
  }));

  const originalFiltered = originalChars.filter((obj, index, chars) => {
    if (index === 0) {
      return obj.slugified;
    }

    if (obj.char === " ") {
      return chars[index - 1].slugified;
    }

    return 1;
  });

  if (originalFiltered.length < searchLength) {
    return result;
  }

  for (let index = 0; index < originalFiltered.length;) {
    const firstChar = originalFiltered[index];

    if (firstChar.slugified !== slugified[0]) {
      ++index;
      continue;
    }

    const endIndex = index + searchLength;

    if (endIndex > originalFiltered.length) {
      break;
    }

    const chars = originalFiltered.slice(index, endIndex);

    const text = chars
      .map((c) => c.slugified === "" ? " " : c.slugified)
      .join("")
      .replace(/\s+/g, " ")
      .trim();

    if (text !== slugified) {
      ++index;
      continue;
    }

    const lastChar = chars[chars.length - 1];
    const match = original.substring(firstChar.originIndex, lastChar.originIndex + 1);
    const length = match.length;
    const start = firstChar.originIndex;
    const end = lastChar.originIndex + 1;

    result.push({ match, length, start, end });
    index = endIndex + 1;
  }

  return result;
}

const UnitlessProperties = new Set([
  "animation-iteration-count",
  "border-image-outset",
  "border-image-slice",
  "border-image-width",
  "box-flex",
  "box-flex-group",
  "box-ordinal-group",
  "column-count",
  "fill-opacity",
  "flex",
  "flex-grow",
  "flex-positive",
  "flex-shrink",
  "flex-negative",
  "font-weight",
  "line-clamp",
  "line-height",
  "opacity",
  "order",
  "orphans",
  "tab-size",
  "widows",
  "z-index",
  "zoom",
  "flood-opacity",
  "stop-opacity",
  "stroke-dasharray",
  "stroke-dashoffset",
  "stroke-miterlimit",
  "stroke-opacity",
  "stroke-width",
]);

function normalizeStyle(style: string | CSSProperties | undefined) {
  if (!style) {
    return "";
  }

  if (typeof style === "string") {
    return style;
  }

  return Object.keys(style).reduce((acc, key) => {
    const value = style[key as keyof CSSProperties];

    const normalizedKey = key.startsWith("--")
      ? key
      : key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);

    const normalizedValue = typeof value === "number" && !UnitlessProperties.has(normalizedKey)
      ? `${value}px`
      : value;

    return acc + `${normalizedKey}:${normalizedValue};`;
  }, "");
}

function normalizeAttrs(attrs: Record<string, string | number> | undefined, prefix = "") {
  if (!attrs) {
    return "";
  }

  return Object.keys(attrs).reduce((acc, key) => {
    const normalizedValue = attrs[key]?.toString().replace(/"/g, "&quot;") || "";
    const normalizedKey = prefix ? `${prefix}${key}` : key;
    return [...acc, `${normalizedKey}="${normalizedValue}"`];
  }, [] as string[]).join(" ");
}

export interface SelectHTMLHighlighterOptions {
  className?: string;
  tag?: string;
  style?: string | Record<string, string | number>;
  dataset?: Record<string, string | number>;
  attrs?: Record<string, string | number>;
  color?: string;
}

export function htmlHighlighter(original: string, search: string, options: SelectHTMLHighlighterOptions = {}) {
  const results = searchText(original, search);
  console.log("htmlHighlighter ::", original, " ::", search, "=>", results);

  if (!results.length) {
    return original;
  }

  const tag = options.tag || "span";
  const className = options.className || "";
  const dataset = normalizeAttrs(options.dataset, "data-");
  const attrs = normalizeAttrs(options.attrs);

  let style = normalizeStyle(options.style);

  if (options.color) {
    style += `color:${options.color};`;
  }

  const parts: string[] = [];
  let lastIndex = 0;

  results.forEach((result) => {
    const { match, start, end } = result;

    if (lastIndex < start) {
      parts.push(original.substring(lastIndex, start));
    }

    const beginTag = [tag];
    className && beginTag.push(`class="${className}"`);
    style && beginTag.push(`style="${style}"`);
    dataset && beginTag.push(dataset);
    attrs && beginTag.push(attrs);

    parts.push(`<${beginTag.join(" ")}>`);
    parts.push(match);
    parts.push(`</${tag}>`);

    lastIndex = end;
  });

  if (lastIndex < original.length) {
    parts.push(original.substring(lastIndex));
  }

  return parts.join("");
}
