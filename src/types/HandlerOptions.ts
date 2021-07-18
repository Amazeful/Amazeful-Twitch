export enum HandlerTypes {
  MESSAGE = "Handler::Message",
  SUB = "Handler::Sub",
  GIFT = "Handler::Gift",
  RAID = "Handler::Raid",
  HOST = "Handler::Host",
  COMMUNITY_GIFT = "Handler::CommunityGift",
}

export interface HandlerOptions {
    type: HandlerTypes,
    handler: 
}
