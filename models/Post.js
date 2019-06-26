const mongoose = require('mongoose');

PostSchema = new mongoose.Schema(
    {
        user: {
            type: String,
            required: true,
            trim: true
        },
        text: {
            type: String,
            required: true
        }
    },
    { timestamps: {} }
);

const Post = mongoose.model('posts', PostSchema);
module.exports = Post;
