import React from "react";
import { Box, Text, Heading, VStack, StackDivider } from "@chakra-ui/react";

interface Props {
  isCard?: boolean;
  item: Record<string, any>;
}

export function ItemRenderer({ isCard, item }: Props) {
  const renderValue = (value: any) => {
    if (typeof value === "object" && !Array.isArray(value)) {
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
    } else {
      return <Text fontSize="md">{String(value)}</Text>;
    }
  };

  const styles = isCard
    ? { borderWidth: "1px", borderRadius: "lg", boxShadow: "md" }
    : { borderWidth: "0", borderRadius: "0", boxShadow: "none" };

  return (
    <Box maxW="md" overflow="hidden" p="6" {...styles}>
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
      </VStack>
    </Box>
  );
}

export default ItemRenderer;
