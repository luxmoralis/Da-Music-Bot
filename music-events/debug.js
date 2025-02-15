import { logger } from "../logger.js";

export default {
  name: "debug",
  execute(client, name, info) {
    logger.debug(`Lavalink ${name}: Debug,`, info);
  },
};
