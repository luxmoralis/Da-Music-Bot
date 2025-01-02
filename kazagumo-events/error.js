export default {
  name: "error",
  execute(client, name, error) {
    console.error(`Lavalink ${name}: Error Caught,`, error);
  },
};
