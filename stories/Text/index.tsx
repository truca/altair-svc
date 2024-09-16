import {
  Text as ChakraText,
  TextProps as ChakraTextProps,
} from "@chakra-ui/react";
import { parseFormatting } from "./parseFormatting";
import { useMemo } from "react";

interface TextProps {
  children: string;
}

export function Text(props: TextProps & ChakraTextProps) {
  const { children, ...other } = props;
  const formattedText = useMemo(() => parseFormatting(children), [children]);
  return <ChakraText {...other}>{formattedText}</ChakraText>;
}
