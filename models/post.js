const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    user: String,
    title: String,
    content: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});
module.exports = mongoose.model('Post', postSchema);
