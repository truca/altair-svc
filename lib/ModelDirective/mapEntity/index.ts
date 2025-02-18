import { mapCampaignGroup } from "./campaignGroup";

export const ENTITY_MAPPER: { [key: string]: Function } = {
  CampaignGroup: mapCampaignGroup,
};

export function mapEntity(entity: any, type: string) {
  if (!ENTITY_MAPPER[type]) return entity;
  return ENTITY_MAPPER[type](entity);
}
