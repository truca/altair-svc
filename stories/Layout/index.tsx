import { ReactNode } from "react";
import { useLayoutElements, GridNode } from "./useLayoutElements";

export interface LayoutProps {
  layout: GridNode;
  children: ReactNode;
}

export function Layout(props: LayoutProps) {
  const { children, layout } = props;

  return useLayoutElements(layout, children);
}
