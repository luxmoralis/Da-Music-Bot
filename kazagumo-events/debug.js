export default {
  name: "debug",
  execute(client, name, info) {
    console.debug(`Lavalink ${name}: Debug,`, info);
  },
};
