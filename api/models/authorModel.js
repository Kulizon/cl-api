const mongoose = require("mongoose");

const AuthorSchema = new mongoose.Schema({
  name: String,
  image: String,
  albums: [{id: String, name: String}],
});

module.exports = mongoose.model("Author", AuthorSchema);
