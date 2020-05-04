
// Must be at top
import 'reflect-metadata';
require('dotenv').config()

import { createConnection } from 'typeorm';

import { typeOrmConfig } from './config';

import { google } from "googleapis";
import { Channel, ChannelType } from './models/Channel';

const fs = require("fs");
const _ = require("lodash");
const got = require("got");
const mkdirp = require("mkdirp");
const queryString = require("query-string");

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YT_API_KEY,
});

async function fetchChannelsInfo(): Promise<any> {
  const dc = fs.readFileSync(`${__dirname}/../data/channels.json`);
  const channelsList: Array<Channel> = JSON.parse(dc);
  const channelsMap: Map<String, Channel> = channelsList.filter((c) => c.type == ChannelType.Youtube).reduce((map, c) => {
    const channelID = c.feedLocation.split('/channel/').pop();
    if (!!channelID) map.set(channelID, c);
    return map;
  }, new Map<String, Channel>());
  const channelIDsChunks: Array<Array<string>> = _.chunk(Array.from(channelsMap.keys()), 50);

  const conn = await createConnection(typeOrmConfig);
  const { manager } = conn;
  console.log('PG connected.');

  console.log(channelsList);

  for (const channelIDs of channelIDsChunks) {
    const { data } = await youtube.channels.list({
      id: channelIDs.join(','),
      part: ["snippet", "contentDetails", "brandingSettings", "topicDetails"].join(',')
    });

    const dataItems = data.items || [];

    for (const channelInfo of dataItems) {
      const { title, description, thumbnails } = channelInfo.snippet
      const { image, channel: channelSettings } = channelInfo.brandingSettings
      const { relatedPlaylists } = channelInfo.contentDetails
      const bannerURL = `${(image?.bannerImageUrl || '').split('=w')[0]}=w1960-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj`
      const keywords = (channelSettings && channelSettings.keywords) || ''
      if (!channelInfo.id) {
        continue;
      }

      try {
        const c = manager.create(Channel, {
          alias: (channelsMap.get(channelInfo.id).alias || channelInfo.snippet?.customUrl || channelInfo.id),
          title: title,
          avatarUrl: thumbnails?.high?.url,
          bannerUrl: bannerURL,
          description: (description || '').split("\n")[0],
          about: description,
          type: ChannelType.Youtube,
          feedLocation: (relatedPlaylists?.uploads || channelInfo.id),
          links: [],
          keywords: (keywords.match(/("[^"]+"|\S+)/gi) || []).map((e: string) => e.replace(/"/g, '')),
        });

        const result = await manager.save(c);
        console.log(`Canal ${c.alias}:`, result.id);
      } catch (e) {
        console.error("deu ruim", e);
      }

      // channelsMap.set(channelInfo.id, {
      //   ...(channelsMap.get(channelInfo.id) || { Identity: (channelInfo.snippet?.customUrl || channelInfo.id) }),
      //   title: title,
      //   avatarUrl: thumbnails?.high?.url,
      //   bannerUrl: bannerURL,
      //   description: (description || '').split("\n")[0],
      //   about: description,
      //   type: ChannelType.Youtube,
      //   feedLocation: (relatedPlaylists?.uploads || channelInfo.id),
      //   links: [],
      //   keywords: (keywords.match(/("[^"]+"|\S+)/gi) || []).map((e: string) => e.replace(/"/g, '')),
      // });
    }
  }

  await conn.close();
  console.log('PG connection closed.');
}

