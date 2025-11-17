import React, { ReactNode } from "react";


interface Props {
  name: string;
  placeholder?: string;
  label?: string;
  className?: string;
  innerClassName?: string;
  help?: string | ReactNode;
  iconClassName?: string;
  value?: string | number;
  icon?: ReactNode;
  type?: string;
  readonly?: boolean;

  onChange?: (value: string) => void; // برای کنترل مقدار از بیرون
}

const TextField: React.FC<Props> = ({
  placeholder,
  label = "",
  className = "",
  innerClassName = "",
  iconClassName = "",
  help,
  icon,
  name,
  type = "text",
  readonly = false,
  value = "",
  onChange,
}) => {
const handleClear = () => {
  if (onChange) {
    onChange(""); // فقط مقدار
  }
};

  const hasValue = value !== "" && value !== null && value !== undefined;

  return (
    <div className={`form-control w-full ${className} rounded-[13px]`}>
      {label && (
        <label className="label text-gray-900 font-semibold text-sm">
          {label}
        </label>
      )}

      <div
        className={`flex items-center relative rounded-[13px] ${innerClassName}`}
      >
        {icon && (
          <div className={`p-2 absolute right-4 ${iconClassName}`}>{icon}</div>
        )}

        <input
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className={`
    input
    w-full
    p-2
    text-base
    text-[#6B7280]
    font-medium
    rounded-[12px]
    focus:outline-none
    focus:border-gray-400
    ${readonly ? "hover:cursor-default border-none" : ""}
    bg-[#F3F4F6]
    ${icon ? "pr-16" : ""}
    ${innerClassName}
  `}
          disabled={readonly}
        />

        {hasValue && !readonly && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute left-4 top-2 text-gray-600 hover:text-gray-800"
          >
            &times;
          </button>
        )}
      </div>

      {help && <p className="text-gray-500 text-sm mt-1">{help}</p>}
    </div>
  );
};

export default TextField;
