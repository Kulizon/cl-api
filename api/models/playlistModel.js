const mongoose = require("mongoose");

const PlaylistSchema = new mongoose.Schema({
  songs: [],
  name: String,
  author: String,
  authorID: String,
  image: String,
  type: String,
});

module.exports = mongoose.model("Playlist", PlaylistSchema);
