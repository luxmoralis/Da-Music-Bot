import { logger } from "../logger.js";

export default {
  name: "ready",
  execute(client, name) {
    logger.info(`Lavalink ${name}: Ready!`);
  },
};
