import {
  ChangeEvent,
  ComponentType,
  forwardRef,
  Fragment,
  MouseEvent as ReactMouseEvent,
  ReactNode,
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { ChevronDown, Search, Check } from 'lucide-react';
import { SelectOption, SelectPortalRef, SelectPrimitive, SelectRenderValueParams } from "./types";
import { createEvent, defaultRenderValue, isEquals, normalize, toggleValue } from "./utils";
import { renderSelected } from "./renderSelected";
import { Breakpoint, Breakpoints, useMediaQuery } from "./useMediaQuery";
import { SelectDropdown } from "./SelectDropdown";
import { SelectModal } from "./SelectModal";
import clsx from "clsx";

export interface SelectProps {
  name?: string;
  options: SelectOption[];
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
  renderChip?(option: SelectOption | number): JSX.Element;
  renderValue?(option: SelectOption, params: SelectRenderValueParams): ReactNode;
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
      wrapper: Wrapper = Fragment,
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
      renderChip,
      renderValue = defaultRenderValue,
      onChange,
    } = props;

    const [isOpen, setIsOpen] = useState(false);
    const [shouldFilter, setShouldFilter] = useState(false);
    const [currentValue, setCurrentValue] = useState(normalize(value));
    const [searchTerm, setSearchTerm] = useState("");

    const containerRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);
    const portalRef = useRef<SelectPortalRef>(null);

    const isSmallScreen = useMediaQuery(breakpoint, breakpoints);

    useEffect(() => {
      const nextValue = normalize(value);
      isEquals(nextValue, currentValue) || setCurrentValue(nextValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const handleRemoveValue = useCallback((option: SelectOption) => (e: ReactMouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setCurrentValue((prev) => prev.filter((value) => value !== option.value));
    }, []);

    useEffect(() => {
      isOpen && searchable && searchRef.current?.focus();
    }, [isOpen, searchable, searchRef]);

    const anchorValue = useMemo(() => 
      renderSelected({
        options,
        currentValue,
        placeholder,
        chip,
        displayCount,
        multiple,
        truncate,
        iconRemove,
        searchable,
        searchPosition,
        searchTerm,
        isOpen,
        removable,
        searchRef,
        setSearchTerm,
        setShouldFilter,
        renderValue,
        renderChip,
        onRemove: handleRemoveValue,
      }),
      [
        chip, currentValue, displayCount, iconRemove, multiple, options, placeholder, searchTerm, searchable,
        truncate, searchPosition, isOpen, removable, renderChip, renderValue, handleRemoveValue
      ]
    );

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

    const filteredOptions = options.filter((option) =>
      !shouldFilter || option.label.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleClickAnchor = () => {
      const shouldSetSearchTerm = !isOpen && searchable && !searchTerm && !multiple;
      setIsOpen(true);
      // selectDropdownRef.current?.open();

      if (shouldSetSearchTerm && currentValue.length) {
        const option = options.find((opt) => opt.value === currentValue[0]);
        setShouldFilter(false);
        setSearchTerm(option?.label?.toString() || "");
      }
    };

    const handleClickOption = (option: SelectOption) => () => {
      if (option.disabled) {
        return;
      }

      if (multiple) {
        setCurrentValue((prev) => toggleValue(option.value, prev, maxSelect));
        onChange?.(createEvent(name, toggleValue(option.value, currentValue, maxSelect)));
        keepOnSelect || setIsOpen(false);
      } else {
        setCurrentValue([option.value]);
        onChange?.(createEvent(name, option.value));
        handleClosePortal();
        // selectDropdownRef.current?.close();
      }
    };

    const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      setShouldFilter(true);
    };

    const dropdownContent = (
      <>
        {searchable && searchPosition === "dropdown" && (
          <div className="p-2 border-b">
            <div className="flex items-center px-2 border rounded">
              {iconSearch || <Search className="w-4 h-4 text-gray-400" />}
              <input
                ref={searchRef}
                type="text"
                className="w-full p-1 text-sm focus:outline-none"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleChangeSearch}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}
      
        <div className="max-h-60 overflow-auto">
          {filteredOptions.map((option) => (
            <div
              key={option.value}
              className={`
                flex items-center gap-2 p-2 cursor-pointer
                ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}
                ${currentValue.includes(option.value) ? 'bg-blue-50' : ''}
              `}
              onClick={handleClickOption(option)}
            >
              {showCheckbox && (
                <div className="flex items-center justify-center w-4 h-4 border rounded">
                  {currentValue.includes(option.value)
                    ? iconCheck || <Check className="w-3 h-3 text-blue-500" />
                    : iconUncheck
                  }
                </div>
              )}
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      </>
    );

    return (
      <>
        <div ref={containerRef} className={className}>
          <Wrapper>
            <div
              className={clsx(
                "flex items-center justify-between w-full p-2 border rounded cursor-pointer overflow-hidden text-sm",
                "hover:border-blue-500"
              )}
              onClick={handleClickAnchor}
            >
              <div className={clsx("flex-1 min-w-0", truncate ? "truncate" : "")}>
                {anchorValue}
              </div>
              {separator && <div className="w-px h-4 bg-gray-200" />}
              {iconDropdown || (
                <span className="flex h-full px-2 -mr-2">
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      isOpen ? 'transform rotate-180' : ''
                    }`}
                  />
                </span>
              )}
            </div>
          </Wrapper>
        </div>
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
