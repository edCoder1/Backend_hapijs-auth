// Catch all errors properly
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../../auth');
const User = require('../../models/User');
const CONFIG = require('../../config');

module.exports = {
	getUsers: {
		description: 'Get al Users',
		handler: async (request, h) => {
			const users = await User.find();
			return users;
		}
	},
	getUserById: {
		description: 'Getone user by Id',
		handler: async (request, h) => {
			const user = User.findById(request.params.id);
			return user;
		}
	},
	addUser: {
		description: 'Add one User',
		handler: async (request, h) => {
			if (request.headers['content-type'] !== 'application/json') {
				return 'Expected "application/json"';
			}

			const { email, password } = request.payload;
			const user = new User({
				email,
				password
			});

			bcrypt.genSalt(10, (error, salt) => {
				bcrypt.hash(user.password, salt, async (error, hash) => {
					const newUser = await user.save();
					return 'User successfully added';
				});
			});
		}
	},
	updateUser: {
		description: 'Update one user',
		// config: {
		pre: [
			{
				method: auth.verifyToken,
				assign: 'verifyToken'
			}
		],
		// },
		handler: async (request, h) => {
			if (request.headers['content-type'] !== 'application/json') {
				return 'Expected "application/json"';
			}

			if (request.pre.verifyToken === 'Did not get token') {
				return 'Did not get token';
			} else {
				var verified = await jwt.verify(request.token, CONFIG.JWT_SECRET, async (error, authData) => {
					if (error) {
						console.log('ERROR: ' + error);
						return 'Not authenticated';
					} else {
						try {
							const user = await User.findOneAndUpdate({ _id: request.params.id }, request.payload);
							if (user) {
								return `Successfully updated user with id ${request.params.id}`; //  ${JSON.stringify(
								// authData
								// )} `;
							} else {
								return 'Not authenticated';
							}
						} catch (error) {
							console.log('error', error);
							return 'Id not found';
						}
					}
				});
				if (verified === `Successfully updated user with id ${request.params.id}`) {
					return verified; // WRONG?
				} else {
					return 'Not authenticated';
				}
			}
		}
	},
	deleteUser: {
		description: 'Delete user',
		handler: async (request, h) => {
			try {
				const user = await User.findByIdAndRemove({ _id: request.params.id });
				return 'User successfully deleted';
			} catch (error) {
				return 'Id not found';
			}
		}
	},
	registerUser: {
		description: 'Register one user',
		handler: async (request, h) => {
			if (request.headers['content-type'] !== 'application/json') {
				return 'Expected "application/json"';
			}

			const { email, password } = request.payload;
			const user = new User({
				email,
				password
			});

			try {
				bcrypt.genSalt(10, async (err, salt) => {
					if (err) {
						throw err;
					}
					bcrypt.hash(user.password, salt, async (err, hash) => {
						if (err) {
							throw err;
						}
						user.password = hash;
						const newUser = await user.save();
						// return `Successfully regitered user`;
					});
				});
				return `Successfully regitered user`;
			} catch (error) {
				console.log('error', error);
				return 'An error ocurred!';
			}
		}
	},
	auth: {
		description: 'Authorization route',
		handler: async (request, h) => {
			if (request.headers['content-type'] !== 'application/json') {
				return 'Expected "application/json"';
			}

			const { email, password } = request.payload;

			try {
				// Authenticate user
				const user = await auth.authenticate(email, password);

				const email_1 = user[0].email;
				const password_1 = user[0].password;

				const userObj = {
					email_1,
					password_1
				};
				// const userObj = {
				// user[0].email,
				// user[0].pasaword

				// }?

				// Create JWT
				const token = jwt.sign(userObj, CONFIG.JWT_SECRET, {
					expiresIn: '15m'
				});
				// Get iat anbd epx
				const { iat, exp } = jwt.decode(token);
				// Respond with token
				return 'Authorized: ' + JSON.stringify({ iat, exp, token });
			} catch (error) {
				console.log(error);
				return 'Unauthorized: ' + error;
			}
		}
	}
};
