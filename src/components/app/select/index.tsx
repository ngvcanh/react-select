import {
  ChangeEvent,
  ComponentType,
  forwardRef,
  ReactNode,
  SyntheticEvent,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState
} from "react";
import {
  SelectAsChild,
  SelectItem,
  SelectItemGroup,
  SelectItemOption,
  SelectOptionHandler,
  SelectPortalBackdrop,
  SelectPrimitive,
  SelectRenderMenuLabel,
  SelectRenderValueParams,
  SelectResponsiveType,
  SelectSize,
  SelectTriggerColumn
} from "./types";
import {
  createEvent,
  isEquals,
  normalizeOptions,
  normalizeValue,
  searchText,
  toggleValue
} from "./utils";
import { Breakpoint, Breakpoints, useMediaQuery } from "./useMediaQuery";
import { SelectDropdown } from "./SelectDropdown";
import { SelectModal } from "./SelectModal";
import { SelectSearch } from "./SelectSearch";
import { SelectMenu } from "./SelectMenu";
import { SelectAnchor } from "./SelectAnchor";
import { SelectValue } from "./SelectValue";
import { SelectSheet } from "./SelectSheet";
import { useSelectRefs } from "./useSelectRefs";
import { SelectControlled } from "./SelectControlled";

export interface SelectRef {
  anchor: HTMLDivElement | null;
  search: HTMLInputElement | null;
  opened: boolean;
  focus(): void;
  blur(): void;
  open(): void;
  close(): void;
  clear(): void;
  getValue(): SelectPrimitive | SelectPrimitive[] | null;
  setValue(value: SelectPrimitive | SelectPrimitive[]): void;
}

export interface SelectProps {
  name?: string;
  options: SelectItem[];
  value?: SelectPrimitive | SelectPrimitive[];
  placeholder?: string;
  className?: string;
  multiple?: boolean;
  maxSelect?: number;
  showCheckbox?: boolean;
  chip?: boolean;
  displayCount?: number;
  searchable?: boolean;
  searchPosition?: "anchor" | "dropdown";
  offset?: number;
  keepOnSelect?: boolean;
  truncate?: boolean;
  iconUncheck?: ReactNode;
  iconCheck?: ReactNode;
  iconDropdown?: ReactNode;
  iconRemove?: ReactNode;
  iconSearch?: ReactNode;
  removable?: boolean;
  separator?: boolean;
  maxHeight?: SelectPrimitive;
  breakpoint?: Breakpoint;
  breakpoints?: Partial<Breakpoints>;
  responsiveType?: SelectResponsiveType;
  backdrop?: SelectPortalBackdrop;
  modalWidth?: SelectPrimitive;
  asChild?: SelectAsChild;
  splitColumns?: boolean;
  triggerColumn?: SelectTriggerColumn;
  menuWidth?: SelectPrimitive;
  iconGroup?: ReactNode;
  debug?: boolean;
  components?: {
    anchorWrapper?: ComponentType;
    header?: ComponentType<{
      currentValue: SelectPrimitive[];
      search: string;
      responsive: boolean;
    }>;
    footer?: ComponentType<{
      currentValue: SelectPrimitive[];
      search: string;
      responsive: boolean;
    }>;
  };
  autoFit?: boolean;
  size?: SelectSize;
  groupCollapse?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  scrollToSelected?: boolean;
  clearable?: boolean;
  highlight?: boolean;
  highlightColor?: string;
  zIndex?: number;
  isGroup?(item: SelectItem): item is SelectItemGroup;
  renderChip?(option: SelectItem<SelectPrimitive> | number): JSX.Element;
  renderValue?(option: SelectItem<SelectPrimitive>, params: SelectRenderValueParams): ReactNode;
  renderMenuLabel?(params: SelectRenderMenuLabel): ReactNode;
  getOptionValue?(item: SelectItem): SelectPrimitive;
  getOptionLabel?(item: SelectItem): SelectPrimitive;
  getRelatedKey?(): string;
  getHighlighter?: SelectOptionHandler<string>;
  onChange?(e: SyntheticEvent): void;
  onFilter?: SelectOptionHandler<boolean>;
  onClear?(): void;
}

