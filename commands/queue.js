import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Displays the current queue"),
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
    if (!player || !player.queue.size)
      return interaction.editReply("The queue is empty.");
    const queue = player.queue
      .map(
        (track, index) =>
          `${index + 1}. **${track.title}** by **${track.author}**`
      )
      .join("\n");
    const embed = new EmbedBuilder()
      .setTitle("Current Queue")
      .setDescription(queue)
      .setThumbnail(player.queue[0]?.thumbnail)
      .setColor("#019bd9")
      .setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      });

    return interaction.editReply({ embeds: [embed] });
  },
};
