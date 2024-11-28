import { ChangeEvent, forwardRef, ReactNode } from "react";
import { Search } from "lucide-react";

export interface SelectSearchProps {
  position?: "anchor" | "dropdown";
  iconSearch?: ReactNode;
  value?: string;
  placeholder?: string;
  onChange?(e: ChangeEvent<HTMLInputElement>): void;
}

export const SelectSearch = forwardRef<HTMLInputElement, SelectSearchProps>(
  function SelectSearch(props, ref) {
    const { position = "anchor", iconSearch, value, placeholder, onChange } = props;

    if (position === "anchor") {
      return (
        <div className="flex items-center flex-1 h-full">
          <input
            ref={ref}
            type="text"
            className="w-full h-full bg-transparent focus:outline-none"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
          />
        </div>
      );
    }

    return (
      <div className="p-2 border-b">
        <div className="flex items-center px-2 border rounded">
          {iconSearch || <Search className="w-4 h-4 text-gray-400" />}
          <input
            ref={ref}
            type="text"
            className="w-full p-1 text-sm focus:outline-none"
            placeholder="Search..."
            value={value || ""}
            onChange={onChange}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>
    );
  }
);
