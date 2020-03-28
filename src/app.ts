import { ChannelType, Channel } from "./models";

const fs = require("fs");
const _ = require("lodash");
const got = require("got");
const mkdirp = require("mkdirp");
const queryString = require("query-string");

async function getChannelsInfo() {
  const dc = fs.readFileSync(`${__dirname}/../data/channels.json`);
  const channelsList: Array<Channel> = JSON.parse(dc);
  const channelIDs: Array<string> = _.chunk(channelsList.map((c) => c.FeedLocation.split('/channel/').pop()), 42);
  
  // for (const channel of cha)
}




getChannelsInfo();

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
