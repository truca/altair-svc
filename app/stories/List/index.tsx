import { HStack, VStack, StackProps } from "@chakra-ui/react";

export interface ListProps<Item> extends StackProps {
  type: "horizontal" | "vertical";
  items: Item[];
  ItemComponent: React.FunctionComponent<Item & { key: string | number }>;
}

export function List<Item>(props: ListProps<Item>) {
  const { type, children, items, ItemComponent, ...extraProps } = props;
  if (type === "horizontal") {
    return (
      <HStack gap={2} {...extraProps}>
        {items.map((item: Item) => (
          <ItemComponent key={(item as any).id} {...item} />
        ))}
      </HStack>
    );
  }

  return (
    <VStack w="100%" gap={2} {...extraProps}>
      {items.map((item: Item) => (
        <ItemComponent key={(item as any).id} {...item} />
      ))}
    </VStack>
  );
}
