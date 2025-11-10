import React from "react";

const ArrowDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width={props.width || 12}
    height={props.height || 12}
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M9 4.50002C9 4.50002 6.79053 7.49999 5.99998 7.5C5.20942 7.50001 3 4.5 3 4.5"
      stroke="#111928"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.99998 7.5C6.79053 7.49999 9 4.50002 9 4.50002"
      stroke="#111928"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ArrowDownIcon;
