interface Props {
  size?: "sm" | "md" | "lg" | "xl";
}

const Loading: React.FC<Props> = ({ size = "lg" }) => {
  return (
    <div className={"flex items-center w-full h-full skeleton justify-center"}>
      <span className={`loading loading-infinity loading-${size}`}></span>
    </div>
  );
};

export default Loading;
