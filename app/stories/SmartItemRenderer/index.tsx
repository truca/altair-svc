import pluralize from "pluralize";
import { useEffect, useState } from "react";
import { gerQueryForType } from "../SmartForm/getQueriesForType";
import { DocumentNode } from "graphql";
import { useQuery } from "@apollo/client";
import ItemRenderer from "../ItemRenderer";

interface SmartItemRendererProps {
  id: string;
  viewQuery: DocumentNode;
  itemProps?: Record<string, any>;
  itemMap?: (item: Record<string, any>) => Record<string, any>;
  omitFields?: string[];
}

export function SmartItemRenderer(props: SmartItemRendererProps) {
  const { id, viewQuery, omitFields = [], itemMap, itemProps } = props;

  const { loading, error, data } = useQuery<any, { id?: string }>(viewQuery, {
    variables: { id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {JSON.stringify(error)}</p>;

  const baseItem = data.item;
  const item = Object.keys(baseItem).reduce((acc: any, key: any) => {
    if (!omitFields.includes(key)) acc[key] = baseItem[key];
    return acc;
  }, {});
  return <ItemRenderer item={item} itemMap={itemMap} itemProps={itemProps} />;
}

interface SmartItemRendererWrapperProps
  extends Omit<SmartItemRendererProps, "viewQuery"> {
  type: string;
}

export function SmartItemRendererWrapper(props: SmartItemRendererWrapperProps) {
  const { id, type: entityType, omitFields = [], itemMap, itemProps } = props;
  const [viewQuery, setViewQuery] = useState<DocumentNode | null>(null);

  useEffect(() => {
    (async () => {
      const lowercaseEntityType = entityType.toLowerCase();
      const singularType = pluralize.isSingular(lowercaseEntityType)
        ? lowercaseEntityType
        : pluralize.singular(lowercaseEntityType);
      const { query: tempQuery } = await gerQueryForType(
        singularType,
        omitFields
      );
      setViewQuery(tempQuery);
    })();
  }, [id, entityType, omitFields]);

  if (!viewQuery) return <p>Query Loading...</p>;

  return (
    <SmartItemRenderer
      id={id}
      viewQuery={viewQuery}
      omitFields={omitFields}
      itemMap={itemMap}
      itemProps={itemProps}
    />
  );
}

export default SmartItemRendererWrapper;
