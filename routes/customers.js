const server = require('../app');
const customerHandlers = require('./route_handlers/customer_handlers');

// ROUTER
// Get all customers
module.exports = server.route({
	method: 'GET',
	path: '/api/customers',
	options: customerHandlers.getAll
});

// Get one customer
module.exports = server.route({
	method: 'GET',
	path: '/api/customers/{id}',
	options: customerHandlers.getById
});

// Add one customer
module.exports = server.route({
	method: 'POST',
	path: '/api/customers',
	options: customerHandlers.add
});

// Update Customer
module.exports = server.route({
	method: 'PUT',
	path: '/api/customers/{id}',
	options: customerHandlers.update
});

// Delete customer
module.exports = server.route({
	method: 'DELETE',
	path: '/api/customers/{id}',
	options: customerHandlers.deleteCustomer
});
