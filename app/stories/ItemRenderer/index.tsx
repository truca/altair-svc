import React from "react";
import { Box, Text, Heading, VStack, StackDivider } from "@chakra-ui/react";
import { SectionsHash } from "@/app/components";

interface Props {
  containerSx?: any;
  isCard?: boolean;
  item: Record<string, any>;
  ChildComponent: React.FC<Props>;
  itemProps?: Record<string, any>;
  itemMap?: (item: Record<string, any>) => Record<string, any>;
}

export function ItemRenderer(props: Props) {
  const {
    isCard,
    item: itemParam,
    itemProps,
    itemMap,
    containerSx,
    ...others
  } = props;
  const item = itemMap
    ? { ...itemMap(itemParam), ...itemProps }
    : { ...itemParam, ...itemProps };

  const renderValue = (value: any) => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return <ItemRenderer item={value} isCard />;
    } else if (Array.isArray(value)) {
      return (
        <VStack align="start" spacing={2}>
          {value.map((val, index) => (
            <Box key={index} w="100%">
              {renderValue(val)}
            </Box>
          ))}
        </VStack>
      );
    } else if (typeof value === "boolean") {
      return <Text fontSize="md">{value ? "True" : "False"}</Text>;
    } else if (typeof value === "string" && value.includes("http")) {
      return <img src={value} alt="img" />;
    } else {
      return <Text fontSize="md">{String(value)}</Text>;
    }
  };

  const styles = isCard
    ? {
        borderWidth: "1px",
        borderRadius: "lg",
        boxShadow: "md",
        ...containerSx,
      }
    : {
        borderWidth: "0",
        borderRadius: "0",
        boxShadow: "none",
        ...containerSx,
      };

  if (!item || typeof item !== "object") return null;

  const ChildComponent =
    typeof props.ChildComponent === "string"
      ? SectionsHash[props.ChildComponent]
      : props.ChildComponent || null;
  return (
    <Box maxW="md" overflow="hidden" p="6" {...styles} {...others}>
      <VStack
        align="start"
        spacing={0}
        divider={<StackDivider borderColor="gray.200" />}
      >
        {Object.entries(item).map(([key, value]) => (
          <Box key={key} w="100%">
            <Heading as="h3" size="sm" mb={2} color="teal.500">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </Heading>
            {renderValue(value)}
          </Box>
        ))}
        {ChildComponent && <ChildComponent {...props} />}
      </VStack>
    </Box>
  );
}

export default ItemRenderer;
