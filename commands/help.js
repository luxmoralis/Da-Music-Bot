import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Provides information about available commands"),
  async execute(interaction) {
    const commandList = interaction.client.commands
      .map(
        ({ data: { name, description } }) => `**/${name}** - ${description}\n`
      )
      .join("\n");

    const embed = new EmbedBuilder()
      .setTitle("Help - Available Commands")
      .setDescription(
        `Here are the available commands you can use:\n\n${commandList}`
      )
      .setColor(0x019bd9);

    await interaction.reply({ embeds: [embed] });
  },
};
