import { useState, useEffect } from "react";
import React from "react";
import { Tooltip } from "@chakra-ui/react";
import { FaIcon } from "./FaIcons";

// Type for formatted elements
interface FormattedElement {
  type: "b" | "i" | "del" | "code" | "tooltip" | "icon" | "text";
  content: string;
  tooltip?: string;
  iconClass?: string;
  index: number;
  length: number;
}

export function parseFormatting(text: string): React.ReactNode[] {
  let match: RegExpExecArray | null;
  const formattedElements: FormattedElement[] = [];

  // Patterns for bold, italic, strikethrough, and monospace
  const patterns = [
    { regex: /\*([^\*]+)\*/g, component: "b" }, // Bold
    { regex: /_([^_]+)_/g, component: "i" }, // Italic
    { regex: /~([^~]+)~/g, component: "del" }, // Strikethrough
    { regex: /`([^`]+)`/g, component: "code" }, // Monospace
  ];

  // Find and push formatting elements
  patterns.forEach(({ regex, component }) => {
    while ((match = regex.exec(text)) !== null) {
      const [fullMatch, content] = match;
      formattedElements.push({
        // @ts-ignore
        type: component,
        content,
        index: match.index,
        length: fullMatch.length,
      });
    }
  });

  // Pattern for tooltips: [visible text][tooltip content]
  const tooltipPattern = /\[(.*?)\]\[(.*?)\]/g;
  // @ts-ignore
  while ((match = tooltipPattern.exec(text)) !== null) {
    // @ts-ignore
    const [fullMatch, visibleText, tooltipContent] = match;
    formattedElements.push({
      type: "tooltip",
      content: visibleText,
      tooltip: tooltipContent,
      // @ts-ignore
      index: match.index,
      length: fullMatch.length,
    });
  }

  // Pattern for icons: {i|icon-class}
  const iconPattern = /\{i\|([^\}]+)\}/g;
  // @ts-ignore
  while ((match = iconPattern.exec(text)) !== null) {
    // @ts-ignore
    const [fullMatch, iconClass] = match;
    formattedElements.push({
      type: "icon",
      content: "",
      iconClass: iconClass,
      // @ts-ignore
      index: match.index,
      length: fullMatch.length,
    });
  }

  // Sort elements by their appearance in the text (index)
  formattedElements.sort((a, b) => a.index - b.index);

  // Split text and apply formatting with tooltips and icons where applicable
  let formattedOutput: React.ReactNode[] = [];
  let lastIndex = 0;
  formattedElements.forEach(
    ({ type, content, tooltip, iconClass, index, length }) => {
      if (index > lastIndex) {
        formattedOutput.push(text.slice(lastIndex, index));
      }

      if (type === "tooltip") {
        formattedOutput.push(
          <Tooltip key={index} label={tooltip} hasArrow>
            <span style={{ cursor: "pointer" }}>{content}</span>
          </Tooltip>
        );
      } else if (type === "icon") {
        formattedOutput.push(<FaIcon key={index} icon={iconClass as string} />);
      } else {
        formattedOutput.push(
          React.createElement(type, { key: index }, content)
        );
      }

      lastIndex = index + length;
    }
  );

  if (lastIndex < text.length) {
    formattedOutput.push(text.slice(lastIndex));
  }

  return formattedOutput;
}
