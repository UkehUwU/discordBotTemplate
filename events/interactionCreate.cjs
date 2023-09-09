// * Packages *
const { Events } = require('discord.js');
const pino = require('pino');
const logger = pino({ transport: { target: 'pino-pretty' } });

// * Event *
module.exports = {

	name: Events.InteractionCreate,
	async execute(interaction) {

		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {

			logger.info(`No command matching with ${interaction.commandName} was found.`);
			return;

		}

		try {

			await command.execute(interaction);

			logger.info(`Command ${interaction.commandName} executed`);

		}
		catch (error) {

			logger.error(error);

			if (interaction.replied || interaction.deferred) {await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });}

			else {await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });}

		}

	},

};