export enum LinkType {
  Website = 0,
  YouTube,
  Twitter,
  Facebook,
  Instagram,
  Lattes
}

export declare interface SocialLink {
  RelatedEntity: string; // identificador da 'entidade' (canal ou criador) relacionada ao link
  URL: string;
  Type: LinkType;
}

export enum ChannelType {
  Podcast = 0,
  Youtube
}

export declare interface Channel {
  Identity: string; // identificador único e memorável ("arroba")
  FeedLocation: string;
  Type: ChannelType;
  Title: string | undefined;
  AvatarURL: string | undefined;
  BannerURL: string | undefined;
  Description: string | undefined;
  About: string | undefined; // descrição mais longa. TODO: aceitar markdown
  Keywords: Array<string> | undefined;
  Links: Array<SocialLink> | undefined;
}

export declare interface Creator {
  UID: string; // identificador interno unificado
  Identity: string; // identificador único e memorável ("arroba")
  Description: string;
  About: string; // descrição mais longa. TODO: aceitar markdown
  Links: Array<SocialLink>;
}
