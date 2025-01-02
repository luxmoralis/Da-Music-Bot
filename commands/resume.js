import { SlashCommandBuilder } from "@discordjs/builders";
import { EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Resume the currently paused song"),
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

    player.pause(false);

    const embed = new EmbedBuilder()
      .setTitle("Resumed")
      .setDescription(`Resumed the current track`)
      .setColor(0x019bd9)
      .setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      });

    return interaction.reply({ embeds: [embed] });
  },
};
