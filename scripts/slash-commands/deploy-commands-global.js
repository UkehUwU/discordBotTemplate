// * Packages *
import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import path from 'path';
import pino from 'pino';
const logger = pino({ transport: { target: 'pino-pretty' } });

// Use __dirname
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use 'require'
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// * Important variables *
const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;

// * Grab commands data *
const commands = [];

const commandsPath = path.join(__dirname, '../../commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.cjs'));

for (const file of commandFiles) {

	const command = require(`${commandsPath}/${file}`);
	commands.push(command.data.toJSON());

}

// * Deploy commands *
// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(token);

// Deploy
(async () => {

	try {

		logger.info(`Started refreshing ${commands.length} application slash commands globally.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(

			Routes.applicationCommands(clientId),
			{ body: commands },

		);

		logger.info(`Successfully reloaded ${data.length} application slash commands.`);

	}
	catch (error) {

		// And of course, make sure you catch and log any errors!
		logger.error(error);

	}

})();