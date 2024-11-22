import * as Icons from "react-icons/fa6";

interface FaIconProps {
  icon: string;
  style?: any;
}

export function FaIcon({ icon, style, ...other }: FaIconProps) {
  // @ts-ignore
  const Icon = Icons[icon];
  return <Icon style={{ verticalAlign: "text-top", ...style }} {...other} />;
}
