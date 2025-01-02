export default {
  name: "disconnect",
  execute(client, name, count) {
    const players = [...kazagumo.shoukaku.players.values()].filter(
      (p) => p.node.name === name
    );
    players.map((player) => {
      kazagumo.destroyPlayer(player.guildId);
      player.destroy();
    });
    console.warn(`Lavalink ${name}: Disconnected`);
  },
};
