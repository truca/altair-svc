"use client";
import { useRef } from "react";
import { ChakraProvider, theme as chakraTheme } from "@chakra-ui/react";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const themeRef = useRef<{}>();
  if (!themeRef.current) {
    // Create the theme instance the first time this renders
    themeRef.current = chakraTheme;
  }

  return <ChakraProvider theme={themeRef.current}>{children}</ChakraProvider>;
}
