const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  posts: [
    {
      imageUrl: String,
      caption: String,
      createdAt: Date,
      likes: { type: Number, default: 0 },
      dislikes: { type: Number, default: 0 },
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
