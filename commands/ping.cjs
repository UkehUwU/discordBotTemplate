// * Packages *
const { SlashCommandBuilder } = require('discord.js');

// * Command *
module.exports = {

	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Check the bot\'s ping.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('ws')
				.setDescription('Check the bot\'s websocket ping.'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('rest')
				.setDescription('Check the bot\'s REST API ping.')),

	async execute(interaction) {

		switch (interaction.options.getSubcommand()) {

		case 'ws': {

			interaction.reply({ content: `Websocket heartbeat: ${interaction.client.ws.ping}ms.`, ephemeral: true });
			break;

		}

		case 'rest': {

			const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true, ephemeral: true });
			interaction.editReply(`Roundtrip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
			break;

		}

		default: {

			interaction.reply('Invalid subcommand.');
			break;

		}

		}

	},

};