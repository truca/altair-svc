import { Grid } from "@chakra-ui/react";
import { ReactNode, useMemo } from "react";

export interface GridNode {
  type: "grid" | "item";
  area?: string;
  items?: GridNode[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props?: any;
}

export const getLayoutElements = (
  layout: GridNode | GridNode[],
  nodes: ReactNode
): JSX.Element => {
  const isArrayStructure = Array.isArray(layout);
  if (!isArrayStructure && layout.type === "grid") {
    const { area, props, items } = layout;
    return (
      <Grid area={area} {...props}>
        {getLayoutElements(items || [], nodes)}
      </Grid>
    );
  }
  if (!isArrayStructure && layout.type === "item") {
    const { area } = layout;
    const item =
      Array.isArray(nodes) && nodes.find((node) => node.props.area === area);
    return item;
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return (layout as GridNode[]).map((node: GridNode) =>
    getLayoutElements(node, nodes)
  );
};

export function useLayoutElements(Layout: GridNode, nodes: ReactNode) {
  const elements = useMemo(
    () => getLayoutElements(Layout, nodes),
    [Layout, nodes]
  );

  return elements;
}
