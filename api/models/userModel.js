const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  image: String,
  likedSongs: Array,
  likedAlbums: Array,
  likedEpisodes: Array,
  likedPodcasts: Array,
  playlists: [],
  following: Array,
  followers: Array,
  history: Array,
  listeningHistory: Array,
  isAdmin: Boolean,
});

module.exports = mongoose.model("User", UserSchema);
