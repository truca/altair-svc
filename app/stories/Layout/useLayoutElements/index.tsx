import UserData from "@/app/components/UserData";
import DashboardLayout from "../../DashboardLayout";
import { Direction } from "../../Form/types";
import SmartForm from "../../SmartForm";
import { Text } from "../../Text";
import { Card, Flex, Grid } from "@chakra-ui/react";
import Image from "next/image";
import { ReactNode, useMemo } from "react";

export interface GridNode {
  type:
    | "grid"
    | "item"
    | "flex"
    | "text"
    | "img"
    | "smartform"
    | "card"
    | "dashboardLayout"
    | "formWithTitle"
    | "headerUser";
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
  if (!isArrayStructure && layout.type === "formWithTitle") {
    const {
      area,
      props: {
        title,
        formProps: { submitProps, ...other },
      },
    } = layout;
    return (
      <>
        <Text
          fontSize="20px"
          lineHeight="40px"
          fontWeight="600"
          color="#111827"
          width="100%"
          paddingBottom="10px"
          borderBottom="1px solid #E5E7EB"
          marginBottom="16px"
        >
          {title}
        </Text>
        <SmartForm
          direction={Direction.COLUMN}
          submitText="Next"
          submitProps={{
            colorScheme: "pink",
            alignSelf: "flex-end",
            background: "#7D40FF",
            color: "white",
            marginTop: "20px",
            ...submitProps,
          }}
          {...other}
        />
      </>
    );
  }
  if (!isArrayStructure && layout.type === "headerUser") {
    const { props } = layout;
    return <UserData {...props} />;
  }
  if (!isArrayStructure && layout.type === "card") {
    const { area, props, items } = layout;
    return (
      <Card key={area} {...props}>
        {getLayoutElements(items || [], nodes)}
      </Card>
    );
  }
  if (!isArrayStructure && layout.type === "dashboardLayout") {
    const { area, props, items } = layout;
    return (
      <DashboardLayout key={area} {...props}>
        {getLayoutElements(items || [], nodes)}
      </DashboardLayout>
    );
  }

  if (!isArrayStructure && layout.type === "item") {
    const { area } = layout;
    const item =
      Array.isArray(nodes) && nodes.find((node) => node.props.area === area);
    return item;
  }

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