export const Select = forwardRef<SelectRef, SelectProps>(
  function Select(props, ref) {
    const {
      name,
      options,
      value,
      placeholder,
      className,
      chip,
      displayCount = 0,
      searchable,
      searchPosition = "anchor",
      showCheckbox,
      offset = 4,
      multiple,
      maxSelect = -1,
      keepOnSelect,
      truncate,
      iconCheck,
      iconUncheck,
      iconDropdown,
      iconRemove,
      iconSearch,
      removable,
      separator,
      maxHeight,
      breakpoint = "md",
      breakpoints,
      responsiveType,
      backdrop,
      modalWidth,
      asChild,
      splitColumns,
      menuWidth,
      iconGroup,
      components = {},
      autoFit,
      triggerColumn,
      size = "md",
      groupCollapse,
      disabled,
      readonly,
      scrollToSelected,
      highlight,
      highlightColor,
      zIndex,
      isGroup,
      getOptionValue,
      getOptionLabel,
      getRelatedKey,
      getHighlighter,
      renderChip,
      renderValue,
      renderMenuLabel,
      onChange,
      onClear,
      onFilter,
    } = props;

    const [isOpen, setIsOpen] = useState(false);
    const [shouldFilter, setShouldFilter] = useState(false);
    const [currentValue, setCurrentValue] = useState(normalizeValue(value));
    const [searchTerm, setSearchTerm] = useState("");

    const refs = useSelectRefs();
    const isSmallScreen = useMediaQuery(breakpoint, breakpoints);

    const currentOptions = useMemo(() => normalizeOptions({
      items: options,
      asChild,
      isGroup,
      getOptionValue,
      getOptionLabel,
      getRelatedKey,
    }), [options, asChild, isGroup, getOptionValue, getOptionLabel, getRelatedKey]);

    useEffect(() => {
      const nextValue = normalizeValue(value);
      isEquals(nextValue, currentValue) || setCurrentValue(nextValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const handleRemoveValue = useCallback((option: SelectItem) => {
      setCurrentValue((prev) => prev.filter((value) => value !== option.value));
    }, []);

    useEffect(() => {
      isOpen && searchable && refs.search.current?.focus();
    }, [isOpen, searchable, refs.search]);

    useEffect(() => {
      requestAnimationFrame(() => {
        isOpen ? refs.portal.current?.open() : refs.portal.current?.close();
      });
    });

    const handleClosePortal = useCallback(() => {
      setSearchTerm("");
      setShouldFilter(false);
      setIsOpen(false);
    }, []);

    useImperativeHandle(ref, () => ({
      anchor: refs.anchor.current,
      search: refs.search.current,
      opened: isOpen,
      focus: () => refs.anchor.current?.click(),
      blur: () => handleClosePortal(),
      open: () => setIsOpen(true),
      close: () => handleClosePortal(),
      clear: () => {
        setCurrentValue([]);
        setSearchTerm("");
        setShouldFilter(false);
        onChange?.(createEvent(name, [], multiple));
      },
      getValue: () => {
        return multiple ? currentValue : (currentValue[0] || null); 
      },
      setValue: (value) => {
        const nextValue = normalizeValue(value);
        setCurrentValue(nextValue);
        onChange?.(createEvent(name, nextValue, multiple));
      },
    }), [
      currentValue,
      name,
      onChange,
      handleClosePortal,
      isOpen,
      multiple,
      refs,
    ]);

    const filterItem = (option: SelectItem, search: string): boolean => {
      const searchResult = searchText(option.label?.toString() || "", search);
      const isValidLabel = onFilter?.(option, search) ?? !!searchResult.length;

      if (!option.group) {
        return isValidLabel;
      }

      const validChildren = (option as SelectItemGroup).children?.filter((child) => {
        return filterItem(child, search);
      });

      return isValidLabel || !!validChildren?.length;
    };

    const filteredOptions = currentOptions
      .filter((option) => {
        return !shouldFilter || !searchTerm.trim() || filterItem(option, searchTerm);
      })
      .map((option) => {
        if (option.group) {
          option.children = option.children?.filter((child) => {
            return !shouldFilter || !searchTerm.trim() || filterItem(child, searchTerm);
          });
        }

        return option;
      });

    const handleClickAnchor = () => {
      if (disabled || readonly) {
        return;
      }

      const shouldSetSearchTerm = !isOpen && searchable && !searchTerm && !multiple;
      setIsOpen(true);

      if (shouldSetSearchTerm && currentValue.length) {
        const option = options.find((opt) => opt.value === currentValue[0]);
        setShouldFilter(false);
        setSearchTerm(option?.label?.toString() || "");
      }
    };

    const handleSelectSingle = (option: SelectItem<SelectPrimitive>) => {
      if (option.group) {
        return;
      }

      setCurrentValue([option.value!]);
      onChange?.(createEvent(name, [option.value!], multiple));
      keepOnSelect || handleClosePortal();
    }

    const handleSelectMultiple = (option: SelectItem<SelectPrimitive>) => {
      const childrenOptions = (option.group
          ? (option as SelectItemGroup).children
          : [option]) as SelectItemOption<SelectPrimitive>[];
      const members = childrenOptions.map((item) => item.value!);


      setCurrentValue((prev) => toggleValue(members, prev, maxSelect));
      onChange?.(createEvent(name, toggleValue(members, currentValue, maxSelect), multiple));
      (keepOnSelect ?? true) || handleClosePortal();
    };

    const handleSelect = (option: SelectItem<SelectPrimitive>) => {
      multiple ? handleSelectMultiple(option) : handleSelectSingle(option);
    };

    const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      setShouldFilter(true);
    };

    const handleClearable = () => {
      setCurrentValue([]);
      onChange?.(createEvent(name, [], multiple));
      onClear?.();
    }

    const dropdownContent = (
      <>
        {components.header ? (
          <components.header {...{
            currentValue,
            search: searchTerm,
            responsive: isSmallScreen,
          }} />
        ): null}
        {searchable && searchPosition === "dropdown" && (
          <SelectSearch
            ref={refs.search}
            value={searchTerm}
            iconSearch={iconSearch}
            onChange={handleChangeSearch}
            position="dropdown"
          />
        )}
        <SelectMenu
          {...{
            refs: {
              listLeft: refs.listLeft,
              listRight: refs.listRight,
            },
            options: filteredOptions,
            value: currentValue,
            showCheckbox,
            iconCheck,
            iconUncheck,
            iconGroup,
            splitColumns,
            triggerColumn,
            onSelect: handleSelect,
            renderMenuLabel,
            setValue: setCurrentValue,
            scrollToSelected,
            highlight,
            getHighlighter,
            highlightColor,
            search: searchTerm,
          }}
        />
        {components.footer ? (
          <components.footer {...{
            currentValue,
            search: searchTerm,
            responsive: isSmallScreen,
          }} />
        ): null}
      </>
    );

    return (
      <>
        <SelectAnchor
          ref={refs.anchor}
          className={className}
          opened={isOpen}
          separator={separator}
          iconDropdown={iconDropdown}
          wrapper={components.anchorWrapper}
          size={size}
          disabled={disabled}
          onClick={handleClickAnchor}
          onClearable={handleClearable}
        >
          <SelectValue
            {...{
              options: currentOptions,
              value: currentValue,
              placeholder,
              chip,
              displayCount,
              multiple,
              truncate,
              iconRemove,
              searchable,
              searchPosition,
              search: searchTerm,
              opened: isOpen,
              removable,
              searchRef: refs.search,
              renderValue,
              renderChip,
              onRemove: handleRemoveValue,
              setSearchTerm,
              setShouldFilter,
              size,
              groupCollapse,
            }}
          />
          <SelectControlled
            name={name}
            value={currentValue}
            multiple={multiple}
          />
        </SelectAnchor>
        {responsiveType && isSmallScreen
          ? (
            responsiveType === "sheet"
              ? (
                <SelectSheet
                  ref={refs.portal}
                  maxHeight={maxHeight}
                  backdrop={backdrop}
                  onClose={handleClosePortal}
                  zIndex={zIndex}
                >
                  {dropdownContent}
                </SelectSheet>
              ) : (
                <SelectModal
                  ref={refs.portal}
                  width={modalWidth}
                  maxHeight={maxHeight}
                  backdrop={backdrop}
                  onClose={handleClosePortal}
                  zIndex={zIndex}
                >
                  {dropdownContent}
                </SelectModal>
              )
          ) : (
            <SelectDropdown
              ref={refs.portal}
              refs={{
                listLeft: refs.listLeft,
                listRight: refs.listRight,
                anchor: refs.anchor,
              }}
              offset={offset}
              maxHeight={maxHeight}
              splitColumns={splitColumns}
              menuWidth={menuWidth}
              autoFit={autoFit}
              onClose={handleClosePortal}
              zIndex={zIndex}
            >
              {dropdownContent}
            </SelectDropdown>
          )
        }
      </>
    );
  }
);
