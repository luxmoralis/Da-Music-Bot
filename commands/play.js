import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays a track from a given URL or search query")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("The URL or search query of the track")
        .setRequired(true)
    ),
  async execute(interaction) {
    const query = interaction.options.getString("query");
    const { channel } = interaction.member.voice;
    if (!channel) {
      return interaction.editReply(
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
    const player = await interaction.client.kazagumoClient.createPlayer({
      guildId: interaction.guild.id,
      voiceId: interaction.member.voice.channel.id,
      textId: interaction.channel.id,
      volume: 75,
      deaf: true,
    });
    const result = await interaction.client.kazagumoClient.search(query, {
      requester: interaction.user,
    });
    if (!result.tracks.length) {
      return interaction.editReply("No tracks found.");
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
    return interaction.editReply({ embeds: [embed] });
  },
};
