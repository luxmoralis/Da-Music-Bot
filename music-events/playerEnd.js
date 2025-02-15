import { EmbedBuilder } from "discord.js";

export default {
  name: "playerEnd",
  execute(client, player, track) {
    player.data.get("message")?.edit({ content: `Finished playing` });
    const embed = new EmbedBuilder()
      .setTitle(`Finished playing`)
      .setDescription(
        `The player has finished playing the track: ${track.title} by ${track.author}.`
      )
      .setThumbnail(track.thumbnail)
      .setColor("#019bd9");

    player.data.get("message")?.edit({ embeds: [embed] });
  },
};
