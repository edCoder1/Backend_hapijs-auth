const server = require('../app');
const users_handler = require('./route_handlers/users_hadler');

// Router

// Get Users
module.exports = server.route({
	method: 'GET',
	path: '/api/users',
	options: users_handler.getUsers
});

// Get user by Id
exports = server.route({
	method: 'GET',
	path: '/api/users/{id}',
	options: users_handler.getUserById
});

// Add user
exports = server.route({
	method: 'POST',
	path: '/api/users',
	options: users_handler.addUser
});

// Update user by Id
exports = server.route({
	method: 'PUT',
	path: '/api/users/{id}',
	// handler: users_handler.updateUser_v1
	options: users_handler.updateUser
});

// Delete user
exports = server.route({
	method: 'DELETE',
	path: '/api/users/{id}',
	options: users_handler.deleteUser
});

// Register User
exports = server.route({
	method: 'POST',
	path: '/api/register',
	options: users_handler.registerUser
});

exports = server.route({
	method: 'POST',
	path: '/api/authorize',
	options: users_handler.auth
});
