import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("skipto")
    .setDescription("Skips to a specific track in the queue")
    .addIntegerOption((option) =>
      option
        .setName("index")
        .setDescription("The position of the track in the queue")
        .setRequired(true)
    ),
  async execute(interaction) {
    const number = interaction.options.getInteger("index");
    const { channel } = interaction.member.voice;

    if (!channel) {
      return interaction.editReply(
        "You need to be in a voice channel to use this command!"
      );
    }

    const player = await interaction.client.kazagumoClient.players.get(
      interaction.guild.id
    );
    if (!player) {
      return interaction.editReply("No player found!");
    }

    if (number < 1 || number > player.queue.length) {
      return interaction.editReply("Invalid number of tracks to skip!");
    }

    player.queue.splice(0, number - 1);
    player.skip();

    const embed = new EmbedBuilder()
      .setTitle(`Skipped to track ${number}`)
      .setDescription(`Now playing: ${player.queue[0]?.title}`)
      .setColor(0x019bd9)
      .setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      });

    return interaction.editReply({ embeds: [embed] });
  },
};
