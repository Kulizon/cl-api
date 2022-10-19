const Playlists = require("./../../models/playlistModel");
const Users = require("./../../models/userModel");
const mongoose = require("mongoose");

module.exports = (app) => {
  app.get("/playlists/:id", (req, res) => {
    Playlists.findOne({ _id: req.params.id }, (e, playlist) => {
      if (e) res.send(e);
      res.json(playlist);
    });
  });

  app.post("/playlists/delete", (req, res) => {
    console.log(req.body.id);
    Playlists.deleteOne({ _id: req.body.id }, (e) => {
      if (e) console.log(e);

      Users.updateMany(
        {},
        {
          $pull: {
            playlists: {
              type: "playlist",
              _id: mongoose.Types.ObjectId(req.body.id),
            },
          },
        },
        (e) => {
          if (e) console.log(e);

          res.json({ message: "Success", code: 200 });
        }
      );
    });
  });

  app.post("/playlists/update", (req, res) => {
    Playlists.updateOne(
      { _id: req.body.id },
      { name: req.body.name, image: req.body.image },
      (e) => {
        if (e) console.log(e);

        Users.updateMany(
          { "playlists._id": req.body.id, "playlists.type": "playlist" },
          {
            $set: {
              "playlists.$.name": req.body.name,
              "playlists.$.image": req.body.image,
            },
          },
          (e) => {
            if (e) console.log(e);

            res.json({ message: "Success", code: 200 });
          }
        );
      }
    );
  });

  app.post("/playlists/add-to", (req, res) => {
    Playlists.findOne({ _id: req.body.id }, (e, playlist) => {
      for (let i = 0; i < playlist.songs.length; i++) {
        if (playlist.songs[i].id === req.body.song.id) {
          res.json({ message: "Already in playlist", code: null });
          return;
        }
      }

      Playlists.updateOne(
        { _id: req.body.id },
        { $push: { songs: { ...req.body.song } } },
        (e) => {
          if (e) console.log(e);

          Users.updateMany(
            { "playlists._id": req.body.id, "playlists.type": "playlist" },
            { $push: { "playlists.$.songs": { ...req.body.song } } },
            (e) => {
              if (e) console.log(e);

              res.json({ message: "Success", code: 200 });
            }
          );
        }
      );
    });
  });

  app.post("/playlists/delete-from", (req, res) => {
    Playlists.updateOne(
      { _id: req.body.id },
      { $pull: { songs: { id: req.body.songID } } },
      (e) => {
        if (e) console.log(e);

        Users.updateMany(
          { "playlists._id": req.body.id, "playlists.type": "playlist" },
          { $pull: { "playlists.$.songs": { id: req.body.songID } } },
          (e) => {
            if (e) console.log(e);

            res.json({ message: "Success", code: 200 });
          }
        );
      }
    );
  });

  app.post("/playlists/create", (req, res) => {
    Playlists.create(
      {
        songs: [...req.body.songs],
        author: req.body.author,
        authorID: req.body.authorID,
        name: req.body.name,
        type: req.body.type,
        image: req.body.image ? req.body.image : "",
      },
      (e, playlist) => {
        if (e) console.log(e);

        Users.updateOne(
          { _id: req.body.authorID },
          { $push: { playlists: { ...playlist } } },
          (e, user) => {
            if (e) console.log(e);

            if (req.body.isFromAdmin) {
              res.json({ message: "Success", code: 200 });
              return;
            }

            res.json(playlist);
          }
        );
      }
    );
  });
};
