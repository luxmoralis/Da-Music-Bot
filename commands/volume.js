import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Sets the volume of the player")
    .addIntegerOption((option) =>
      option
        .setName("level")
        .setDescription("The volume level (0-100)")
        .setRequired(true)
    ),
  async execute(interaction) {
    const level = interaction.options.getInteger("level");
    if (level < 0 || level > 100)
      return interaction.editReply("Volume level must be between 0 and 100.");
    const player = await interaction.client.kazagumoClient.players.get(
      interaction.guild.id
    );
    if (!player) return interaction.editReply("No music is being played!");
    player.setVolume(level);
    const embed = new EmbedBuilder()
      .setTitle("Volume Control")
      .setDescription(`Volume set to ${level}%`)
      .setColor("#019bd9")
      .setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      });

    return interaction.reply({ embeds: [embed] });
  },
};
