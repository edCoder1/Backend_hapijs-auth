// Catch all errors properly

const Customer = require('../../models/Customer');

module.exports = {
	getAll: {
		description: '0',
		handler: async (request, h) => {
			const customers = await Customer.find();
			return customers;
			// return null;
		}
	},

	getById: {
		description: '1',
		handler: async (request, h) => {
			const customer = await Customer.findById(request.params.id);
			return customer;
		}
	},

	add: {
		description: '2',
		handler: async (request, h) => {
			if (request.headers['content-type'] !== 'application/json') {
				return 'Expected "application/json"';
			}

			const { name, email, balance } = request.payload;
			const customer = new Customer({
				name,
				email,
				balance
			});

			const newCustomer = await customer.save();
			return 'Customer succefully added';
		}
	},

	update: {
		description: '3',
		handler: async (request, h) => {
			if (request.headers['content-type'] !== 'application/json') {
				return 'Expected "application/json"';
			}
			try {
				const customer = await Customer.findOneAndUpdate({ _id: request.params.id }, request.payload);
				return `Succesfully updated Customer with id of ${request.params.id}`;
			} catch (error) {
				console.log('error', error);
				error.aditional_message = 'Id not found';
				return error.aditional_message; // Dive into this. Check how to send/modify custom message
			}
		}
	},

	deleteCustomer: {
		description: 'Delete Customer',
		handler: async (request, h) => {
			try {
				const customer = await Customer.findOneAndRemove({ _id: request.params.id }); // Keeps the id???
				return 'Customer Deleted';
			} catch (error) {
				return 'Id not found'; // Dive intop this. Check how to send/modify custom message
			}
		}
	}
};
