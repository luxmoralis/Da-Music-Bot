import { SlashCommandBuilder } from "@discordjs/builders";
import { EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a song from YouTube")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("The song name or URL")
        .setRequired(true)
    ),
  async execute(interaction) {
    const query = interaction.options.getString("query");
    const { channel } = interaction.member.voice;

    if (!channel) {
      return interaction.reply(
        "You need to be in a voice channel to use this command!"
      );
    }

    if (
      !channel
        .permissionsFor(interaction.guild.members.me)
        .has("Connect", false)
    ) {
      return interaction.reply(
        "I don't have permission to join your voice channel!"
      );
    }

    let player = await interaction.client.kazagumo.createPlayer({
      guildId: interaction.guild.id,
      textId: interaction.channel.id,
      voiceId: channel.id,
      volume: 100,
      deaf: true,
    });

    let result = await interaction.client.kazagumo.search(query, {
      requester: interaction.user,
    });

    if (!result.tracks.length) {
      return interaction.reply("No results found!");
    }

    if (result.type === "PLAYLIST") {
      player.queue.add(result.tracks);
    } else {
      player.queue.add(result.tracks[0]);
    }

    if (!player.playing && !player.paused) {
      player.play();
    }

    const embed = new EmbedBuilder()
      .setTitle(
        result.type === "PLAYLIST"
          ? `Queued ${result.tracks.length} from ${result.playlistName}`
          : `Queued ${result.tracks[0].title}`
      )
      .setThumbnail(result.tracks[0].thumbnail)
      .setDescription(
        result.type === "PLAYLIST"
          ? `Playlist: ${result.playlistName}`
          : `Song: ${result.tracks[0].title}`
      )
      .setColor("#019bd9")
      .setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      });

    return interaction.reply({ embeds: [embed] });
  },
};
