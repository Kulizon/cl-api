const mongoose = require("mongoose");

const EpisodeSchema = new mongoose.Schema({
  name: String,
  podcast: String,
  podcastID: String,
  audio: String,
  image: String,
  description: String,
  date: Date,
  episodeLength: String,
});

module.exports = mongoose.model("Episode", EpisodeSchema);
