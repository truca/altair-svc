import pluralize from "pluralize";
import { useEffect, useState } from "react";
import { gerQueryForType } from "../SmartForm/getQueriesForType";
import { DocumentNode } from "graphql";
import { useQuery } from "@apollo/client";
import ItemRenderer from "../ItemRenderer";

interface SmartItemRendererProps {
  id: string;
  viewQuery: DocumentNode;
}

export function SmartItemRenderer(props: SmartItemRendererProps) {
  const { id, viewQuery } = props;

  const { loading, error, data } = useQuery<any, { id?: string }>(viewQuery, {
    variables: { id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {JSON.stringify(error)}</p>;

  return <ItemRenderer item={data.item} />;
}

interface SmartItemRendererWrapperProps {
  id: string;
  entityType: string;
}

export function SmartItemRendererWrapper(props: SmartItemRendererWrapperProps) {
  const { id, entityType } = props;
  const [viewQuery, setViewQuery] = useState<DocumentNode | null>(null);

  useEffect(() => {
    (async () => {
      const lowercaseEntityType = entityType.toLowerCase();
      const singularType = pluralize.isSingular(lowercaseEntityType)
        ? lowercaseEntityType
        : pluralize.singular(lowercaseEntityType);
      const { query: tempQuery } = await gerQueryForType(singularType);
      setViewQuery(tempQuery);
    })();
  }, [id, entityType]);

  if (!viewQuery) return <p>Query Loading...</p>;

  return <SmartItemRenderer id={id} viewQuery={viewQuery} />;
}

export default SmartItemRendererWrapper;
