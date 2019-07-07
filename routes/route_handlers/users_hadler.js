// Catch all errors properly
const bcrypt = require('../../node_modules/bcryptjs');
const jwt = require('../../node_modules/jsonwebtoken');
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
			if (!request.payload.email || !request.payload.password) {
				return 'Email and password expected' // Return 400
			}

			const { email, password } = request.payload;
			const user = new User({
				email,
				password
			});
			return new Promise((resolve, reject) => {  // Make an util;
				try {
					bcrypt.genSalt(10, (error, salt) => {
						bcrypt.hash(user.password, salt, async (error, hash) => {
							user.password = hash;
							try {
								const newUser = await user.save();
								resolve('User successfully added');
							} catch (error) {
								reject('Failed while saving user info')
							}
						});
					})
				} catch (error) {
					reject('Failed while encrypting password')
				}
			});
		}
	},
	updateUser: {
		description: 'Update one user',
		// config: {
		pre: [
			{
				method: auth.getTokenFromHeadersAndVerify,
				assign: 'verifyToken'
			}
		],
		// },
		handler: async (request, h) => {
			// return new Promise(async (resolve, reject) => {


			if (request.headers['content-type'] !== 'application/json') {
				return 'Expected "application/json"';
				// reject('Expected "application/json"');
			}

			if (request.pre.verifyToken !== 'verified Token') {
				// return 'token does not match';.
				// ?REDIRECT TO login
				return 'token update needed';
				// reject('Did not get token');/
			} else {
				// shoul go in pre ??  jwt.verify
				try {
					const hash = await bcrypt.hash(request.payload.password, 10);

					// payload exposed ??? - seems to be after getiing valid tioken.. token exposed?

					//Prevent usert not found
					const oldUser = await User.findOneAndUpdate({ _id: request.params.id }, {  //request.payload.email }, {
						"email": request.payload.email,
						"password": hash
					});
					return {  // Nedd to get user from db before ?
						user: request.params.id,
						oldUser: oldUser
					}
				}
				catch (ex) {
					console.log(ex.message);
					return ex
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
			// Try returnig promise.. addUser like
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

						// generate token after this????
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
				// const user = await auth.authenticate(email, password);
				const user = await auth.authenticate(request.payload.email, request.payload.password);// validate payload ?

				// const email_1 = user[0].email;
				// const password_1 = user[0].password;

				const email_1 = user.user[0].email;
				const password_1 = user.user[0].password;

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

