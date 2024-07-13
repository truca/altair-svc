import SmartForm from "@/stories/SmartForm";
import { Flex, Grid, Text } from "@chakra-ui/react";
import Image from "next/image";
import { ReactNode, useMemo } from "react";

export interface GridNode {
  type: "grid" | "item" | "flex" | "text" | "img" | "smartform";
  area?: string;
  items?: GridNode[];
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
  if (!isArrayStructure && layout.type === "flex") {
    const { area, props, items } = layout;
    return (
      <Flex area={area} {...props}>
        {getLayoutElements(items || [], nodes)}
      </Flex>
    );
  }
  if (!isArrayStructure && layout.type === "text") {
    const { area, props } = layout;
    return <Text area={area} {...props} />;
  }
  if (!isArrayStructure && layout.type === "img") {
    const { area, props } = layout;
    return <Image key={props.src} area={area} alt={props.alt} {...props} />;
  }
  if (!isArrayStructure && layout.type === "smartform") {
    const { area, props } = layout;
    return <SmartForm key={area} {...props} />;
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
