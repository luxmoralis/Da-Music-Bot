import { SlashCommandBuilder } from "@discordjs/builders";
import { EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Set the volume of the player")
    .addIntegerOption((option) =>
      option
        .setName("level")
        .setDescription("Volume level (0-100)")
        .setRequired(true)
    ),
  async execute(interaction) {
    const volume = interaction.options.getInteger("level");
    const { channel } = interaction.member.voice;

    if (!channel) {
      return interaction.reply(
        "You need to be in a voice channel to use this command!"
      );
    }

    if (volume < 0 || volume > 100) {
      return interaction.reply("Volume level must be between 0 and 100!");
    }

    const player = interaction.client.kazagumo.players.get(
      interaction.guild.id
    );

    if (!player) {
      return interaction.reply("No player found!");
    }

    player.setVolume(volume);

    const embed = new EmbedBuilder()
      .setTitle("Volume Control")
      .setDescription(`Volume set to ${volume}%`)
      .setColor("#019bd9")
      .setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      });

    return interaction.reply({ embeds: [embed] });
  },
};
