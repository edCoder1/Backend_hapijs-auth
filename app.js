// 'use strict';

const Hapi = require('./node_modules/@hapi/hapi/lib');
const Mongoose = require('mongoose');
const CONFIG = require('./config');

try {
	const init = () => {
		module.exports = server = Hapi.server({
			port: CONFIG.PORT,
			host: 'localhost',
			routes: {
				cors: true
			}
		});

		// const server = Hapi.server({
		//     port: 3000,
		//     host: 'localhost',
		//     routes: {
		//         cors: {
		//             origin: ['*'], // an array of origins or 'ignore'
		//             headers: ['Authorization'], // an array of strings - 'Access-Control-Allow-Headers' 
		//             exposedHeaders: ['Accept'], // an array of exposed headers - 'Access-Control-Expose-Headers',
		//             additionalExposedHeaders: ['Accept'], // an array of additional exposed headers
		//             maxAge: 60,
		//             credentials: true // boolean - 'Access-Control-Allow-Credentials'
		//         }
		//     }
		// });

		// DB
		Mongoose.set('useFindAndModify', false);
		Mongoose.connect(CONFIG.MONGODB_URI, { useNewUrlParser: true });
		const db = Mongoose.connection;

		db.on('error', (err) => console.log(err));
		db.once('open', async () => {
			require('./routes/customers');
			require('./routes/users');
			require('./routes/posts')

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
