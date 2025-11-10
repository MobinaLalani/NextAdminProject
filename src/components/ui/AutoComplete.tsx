import React, { ReactNode, useState, useEffect, useRef } from "react";
import ArrowDownIcon from "../../../public/icons/arrow-down";
import CloseRedIcon from "../../../public/icons/closeRedIcon";
// import CloseRedIcon from "../../../public/icons/closeRedIcon.svg";
import Image from "next/image";
// import ArrowDownIcon from "../../../public/icons/arrow-down.svg";

import Loading from "./Loading";


export interface IDropDown {
  value: any;
  label: string;
  isActive?: boolean;
}

export enum FieldTheme {
  Primary = "primary",
  Secondary = "secondary",
}

interface Props {
  value?: any;
  name?: string;
  placeholder?: string;
  label?: string;
  className?: string;
  innerClassName?: string;
  help?: string | ReactNode;
  icon?: ReactNode;
  onChange?: (value: any, option?: IDropDown) => void;
  options: IDropDown[] ;
  isMulty?: boolean;
  inputClassName?: string;
  readonly?: boolean;
  theme?: FieldTheme;
  isLoading?: boolean;
}

const AutoComplete: React.FC<Props> = ({
  innerClassName,
  onChange,
  value,
  placeholder,
  label = "",
  className = "",
  isMulty = false,
  inputClassName,
  help,
  icon,
  options,
  readonly = false,
  theme = FieldTheme.Primary,
  isLoading = false,
}) => {
  const [filteredOptions, setFilteredOptions] = useState<IDropDown[]>(options);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("");
  const [multySelect, setMultySelect] = useState<IDropDown[]>([]);
  const [dropdownPosition, setDropdownPosition] = useState<"bottom" | "top">(
    "bottom"
  );
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const activeOptions = options?.filter((o) => o.isActive !== false);
    setFilteredOptions(activeOptions);
  }, [options]);

  useEffect(() => {
    if (!isMulty) {
      const selectedOption = options?.find((opt) => opt.value === value);
      setSelectedLabel(selectedOption ? selectedOption.label : "");
    } else if (Array.isArray(value)) {
      const selectedOptions = value
        .map((val: any) => options?.find((opt) => opt.value === val))
        .filter((opt): opt is IDropDown => opt !== undefined);
      setMultySelect(selectedOptions);
    }
  }, [value, options, isMulty]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const calculateDropdownPosition = () => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const itemHeight = 40;
    const maxItems = 4;
    const padding = 8;
    const actualItems = Math.min(filteredOptions.length, maxItems);
    const dropdownHeight = actualItems * itemHeight + padding;
    const spaceBelow = viewportHeight - rect.bottom - 10;
    const spaceAbove = rect.top - 10;

    if (spaceBelow >= dropdownHeight) setDropdownPosition("bottom");
    else if (spaceAbove >= dropdownHeight) setDropdownPosition("top");
    else setDropdownPosition(spaceBelow >= spaceAbove ? "bottom" : "top");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSelectedLabel(val);
    const activeOptions = options?.filter((opt) => opt.isActive !== false);

    if (val) {
      setFilteredOptions(
        activeOptions.filter((opt) =>
          opt.label.toLowerCase().includes(val.toLowerCase())
        )
      );
    } else {
      setFilteredOptions(activeOptions);
    }

    calculateDropdownPosition();
    setShowOptions(true);
  };

  const handleOptionSelect = (option: IDropDown) => {
    if (isMulty) {
      if (!multySelect.some((item) => item.value === option.value)) {
        const updatedSelection = [...multySelect, option];
        setMultySelect(updatedSelection);
        onChange?.(
          updatedSelection.map((i) => i.value),
          option
        );
      }
      setSelectedLabel("");
    } else {
      setSelectedLabel(option.label);
      onChange?.(option.value, option);
    }
    setShowOptions(false);
  };

  const handleRemove = (label: string) => {
    const updatedSelection = multySelect.filter((i) => i.label !== label);
    setMultySelect(updatedSelection);
    onChange?.(updatedSelection.map((i) => i.value));
    setSelectedLabel("");
  };

  const toggleDropdown = () => {
    if (!readonly) {
      calculateDropdownPosition();
      setShowOptions(true);
    }
  };

  const handleBlur = () => {
    if (isMulty && selectedLabel.trim()) {
      const matchedOption = options.find(
        (opt) => opt.label.toLowerCase() === selectedLabel.trim().toLowerCase()
      );
      if (
        matchedOption &&
        !multySelect.some((i) => i.value === matchedOption.value)
      ) {
        handleOptionSelect(matchedOption);
        setSelectedLabel("");
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleBlur();
    }
  };

  return (
    <div className={`form-control w-full ${className}`} ref={wrapperRef}>
      {label && (
        <label className="label text-gray-900 font-semibold text-sm">
          {label}
        </label>
      )}
      <div className="relative">
        <div
          className={`flex items-center cursor-pointer ${innerClassName}`}
          onClick={toggleDropdown}
        >
          {icon && <div className="p-2 absolute right-4 top-2">{icon}</div>}
          <input
            type="text"
            placeholder={placeholder}
            value={selectedLabel}
            onChange={handleInputChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className={`input w-full text-base text-[#6B7280] font-medium 
            rounded-[12px] h-[48px] 
            focus:outline-none focus:border focus:border-gray-300
            ${readonly ? "hover:cursor-default border-none" : ""}
            ${theme === FieldTheme.Primary ? "bg-[#FFF]" : "bg-[#F3F4F6]"} 
            ${icon ? "pr-12" : ""}
            ${inputClassName}
            placeholder:text-gray-400 placeholder:pr-3 placeholder:py-2
          `}
          />

          {!readonly && (
            <button
              type="button"
              className="absolute left-4 focus:outline-none"
            >
              <ArrowDownIcon width={16} height={16} />
            </button>
          )}
        </div>

        {showOptions && (
          <ul
            className={`absolute z-10 w-full bg-white border-[1px] border-gray-200 rounded-[16px] shadow max-h-40 overflow-y-auto ${
              dropdownPosition === "top" ? "bottom-full mb-1" : "top-full mt-1"
            }`}
          >
            {isLoading ? (
              <div className="flex justify-center items-center py-2">
                <Loading />
              </div>
            ) : filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <li
                  key={opt.value}
                  className="px-4 py-2 font-semibold text-sm cursor-pointer hover:bg-gray-100"
                  onClick={() => handleOptionSelect(opt)}
                >
                  {opt.label}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 font-semibold text-sm text-gray-500">
                داده‌ای موجود نیست
              </li>
            )}
          </ul>
        )}

        {isMulty && (
          <div className="flex flex-wrap gap-[8px] mt-2">
            {multySelect.map((item) => (
              <div
                key={item.value}
                className="border-2 max-w-fit rounded-lg border-[#FF7959] bg-[#FF7F7E10] flex items-center text-[#FF7959] text-[12px] font-bold py-1 px-3 gap-1"
              >
                {item.label}
                {!readonly && (
                  <CloseRedIcon
                    className="cursor-pointer"
                    onClick={() => handleRemove(item.label)}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {help && <p className="text-gray-500 text-sm mt-1">{help}</p>}
    </div>
  );
};

export default AutoComplete;