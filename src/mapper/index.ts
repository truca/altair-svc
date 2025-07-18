import { mapCampaignGroup } from "./campaignGroup";

export const entityMapperHash: { [key: string]: (entity: any) => any } = {
  CampaignGroup: mapCampaignGroup,
};
