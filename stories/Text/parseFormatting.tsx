import React from "react";
import { Tooltip } from "@chakra-ui/react";
import { FaIcon } from "./FaIcons"; // Adjust the import based on your FontAwesome package

// Define the types of formatting that the function will support
type FormattingType = "b" | "i" | "del" | "code" | "tooltip" | "icon";

// Utility function to parse and apply multiple formatting types
export const parseFormatting = (input: string): React.ReactNode[] => {
  // Define patterns for each type of formatting
  const formatPatterns: {
    regex: RegExp;
    type: FormattingType;
  }[] = [
    { regex: /\*([^\*]+)\*/g, type: "b" }, // Bold
    { regex: /_([^_]+)_/g, type: "i" }, // Italic
    { regex: /~([^~]+)~/g, type: "del" }, // Strikethrough
    { regex: /`([^`]+)`/g, type: "code" }, // Monospace
    { regex: /\[(.*?)\]\[(.*?)\]/g, type: "tooltip" }, // Tooltip
    { regex: /\{i\|([^\}]+)\}/g, type: "icon" }, // Icon
  ];

  // Process the text for a single pattern and return the result
  const processPattern = (
    text: string,
    pattern: { regex: RegExp; type: FormattingType }
  ): React.ReactNode[] => {
    const { regex, type } = pattern;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      const [fullMatch, content, tooltipContent] = match;

      // Add the part before the match
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      // Handle each formatting type
      if (type === "tooltip") {
        parts.push(
          <Tooltip
            key={match.index}
            label={parseFormatting(tooltipContent)}
            hasArrow
          >
            <span>{parseFormatting(content)}</span>
          </Tooltip>
        );
      } else if (type === "icon") {
        parts.push(<FaIcon key={match.index} icon={content} />);
      } else {
        const ElementType = {
          b: "b",
          i: "i",
          del: "del",
          code: "code",
        }[type] as keyof JSX.IntrinsicElements;

        parts.push(
          React.createElement(
            ElementType,
            { key: match.index },
            parseFormatting(content)
          )
        );
      }

      // Update last index
      lastIndex = match.index + fullMatch.length;
    }

    // Add any remaining text after the last match
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts;
  };

  // Apply each formatting pattern in sequence
  let formattedParts: React.ReactNode[] = [input];
  formatPatterns.forEach((pattern) => {
    formattedParts = formattedParts.flatMap((part) => {
      if (typeof part === "string") {
        return processPattern(part, pattern);
      }
      return part;
    });
  });

  return formattedParts;
};
