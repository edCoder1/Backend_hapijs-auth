// Catch all errors properly
const jwt = require('../../node_modules/jsonwebtoken');
const auth = require('../../auth');
const Post = require('../../models/Post');
const CONFIG = require('../../config');

module.exports = {
    getPosts: {
        description: 'Get all Posts',
        handler: async (request, h) => {
            const posts = await Post.find();
            return posts;
        }
    },
    getPostById: {
        description: 'Get one post by Id',
        handler: async (request, h) => {
            const post = await Post.findById(request.params.id);
            return post;
        }
    },
    createPost: {
        description: 'Add one Post',
        handler: async (request, h) => {
            // if (request.headers['content-type'] !== 'application/json') {
            //     return 'Expected "application/json"';
            // }
            const { user, text } = request.payload;
            const post = new Post({
                user,
                text
            });

            const newUser = await post.save();
            return 'Post successfully added';
        }
    },
    updatePost: {
        description: 'Update one Post',
        pre: [
            {
                method: auth.verifyToken,
                assign: 'verifyToken'
            }
        ],
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
                            const post = await Post.findOneAndUpdate({ _id: request.params.id }, request.payload);
                            if (post) {
                                return `Successfully updated post with id ${request.params.id}`;
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
    deletePost: {
        description: 'Delete post',
        handler: async (request, h) => {
            try {
                const post = await Post.findByIdAndRemove({ _id: request.params.id });
                return 'Post successfully deleted';
            } catch (error) {
                return 'Id not found';
            }
        }
    }
};
