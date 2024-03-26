"use client";
import { Link as ChakraLink, LinkProps } from "@chakra-ui/next-js";

export default function Link(props: LinkProps) {
  return (
    <ChakraLink
      {...props}
      href="/about"
      color="blue.400"
      _hover={{ color: "blue.800" }}
    />
  );
}
