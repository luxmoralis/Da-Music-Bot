import { logger } from "../logger.js";

export default {
  name: "disconnect",
  execute(client, name, count, kazagumo) {
    const players = [...kazagumo.shoukaku.players.values()].filter(
      (p) => p.node.name === name
    );
    players.map((player) => {
      kazagumo.destroyPlayer(player.guildId);
      player.destroy();
    });
    logger.warn(`Lavalink ${name}: Disconnected`);
  },
};
