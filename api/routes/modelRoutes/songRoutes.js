const Albums = require("./../../models/albumModel");
const Songs = require("./../../models/songModel");

const shuffleArray = require("./../../utilities/shuffleArray");

module.exports = (app) => {
  app.get("/songs", (req, res) => {
    Songs.find({}, (e, songs) => {
      if (e) res.send(e);

      res.json(songs);
    });
  });

  app.get("/songs/:id", (req, res) => {
    if (req.params.id === ",") {
      res.json([]);
      return;
    }
    const ids = req.params.id.split(",").slice(0, -1);

    Songs.find({ _id: { $in: ids } }, (e, foundSongs) => {
      if (e) res.send(e);
      res.json(foundSongs);
    });
  });

  app.get("/songs/random/:id/:limit", (req, res) => {
    const ids = req.params.id.split(",").slice(0, -1);

    const selectedIDs = [];

    let i = 0;
    while (i < req.params.limit) {
      const r = Math.floor(Math.random() * ids.length);

      if (!selectedIDs.includes(ids[r])) {
        selectedIDs.push(ids[r]);
        i += 1;
      }
    }

    Songs.find({ _id: { $in: selectedIDs } }, (e, foundSongs) => {
      if (e) res.send(e);
      const songs = [...foundSongs];
      shuffleArray(songs);
      res.json(songs);
    });
  });

  app.post("/songs/create", async (req, res) => {
    let isError = false;

    await Songs.create({ ...req.body }, (e, song) => {
      if (e) {
        res.json({ message: e, code: e.code });
        isError = true;
        return;
      }
      Albums.updateOne(
        { _id: req.body.albumID },
        {
          $push: {
            songs: { id: song._id, name: req.body.name, songLength: req.body.songLength, audio: req.body.audio },
          },
        },
        (e) => {
          if (e) {
            res.json({ message: e, code: e.code });
            isError = true;
          }
        }
      );
    });

    if (!isError) res.json({ message: "Success", code: 200 });
  });

  app.post("/songs/update/:id", (req, res) => {
    let isError = false;

    Songs.findOne({ _id: req.params.id }, (e, song) => {
      if (e) {
        res.json({ message: e, code: e.code });
        isError = true;
      }

      Albums.updateOne(
        { _id: song.albumID, "songs.id": song._id },
        {
          $set: {
            "songs.$.name": req.body.name,
            "songs.$.audio": req.body.audio,
            "songs.$.songLength": req.body.songLength,
          },
        },
        (e) => {
          if (e) {
            res.json({ message: e, code: e.code });
            isError = true;
          }
        }
      );

      Songs.updateOne(
        { _id: req.params.id },
        { $set: { name: req.body.name, audio: req.body.audio, songLength: req.body.songLength } },
        (e) => {
          if (e) {
            res.json({ message: e, code: e.code });
            isError = true;
          }
        }
      );
    });

    if (!isError) res.json({ message: "Success", code: 200 });
  });

  app.post("/songs/delete", async (req, res) => {
    let isError = false;

    Albums.updateOne({ _id: req.body.albumID }, { $pull: { songs: { id: req.body.id } } }, (e) => {
      if (e) {
        res.json({ message: e, code: e.code });
        isError = true;
      }

      Songs.deleteOne({ _id: req.body.id }, (e) => {
        if (e) {
          res.json({ message: e, code: e.code });
          isError = true;
        }
      });
    });

    if (!isError) res.json({ message: "Success", code: 200 });
  });
};
