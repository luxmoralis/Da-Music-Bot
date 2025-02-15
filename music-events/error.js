import { logger } from "../logger.js";

export default {
  name: "error",
  execute(client, name, error) {
    logger.error(`Lavalink ${name}: Error Caught,`, error);
  },
};
