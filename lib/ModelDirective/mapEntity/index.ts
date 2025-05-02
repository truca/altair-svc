import { mapCampaignGroup } from "./campaignGroup";

export const ENTITY_MAPPER: { [key: string]: Function } = {
  CampaignGroup: mapCampaignGroup,
};

export async function mapEntity(entity: any, type: string) {
  if (!ENTITY_MAPPER[type]) return entity;
  return await ENTITY_MAPPER[type](entity);
}
