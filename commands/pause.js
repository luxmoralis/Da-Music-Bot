import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pauses the currently playing track"),
  async execute(interaction) {
    const { channel } = interaction.member.voice;
    if (!channel) {
      return interaction.editReply(
        "You need to be in a voice channel to use this command!"
      );
    }
    const player = await interaction.client.kazagumoClient.players.get(
      interaction.guild.id
    );
    if (!player) return interaction.editReply("No music is being played!");
    player.pause(true);
    const embed = new EmbedBuilder()
      .setTitle("Paused")
      .setDescription(`Paused the current track`)
      .setColor(0x019bd9)
      .setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      });

    return interaction.editReply({ embeds: [embed] });
  },
};
