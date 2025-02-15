import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stops the currently playing track and clears the queue"),
  async execute(interaction) {
    const player = await interaction.client.kazagumoClient.players.get(
      interaction.guild.id
    );
    if (!player) return interaction.editReply("No music is being played!");
    player.queue.clear();
    player.destroy();
    const embed = new EmbedBuilder()
      .setTitle("Stopped")
      .setDescription(`Stopped the current track and cleared the queue`)
      .setColor(0x019bd9)
      .setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      });
    return interaction.editReply({ embeds: [embed] });
  },
};
