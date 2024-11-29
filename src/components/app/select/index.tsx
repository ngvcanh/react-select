import {
  ChangeEvent,
  ComponentType,
  forwardRef,
  ReactNode,
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { SelectItem, SelectItemGroup, SelectPortalRef, SelectPrimitive, SelectRenderValueParams } from "./types";
import { createEvent, defaultRenderValue, isEquals, normalizeOptions, normalizeValue, toggleValue } from "./utils";
import { Breakpoint, Breakpoints, useMediaQuery } from "./useMediaQuery";
import { SelectDropdown } from "./SelectDropdown";
import { SelectModal } from "./SelectModal";
import { SelectSearch } from "./SelectSearch";
import { SelectMenu } from "./SelectMenu";
import { SelectAnchor } from "./SelectAnchor";
import { SelectValue } from "./SelectValue";

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
  wrapper?: ComponentType;
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
  asModal?: boolean;
  backdrop?: "static" | "closeable";
  modalWidth?: SelectPrimitive;
  asChild?: boolean;
  splitColumns?: boolean;
  triggerColumn?: "hover" | "selected";
  menuWidth?: SelectPrimitive;
  iconGroup?: ReactNode;
  debug?: boolean;
  isGroup?(item: SelectItem): item is SelectItemGroup;
  getOptionValue?(item: SelectItem): SelectPrimitive;
  getOptionLabel?(item: SelectItem): SelectPrimitive;
  renderChip?(option: SelectItem<SelectPrimitive> | number): JSX.Element;
  renderValue?(option: SelectItem<SelectPrimitive>, params: SelectRenderValueParams): ReactNode;
  onChange?(e: SyntheticEvent): void;
}

export const Select = forwardRef<HTMLInputElement, SelectProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function Select(props, ref) {
    const {
      name,
      options,
      value,
      placeholder,
      className,
      chip,
      wrapper,
      displayCount = 0,
      searchable,
      searchPosition = "anchor",
      showCheckbox,
      offset = 4,
      multiple,
      maxSelect = -1,
      keepOnSelect = true,
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
      asModal,
      backdrop,
      modalWidth,
      asChild,
      splitColumns,
      menuWidth,
      iconGroup,
      debug,
      isGroup,
      getOptionValue,
      getOptionLabel,
      renderChip,
      renderValue = defaultRenderValue,
      onChange,
    } = props;

    const [isOpen, setIsOpen] = useState(false);
    const [shouldFilter, setShouldFilter] = useState(false);
    const [currentValue, setCurrentValue] = useState(normalizeValue(value));
    const [searchTerm, setSearchTerm] = useState("");

    const containerRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);
    const portalRef = useRef<SelectPortalRef>(null);

    const isSmallScreen = useMediaQuery(breakpoint, breakpoints);

    const currentOptions = useMemo(() => normalizeOptions({
      items: options,
      asChild,
      isGroup,
      getOptionValue,
      getOptionLabel,
    }), [options, asChild, isGroup, getOptionValue, getOptionLabel]);

    useEffect(() => {
      const nextValue = normalizeValue(value);
      isEquals(nextValue, currentValue) || setCurrentValue(nextValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const handleRemoveValue = useCallback((option: SelectItem) => {
      setCurrentValue((prev) => prev.filter((value) => value !== option.value));
    }, []);

    useEffect(() => {
      isOpen && searchable && searchRef.current?.focus();
    }, [isOpen, searchable, searchRef]);

    useEffect(() => {
      requestAnimationFrame(() => {
        isOpen ? portalRef.current?.open() : portalRef.current?.close();
      });
    });

    const handleClosePortal = useCallback(() => {
      setSearchTerm("");
      setShouldFilter(false);
      setIsOpen(false);
    }, []);

    const filteredOptions = currentOptions.filter((option) =>
      !shouldFilter || option.label?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleClickAnchor = () => {
      const shouldSetSearchTerm = !isOpen && searchable && !searchTerm && !multiple;
      setIsOpen(true);

      if (shouldSetSearchTerm && currentValue.length) {
        const option = options.find((opt) => opt.value === currentValue[0]);
        setShouldFilter(false);
        setSearchTerm(option?.label?.toString() || "");
      }
    };

    const handleSelect = (option: SelectItem<SelectPrimitive>) => {
      if (multiple) {
        setCurrentValue((prev) => toggleValue(option.value!, prev, maxSelect));
        onChange?.(createEvent(name, toggleValue(option.value!, currentValue, maxSelect)));
        keepOnSelect || setIsOpen(false);
      } else {
        setCurrentValue([option.value!]);
        onChange?.(createEvent(name, option.value!));
        handleClosePortal();
      }
    };

    const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      setShouldFilter(true);
    };
    if(debug) {
      console.log("search", props);
    }
    const dropdownContent = (
      <>
        {searchable && searchPosition === "dropdown" && (
          <SelectSearch
            ref={searchRef}
            value={searchTerm}
            iconSearch={iconSearch}
            onChange={handleChangeSearch}
            position="dropdown"
          />
        )}
        <SelectMenu
          options={filteredOptions}
          value={currentValue}
          showCheckbox={showCheckbox}
          iconCheck={iconCheck}
          iconUncheck={iconUncheck}
          iconGroup={iconGroup}
          splitColumns={splitColumns}
          onSelect={handleSelect}
        />
      </>
    );

    return (
      <>
        <SelectAnchor
          ref={containerRef}
          className={className}
          opened={isOpen}
          separator={separator}
          iconDropdown={iconDropdown}
          wrapper={wrapper}
          onClick={handleClickAnchor}
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
              searchRef,
              renderValue,
              renderChip,
              onRemove: handleRemoveValue,
              setSearchTerm,
              setShouldFilter,
            }}
          />
        </SelectAnchor>
        {asModal && isSmallScreen
          ? (
            <SelectModal
              ref={portalRef}
              width={modalWidth}
              maxHeight={maxHeight}
              backdrop={backdrop}
              onClose={handleClosePortal}
            >
              {dropdownContent}
            </SelectModal>
          ) : (
            <SelectDropdown
              ref={portalRef}
              anchorRef={containerRef}
              offset={offset}
              maxHeight={maxHeight}
              splitColumns={splitColumns}
              menuWidth={menuWidth}
              onClose={handleClosePortal}
            >
              {dropdownContent}
            </SelectDropdown>
          )
        }
      </>
    );
  }
);
