import dotenv from "dotenv";
import { fileURLToPath, pathToFileURL } from "url";
import path, { dirname } from "path";
import fs from "fs";
import { logger } from "./logger.js";
import {
  Client,
  Collection,
  GatewayIntentBits,
  REST,
  Routes,
} from "discord.js";
import { Kazagumo } from "kazagumo";
import { Connectors } from "shoukaku";
import { log } from "console";

// Load environment variables
dotenv.config();

// Constants for file paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const discordREST = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.commands = new Collection();

// Kazagumo Initialization
const kazagumoClient = new Kazagumo(
  {
    defaultSearchEngine: "youtube",
    // MAKE SURE YOU HAVE THIS
    send: (guildId, payload) => {
      const guild = client.guilds.cache.get(guildId);
      if (guild) guild.shard.send(payload);
    },
  },
  new Connectors.DiscordJS(client),
  [
    {
      name: "Lavalink Server",
      url: `${process.env.LAVALINK_HOST}:2333`,
      auth: process.env.LAVALINK_PASSWORD,
      secure: false,
    },
  ]
);

client.kazagumoClient = kazagumoClient;

// Load Kazagumo events
const loadKazagumoEvents = async () => {
  const eventsPath = path.join(__dirname, "music-events");
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of eventFiles) {
    const filePath = pathToFileURL(path.join(eventsPath, file)).href;
    const eventModule = await import(filePath);
    const event = eventModule.default || eventModule;
    if (event.once) {
      kazagumoClient.on(event.name, (...args) =>
        event.execute(client, ...args)
      );
    } else {
      kazagumoClient.on(event.name, (...args) =>
        event.execute(client, ...args)
      );
    }
  }
};

// Load commands
const loadCommands = async () => {
  const commandsPath = path.join(__dirname, "commands");
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = pathToFileURL(path.join(commandsPath, file)).href;
    const commandModule = await import(filePath);
    const command = commandModule.default || commandModule;
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
      logger.info(`Loaded command ${command.data.name}`);
    } else {
      logger.error(`Command ${file} is missing data or execute method.`);
    }
  }
};

// Load events
const loadEvents = async () => {
  const eventsPath = path.join(__dirname, "events");
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of eventFiles) {
    const filePath = pathToFileURL(path.join(eventsPath, file)).href;
    const eventModule = await import(filePath);
    const event = eventModule.default || eventModule;
    if (event.once) {
      client.once(event.name, (...args) => event.execute(client, ...args));
    } else {
      client.on(event.name, (...args) => event.execute(client, ...args));
    }
  }
};

// Refresh commands
const refreshCommands = async () => {
  try {
    logger.info("Started refreshing application (/) commands.");
    await discordREST.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: client.commands.map((command) => command.data.toJSON()),
    });
    logger.info("Successfully reloaded application (/) commands.");
  } catch (error) {
    logger.error(error);
  }
};

// Initialize the Bot
const init = async () => {
  logger.info("Starting bot...");
  logger.info("Loading commands...");
  await loadCommands();
  logger.info("Commands loaded.");
  logger.info("Loading events...");
  await loadEvents();
  logger.info("Events loaded.");
  await refreshCommands();
  await loadKazagumoEvents();
  client.login(process.env.BOT_TOKEN);
};

init();
