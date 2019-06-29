const bcrypt = require('./node_modules/bcryptjs');
// const mongoose = require('mongoose');
// const UserSchema = require('./models/User').schema;
const User = require('./models/User'); // mongoose.model('user', UserSchema);

exports.authenticate = (email, password) => {
	return new Promise(async (resolve, reject) => {
		try {
			// Get user by mail
			const user = await User.find({ email }); // {email} = {email :email}

			// Match Password
			bcrypt.compare(password, user[0].password, (error, isMatch) => {
				if (error) {
					console.log(error);
					throw error;
				}
				if (isMatch) {
					resolve(user);
				} else {
					// Pass did not match
					reject('Authentication failed');
				}
			});
		} catch (error) {
			// Email not found
			reject('Authentication failed');
		}
	});
};

// Format of token
// Autorization: JWT <access_token>

// Verify Token
exports.verifyToken = (request, h) => {
	console.log('1');
	// Get auth header value
	const jwtHeader = request.headers['authorization'] ? request.headers['authorization'] : null;
	// Check if header authorization is populated
	if (jwtHeader) {
		// Split at the space
		const jwt = jwtHeader.split(' ');
		// Get token from array
		const token = jwt[1];
		// Set the token
		request.token = token;
		return 'Got token';
	} else {
		return 'Did not get token';
	}
};
