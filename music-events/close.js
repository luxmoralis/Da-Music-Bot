import { logger } from "../logger.js";

export default {
  name: "close",
  execute(client, name, code, reason) {
    logger.warn(
      `Lavalink ${name}: Closed, Code ${code}, Reason ${reason || "No reason"}`
    );
  },
};
