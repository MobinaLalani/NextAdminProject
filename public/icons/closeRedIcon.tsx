const CloseRedIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width={props.width || 10}
    height={props.height || 10}
    viewBox="0 0 10 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g id="elements">
      <path
        id="Vector"
        d="M8.5 1.5L1.5 8.5M1.5 1.5L8.5 8.5"
        stroke="#FF7959"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

export default CloseRedIcon;
