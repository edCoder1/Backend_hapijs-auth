const server = require('../app');
const posts_handler = require('./route_handlers/posts_handler');

// Router

// Get Posts
module.exports = server.route({
    method: 'GET',
    path: '/api/posts',
    options: posts_handler.getPosts
});

// Get post by Id
exports = server.route({
    method: 'GET',
    path: '/api/posts/{id}',
    options: posts_handler.getPostById
});

// Create Post
exports = server.route({
    method: 'POST',
    path: '/api/posts',
    options: posts_handler.createPost
});

// Update post by Id
exports = server.route({
    method: 'PUT',
    path: '/api/posts/{id}',
    options: posts_handler.updatePost
});

// Delete post
exports = server.route({
    method: 'DELETE',
    path: '/api/posts/{id}',
    options: posts_handler.deletePost
});