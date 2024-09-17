import {
  Text as ChakraText,
  TextProps as ChakraTextProps,
} from "@chakra-ui/react";
import { parseFormatting } from "./parseFormatting";
import { useMemo } from "react";

interface TextProps {
  children: string;
  tooltipProps?: any;
}

export function Text(props: TextProps & ChakraTextProps) {
  const { children, tooltipProps, ...other } = props;
  const formattedText = useMemo(
    () => parseFormatting(children, tooltipProps),
    [children, tooltipProps]
  );
  return <ChakraText {...other}>{formattedText}</ChakraText>;
}
