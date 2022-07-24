const mongoose = require("mongoose");

const SongSchema = new mongoose.Schema({
  name: String,
  audio: String,
  author: String,
  authorID: String,
  songLength: String,
  album: String,
  albumID: String,
  image: String,
});

module.exports = mongoose.model("Song", SongSchema);
