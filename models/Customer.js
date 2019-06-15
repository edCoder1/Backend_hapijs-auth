const Mongoose = require('mongoose');

const CustomerSchema = new Mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true
		},
		email: {
			type: String,
			required: true,
			trim: true
		},
		balance: {
			type: String,
			default: 0
		}
	},
	{ timestamps: {} }
);

const Customer = Mongoose.model('Costumer', CustomerSchema);
module.exports = Customer;
