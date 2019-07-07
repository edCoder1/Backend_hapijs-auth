const bcrypt = require('./node_modules/bcryptjs');
// const mongoose = require('mongoose');
const jwt = require('./node_modules/jsonwebtoken');
// const UserSchema = require('./models/User').schema;
const User = require('./models/User'); // mongoose.model('user', UserSchema);

const CONFIG = require('./config');

exports.authenticate = (email, password) => {
	return new Promise(async (resolve, reject) => {
		try {
			// Get user by mail
			const user = await User.find({ email }); // {email} = {email :email}

			// Match Password  // errors on not encrpted pass?
			bcrypt.compare(password, user[0].password, (error, isMatch) => {
				if (error) {
					console.log(error);
					throw error;
				}

				isMatch ? resolve({ user, }) : reject('Auth Failed');
			});
			// user ? resolve({ user, }) : reject('Auth Failed');

		} catch (error) {
			// Email not found
			reject('Authentication failed');
		}
	});
};

// Format of token
// Autorization: JWT <access_token>

// Verify Token
exports.getTokenFromHeadersAndVerify = (request, h) => {  //catch token exoired and  invalid signature
	console.log('1');
	// Get auth header value
	const jwtHeader = request.headers['authorization'] ? request.headers['authorization'] : null;
	// Check if header authorization is populated
	if (jwtHeader) {
		try {
			// Split at the space
			jwtArray = jwtHeader.split(' ');
			// Get token from array
			const token = jwtArray[1];
			// Set the token
			// request.token = token;
			const decoded = jwt.verify(token, CONFIG.JWT_SECRET);    //request.token, CONFIG.JWT_SECRET);
			if (decoded) { return 'verified Token'; }   //token verified ?
		} catch (error) {
			console.log(error);
			// REDIRECT TO LOGIN ???  !Does not crash
			return 'need token update' //Use boom ???
		}
	} else {
		return 'Did not get token';
	}
};
