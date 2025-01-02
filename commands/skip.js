import { SlashCommandBuilder } from "@discordjs/builders";
import { EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skip the currently playing song"),
  async execute(interaction) {
    const { channel } = interaction.member.voice;

    if (!channel) {
      return interaction.reply(
        "You need to be in a voice channel to use this command!"
      );
    }

    const player = interaction.client.kazagumo.players.get(
      interaction.guild.id
    );

    if (!player) {
      return interaction.reply("No player found!");
    }

    player.skip();

    const embed = new EmbedBuilder()
      .setTitle(`Skipped to ${player.queue[0]?.title}`)
      .setThumbnail(player.queue[0]?.thumbnail)
      .setDescription(`By ${player.queue[0]?.author}`)
      .setColor("#019bd9")
      .setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      });

    return interaction.reply({ embeds: [embed] });
  },
};
