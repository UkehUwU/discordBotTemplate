// * Packages *
const { Events } = require('discord.js');
const pino = require('pino');
const logger = pino({ transport: { target: 'pino-pretty' } });

// * Event *
module.exports = {

	name: Events.ClientReady,
	once: true,
	// eslint-disable-next-line
	execute() {

		logger.info('Bot started!');

	},

};