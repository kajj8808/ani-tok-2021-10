import { MessageEmbed, WebhookClient } from "discord.js";
import { ID, TOKEN } from "./config.json";
import { getWeekAnissia } from "./anissia";

const client = new WebhookClient({ id: ID, token: TOKEN });

const embed = ({ subject, website, image, captionCount, desciption }) =>
  new MessageEmbed()
    .setColor("#f2f2f2")
    .setTitle(subject)
    .setURL(website)
    .setImage(image)
    .setDescription(`${subject}-${captionCount}화\n${desciption}`)
    .setTimestamp()
    .setFooter(
      "namuneulbo#1144",
      "https://discord.com/assets/3c6ccb83716d1e4fb91d3082f6b21d77.png"
    );

const main = async () => {
  const results = await getWeekAnissia();
  if (results[0] !== undefined) {
    results.forEach((item) => {
      client.send({
        username: "ani bot",
        embeds: [embed(item)],
      });
    });
  }
};

setInterval(main, 60000);
