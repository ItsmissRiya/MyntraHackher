// Assuming you have a 'User' model already defined
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  imageUrl: String,
  caption: String,
  createdAt: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to User model
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
