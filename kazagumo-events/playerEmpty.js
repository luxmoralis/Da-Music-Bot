import { EmbedBuilder } from "discord.js";

export default {
  name: "playerEmpty",
  execute(client, player) {
    const embed = new EmbedBuilder()
      .setTitle(`Destroyed player`)
      .setDescription(`Destroyed player due to inactivity.`)
      .setColor("#019bd9");

    client.channels.cache
      .get(player.textId)
      ?.send({ embeds: [embed] })
      .then((x) => player.data.set("message", x));
    player.destroy();
  },
};
