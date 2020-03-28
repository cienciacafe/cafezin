import { google } from "googleapis";
import { ChannelType, Channel } from "./models";

const fs = require("fs");
const _ = require("lodash");
const got = require("got");
const mkdirp = require("mkdirp");
const queryString = require("query-string");

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YT_API_KEY,
})

async function getChannelsInfo(): Promise<Map<String, Channel>> {
  const dc = fs.readFileSync(`${__dirname}/../data/channels.json`);
  const channelsList: Array<Channel> = JSON.parse(dc);
  const channelsMap: Map<String, Channel> = channelsList.filter((c) => c.Type == ChannelType.Youtube).reduce((map, c) => {
    const channelID = c.FeedLocation.split('/channel/').pop();
    if (!!channelID) map.set(channelID, c);
    return map;
  }, new Map<String, Channel>());
  const channelIDsChunks: Array<Array<string>> = _.chunk(Array.from(channelsMap.keys()), 50);

  for (const channelIDs of channelIDsChunks) {
    const { data } = await youtube.channels.list({
      id: channelIDs.join(','),
      part: ["snippet", "contentDetails", "brandingSettings"].join(',')
    });

    const dataItems = data.items || [];

    for (const channelInfo of dataItems) {
      const { title, description, thumbnails } = channelInfo.snippet
      const { image, channel: channelSettings } = channelInfo.brandingSettings
      const { relatedPlaylists } = channelInfo.contentDetails
      const bannerURL = `${(image?.bannerImageUrl || '').split('=w')[0]}=w1960-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj`
      const keywords = (channelSettings && channelSettings.keywords) || ''
      if (!channelInfo.id || !channelsMap.has(channelInfo.id)) {
        continue;
      }

      channelsMap.set(channelInfo.id, {
        ...(channelsMap.get(channelInfo.id) || { Identity: (channelInfo.snippet?.customUrl || channelInfo.id) }),
        Title: title,
        AvatarURL: thumbnails?.high?.url,
        BannerURL: bannerURL,
        Description: (description || '').split("\n")[0],
        About: description,
        Type: ChannelType.Youtube,
        FeedLocation: (relatedPlaylists?.uploads || channelInfo.id),
        Links: [],
        Keywords: (keywords.match(/("[^"]+"|\S+)/gi) || []).map((e: string) => e.replace(/"/g, '')),
      });
    }
  }

  return channelsMap;
}



getChannelsInfo().
  then(console.log);

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
