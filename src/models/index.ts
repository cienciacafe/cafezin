// export enum LinkType {
//   Website = 0,
//   YouTube,
//   Twitter,
//   Facebook,
//   Instagram,
//   Lattes
// }

// export declare interface SocialLink {
//   RelatedEntity: string; // identificador da 'entidade' (canal ou criador) relacionada ao link
//   URL: string;
//   Type: LinkType;
// }

// export enum ChannelType {
//   Podcast = 0,
//   Youtube
// }

// export declare interface Channel {
//   Identity: string; // identificador único e memorável ("arroba")
//   FeedLocation: string;
//   Type: ChannelType;
//   Title: string | undefined | null;
//   AvatarURL: string | undefined | null;
//   BannerURL: string | undefined | null;
//   Description: string | undefined | null;
//   About: string | undefined | null; // descrição mais longa. TODO: aceitar markdown
//   Keywords: Array<string> | undefined | null;
//   Links: Array<SocialLink> | undefined | null;
// }

// export declare interface Creator {
//   UID: string; // identificador interno unificado
//   Identity: string; // identificador único e memorável ("arroba")
//   Description: string;
//   About: string; // descrição mais longa. TODO: aceitar markdown
//   Links: Array<SocialLink>;
// }