async function fetchChannelsVideos(): Promise<any> {
//   const conn = await createConnection(typeOrmConfig);
//   const { manager } = conn;
//   console.log('PG connected.');

//   const youtubeChannels = await manager.find(Channel, { where: { type: ChannelType.Youtube } });
//   const chunks: Array<Array<Channel>> = _.chunk(Array.from(youtubeChannels), 50);
//   console.log(chunks);
//   // for (const channel of youtubeChannels) {
//   //   console.log(channel.feedLocation);
//   // }

//   for (const channelChunk of chunks) {
//     const { data } = await youtube.videos.list({
//       // id: channelChunk.map((c) => c.feedLocation).join(','),}
      
//     });
//     // const { data } = await youtube.channels.list({
//     //   id: channelChunk.map((c) => c.feedLocation).join(','),
//     //   part: ["snippet", "contentDetails", "brandingSettings", "topicDetails"].join(',')
//     // });

//     const dataItems = data.items || [];

//     for (const channelInfo of dataItems) {
//       const { title, description, thumbnails } = channelInfo.snippet
//       const { image, channel: channelSettings } = channelInfo.brandingSettings
//       const { relatedPlaylists } = channelInfo.contentDetails
//       const bannerURL = `${(image?.bannerImageUrl || '').split('=w')[0]}=w1960-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj`
//       const keywords = (channelSettings && channelSettings.keywords) || ''
//       if (!channelInfo.id) {
//         continue;
//       }

//       try {
//         const c = manager.create(Channel, {
//           alias: (channelsMap.get(channelInfo.id).alias || channelInfo.snippet?.customUrl || channelInfo.id),
//           title: title,
//           avatarUrl: thumbnails?.high?.url,
//           bannerUrl: bannerURL,
//           description: (description || '').split("\n")[0],
//           about: description,
//           type: ChannelType.Youtube,
//           feedLocation: (relatedPlaylists?.uploads || channelInfo.id),
//           links: [],
//           keywords: (keywords.match(/("[^"]+"|\S+)/gi) || []).map((e: string) => e.replace(/"/g, '')),
//         });

//         const result = await manager.save(c);
//         console.log(`Canal ${c.alias}:`, result.id);
//       } catch (e) {
//         console.error("deu ruim", e);
//       }

//       // channelsMap.set(channelInfo.id, {
//       //   ...(channelsMap.get(channelInfo.id) || { Identity: (channelInfo.snippet?.customUrl || channelInfo.id) }),
//       //   title: title,
//       //   avatarUrl: thumbnails?.high?.url,
//       //   bannerUrl: bannerURL,
//       //   description: (description || '').split("\n")[0],
//       //   about: description,
//       //   type: ChannelType.Youtube,
//       //   feedLocation: (relatedPlaylists?.uploads || channelInfo.id),
//       //   links: [],
//       //   keywords: (keywords.match(/("[^"]+"|\S+)/gi) || []).map((e: string) => e.replace(/"/g, '')),
//       // });
//     }
//   }

//   await conn.close();
//   console.log('PG connection closed.');
// }

// (async () => {
//   await fetchChannelsVideos();
//   // await fetchChannelsInfo();

// })();


// async function main() {
//   const path = "channels";
//   const searchParams = queryString.stringify(
//     {
//       key: "",
//       part: ["snippet", "contentDetails", "brandingSettings"],
//       id: ["UCqB90BBr6eNRaJl-kl30Xxw"]
//     },
//     { arrayFormat: "comma", responseType: "json" }
//   );
//   // console.log(searchParams);
//   const { body } = await got(`https://www.googleapis.com/youtube/v3/${path}`, {
//     searchParams
//   });

//   // console.log(a);

//   const channels = JSON.parse(body).items;
//   let channelList: Array<Channel> = new Array();
//   for (const channel of channels) {
//     console.log(JSON.stringify(channel))
//     const {title, description, thumbnails} = channel["snippet"]
//     const {image, channel: channelSettings} = channel["brandingSettings"]
//     const {relatedPlaylists} = channel["contentDetails"]
//     const bannerURL = `${image["bannerImageUrl"].split('=w')[0]}=w1960-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj`

//     channelList.push({
//       Identity: "",
//       Title: title,
//       AvatarURL: thumbnails["high"],
//       BannerURL: bannerURL,
//       Description: description.split("\n")[0],
//       About: description,
//       Type: ChannelType.Youtube,
//       FeedLocation: relatedPlaylists["uploads"],
//       Links: [],
//       Keywords: (channelSettings["keywords"]).match(/("[^"]+"|\S+)/gi).map((e: string) => e.replace(/"/g, '')),
//     })
//     console.log(channelList);
//   }
// }

// main();

// export default main
