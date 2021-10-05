import axios from "axios";
import ogs from "open-graph-scraper";

let week = 0;
let aniList = [];

const noneImage = "https://i.imgur.com/AfFp7pu.png";

export const getWeekAnissia = async () => {
  const result = [];
  const date = new Date();
  const nowWeek = date.getDate();
  if (nowWeek !== week) {
    const url = `https://anissia.net/api/anime/schedule/${nowWeek}`;
    const { data } = await axios.get(url);
    week = date.getDate();
    aniList = data;
  }
  aniList.forEach(async (aniData) => {
    const { time, status, subject, website, captionCount } = aniData;

    const nowHour = date.getHours();
    const nowMinute = date.getMinutes();
    const aniTime = time.split(":");
    const hour = Number(aniTime[0]);
    const minute = Number(aniTime[1]);

    if (nowHour === hour && nowMinute - 5 === minute - 5 && status === "ON") {
      let image = "";
      let desciption = "";
      try {
        const {
          result: {
            ogImage: { url },
            ogDescription,
          },
        } = await ogs({ url: website }).catch((err) => err);
        image = url;
        desciption = ogDescription;
      } catch (error) {
        image = noneImage;
        desciption = "None desciption";
      }
      result.push({ subject, website, image, captionCount, desciption });
    }
  });
  return result;
};
