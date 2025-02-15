import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips the currently playing track"),
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

    return interaction.editReply({ embeds: [embed] });
  },
};
