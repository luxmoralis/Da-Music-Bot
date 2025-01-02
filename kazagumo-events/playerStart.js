import { EmbedBuilder } from "discord.js";

export default {
  name: "playerStart",
  execute(client, player, track) {
    const embed = new EmbedBuilder()
      .setTitle(`Now playing`)
      .setThumbnail(track.thumbnail)
      .setDescription(`Song: ${track.title} by ${track.author}`)
      .setColor("#019bd9")
      .setFooter({
        text: `Requested by ${track.requester.tag}`,
        iconURL: track.requester.displayAvatarURL(),
      });

    client.channels.cache
      .get(player.textId)
      ?.send({ embeds: [embed] })
      .then((x) => player.data.set("message", x));
  },
};
