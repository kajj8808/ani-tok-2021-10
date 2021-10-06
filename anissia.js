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

  const getDetail = async (website) => {
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

    return { image, desciption };
  };

  for (const aniData of aniList) {
    const { time, status, subject, website, captionCount } = aniData;

    let nowHour = date.getHours() - 1; //hour 이 0~23 이라.
    let nowMinute = date.getMinutes();
    const aniTime = time.split(":");
    const hour = Number(aniTime[0]);
    const minute = Number(aniTime[1]);

    if (nowMinute >= 60) {
      nowHour = nowHour + 1 >= 24 ? 0 : nowHour + 1;
      nowMinute = (nowMinute += 5) - 60;
    }

    if (nowHour === hour && nowMinute + 5 === minute && status === "ON") {
      const { image, desciption } = await getDetail(website);
      console.log(image, desciption);
      result.push({ subject, website, image, captionCount, desciption });
      return result;
    }
  }
};
