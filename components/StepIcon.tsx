import Image from "next/image";

interface Props {
  name: string;
  size?: number;
  className?: string;
}

export default function StepIcon({ name, size = 22, className = "" }: Props) {
  return (
    <Image
      src={`/icons/${name}.png`}
      alt=""
      width={size}
      height={size}
      style={{ height: size, width: size }}
      className={`object-contain ${className}`}
    />
  );
}
