const Users = require("./../../models/userModel");

module.exports = (app) => {
  app.get("/users/:id", (req, res) => {
    Users.findOne({ _id: req.params.id }, (e, user) => {
      if (e) res.send(e);
      res.json(user);
    });
  });

  app.post("/users/delete", (req, res) => {
    Users.deleteOne({ _id: req.body.id }, (e, user) => {
      if (e) res.send(e);
      res.json({ message: "Success", code: 200 });
    });
  });

  app.post("/users/:id/update", (req, res) => {
    Users.updateOne(
      { _id: req.body._id },
      {
        username: req.body.username,
        image: req.body.image,
        likedSongs: req.body.likedSongs ? [...req.body.likedSongs] : [],
        likedAlbums: req.body.likedAlbums ? [...req.body.likedAlbums] : [],
        likedPodcasts: req.body.likedPodcasts ? [...req.body.likedPodcasts] : [],
        likedEpisodes: req.body.likedEpisodes ? [...req.body.likedEpisodes] : [],
        following: req.body.following ? [...req.body.following] : [],
        followers: req.body.followers ? [...req.body.followers] : [],
        history: [...req.body.history],
        listeningHistory: [...req.body.listeningHistory],
        playlists: [...req.body.playlists],
      },
      (e, u) => {
        if (e) res.send(e);

        if (!e) res.json({ message: "Success", code: 200 });
      }
    );
  });

  app.post("/users/:id/playlists/mixes", (req, res) => {
    Users.updateOne({ _id: req.params.id }, { $pull: { playlists: { type: "mix" } } }, (e) => {
      if (e) res.send(e);
    });
    Users.updateOne({ _id: req.params.id }, { $push: { playlists: { $each: req.body } } }, (e) => {
      if (e) res.send(e);
    });
  });
};
