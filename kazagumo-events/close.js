export default {
  name: "close",
  execute(client, name, code, reason) {
    console.warn(
      `Lavalink ${name}: Closed, Code ${code}, Reason ${reason || "No reason"}`
    );
  },
};
