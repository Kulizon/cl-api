const mongoose = require("mongoose");

const Songs = require("../models/songModel");
const Albums = require("../models/albumModel");
const Authors = require("../models/authorModel");
const Episodes = require("../models/episodeModel");
const Podcasts = require("../models/podcastModel");
const Users = require("../models/userModel");
const Playlists = require("../models/playlistModel");

module.exports = (app) => {
  app.post("/search", (req, res) => {
    const searchQuery = req.body.searchQuery;
    const model = mongoose.model(req.body.type.value);

    if (!model) {
      res.json({ body: "Please, enter a valid type", code: null });
      return;
    }

    model.find({ name: { $regex: searchQuery, $options: "i" } }, (e, results) => {
      if (e) {
        res.json({ message: e, code: null });
        return;
      }

      res.json({ results: results, code: 200, query: searchQuery, type: req.body.type.label });
    });
  });

  app.get("/admin/all", async (req, res) => {
    const results = {};

    await Albums.find({}, (e, albums) => {
      if (e) console.log(e);
      results.albums = albums;
    }).clone();

    await Authors.find({}, (e, authors) => {
      if (e) console.log(e);
      results.authors = authors;
    }).clone();

    await Episodes.find({}, (e, episodes) => {
      if (e) console.log(e);
      results.episodes = episodes;
    }).clone();

    await Playlists.find({}, (e, playlists) => {
      if (e) console.log(e);
      results.playlists = playlists;
    }).clone();

    await Podcasts.find({}, (e, podcasts) => {
      if (e) console.log(e);
      results.podcasts = podcasts;
    }).clone();

    await Songs.find({}, (e, songs) => {
      if (e) console.log(e);
      results.songs = songs;

      Users.find({}, (e, users) => {
        if (e) console.log(e);
        results.users = users;

        res.json(results);
      }).clone();
    }).clone();
  });
};
