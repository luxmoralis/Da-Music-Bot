import {
  REST,
  Routes,
  Client,
  GatewayIntentBits,
  Collection,
} from "discord.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname } from "path";
import { Shoukaku, Connectors } from "shoukaku";
import { Kazagumo } from "kazagumo";

// Load environment variables
dotenv.config();

// Constants for file paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize REST and Client
const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
  ],
});
client.commands = new Collection();

// Initialize Shoukaku & Kazagumo
const lavalinkNodes = [
  {
    name: "local",
    url: `${process.env.LAVALINK_HOST}:2333`,
    auth: process.env.LAVALINK_PASSWORD,
    secure: false,
  },
];

const kazagumo = new Kazagumo(
  {
    defaultSearchEngine: "youtube",
    send: (guildId, payload) => {
      const guild = client.guilds.cache.get(guildId);
      if (guild) guild.shard.send(payload);
    },
  },
  new Connectors.DiscordJS(client),
  lavalinkNodes
);

client.kazagumo = kazagumo;

const loadKazagumoEvents = async () => {
  const eventsPath = path.join(__dirname, "kazagumo-events");
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of eventFiles) {
    const filePath = pathToFileURL(path.join(eventsPath, file)).href;
    const eventModule = await import(filePath);
    const event = eventModule.default || eventModule;
    if (event.once) {
      kazagumo.on(event.name, (...args) => event.execute(client, ...args));
    } else {
      kazagumo.on(event.name, (...args) => event.execute(client, ...args));
    }
  }
};

// Function to load commands
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
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
};

// Function to load events
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

// Function to refresh application commands
const refreshCommands = async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: client.commands.map((command) => command.data.toJSON()),
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
};

// Initialize bot
const init = async () => {
  await loadCommands();
  await loadEvents();
  await refreshCommands();
  await loadKazagumoEvents();
  client.login(process.env.BOT_TOKEN);
};

init();
