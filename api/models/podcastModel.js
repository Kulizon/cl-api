const mongoose = require("mongoose");

const PodcastSchema = new mongoose.Schema({
  episodes: Array,
  name: String,
  author: String,
  image: String,
  description: String,
});

module.exports = mongoose.model("Podcast", PodcastSchema);
