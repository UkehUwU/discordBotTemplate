// * Packages *
import { Client, GatewayIntentBits, Collection } from 'discord.js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import pino from 'pino';
const logger = pino({ transport: { target: 'pino-pretty' } });

// Use __dirname and __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// * Environment variables *
dotenv.config();

const discordToken = process.env.DISCORD_TOKEN;

// * Create client instance *
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// * Dynamically import events *
// The event files have to be CJS (CommonJS)
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.cjs'));

for (const file of eventFiles) {

	const filePath = path.join(eventsPath, file);
	const event = require(filePath);

	if (event.once) {

		client.once(event.name, (...args) => event.execute(...args));

	}
	else {

		client.on(event.name, (...args) => event.execute(...args));

	}

}

// * Dynamically import commands *
// The command files have to be CJS (CommonJS)
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.cjs'));

for (const file of commandFiles) {

	const filePath = path.join(commandsPath, file);
	const command = require(filePath);

	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {

		client.commands.set(command.data.name, command);

	}
	else {

		logger.error(`The command at ${filePath} is missing a required "data" or "execute" property.`);

	}

}

// * Login and presence *
client.login(discordToken).then(() => {

	client.user.setPresence({ status: 'online', activities: [{ name: 'UwU' }] });

	logger.info(`Logged in as ${client.user.tag}!`);

});