// 'use strict';

const Hapi = require('@hapi/hapi');
const Mongoose = require('mongoose');
const CONFIG = require('./config');

try {
	const init = () => {
		module.exports = server = Hapi.server({
			port: CONFIG.PORT,
			host: 'localhost'
		});

		// DB
		Mongoose.set('useFindAndModify', false);
		Mongoose.connect(CONFIG.MONGODB_URI, { useNewUrlParser: true });
		const db = Mongoose.connection;

		db.on('error', (err) => console.log(err));
		db.once('open', async () => {
			require('./routes/customers');
			require('./routes/users');
			await server.start();
			console.log('Server runnig on %s', server.info.uri);
		});
	};
	init();
} catch (error) {
	process.on('unhandledRejection', (err) => {
		console.log(err);
		process.exit(1);
	});
}
