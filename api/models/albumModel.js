const mongoose = require("mongoose");

const AlbumSchema = new mongoose.Schema({
  name: String,
  image: String,
  date: Date,
  songs: Array,
  author: String,
  authorID: String,
});

module.exports = mongoose.model("Album", AlbumSchema);
