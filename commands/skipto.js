import { SlashCommandBuilder } from "@discordjs/builders";
import { EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("skipto")
    .setDescription("Skip a number of tracks in the queue")
    .addIntegerOption((option) =>
      option
        .setName("number")
        .setDescription("Number of tracks to skip")
        .setRequired(true)
    ),
  async execute(interaction) {
    const number = interaction.options.getInteger("number");
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

    if (number < 1 || number > player.queue.length) {
      return interaction.reply("Invalid number of tracks to skip!");
    }

    player.queue.splice(0, number - 1);
    player.skip();

    const embed = new EmbedBuilder()
      .setTitle(`Skipped ${number} tracks`)
      .setDescription(`Now playing: ${player.queue[0]?.title}`)
      .setColor(0x019bd9)
      .setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      });

    return interaction.reply({ embeds: [embed] });
  },
};
