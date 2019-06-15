const mongoose = require('mongoose');

UserSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			trim: true
		},
		password: {
			type: String,
			required: true
		}
	},
	{ timestamps: {} }
);

const User = mongoose.model('user', UserSchema);
module.exports = User;
