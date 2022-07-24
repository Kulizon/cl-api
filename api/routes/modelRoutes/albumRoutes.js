const Albums = require("./../../models/albumModel");
const Songs = require("./../../models/songModel");
const Authors = require("./../../models/authorModel");

module.exports = (app) => {
  app.get("/albums", (req, res) => {
    Albums.find({}, (e, albums) => {
      if (e) res.send(e);
      res.json(albums);
    });
  });

  app.get("/albums/:id", (req, res) => {
    if (req.params.id === "null") {
      res.json([]);
      return;
    }
    const ids = req.params.id.split(",");

    Albums.find({ _id: { $in: ids } }, (e, albums) => {
      if (e) res.send(e);
      res.json(albums);
    });
  });

  app.post("/albums/create", async (req, res) => {
    let isError = false;

    await Albums.create({ ...req.body }, (e, album) => {
      if (e) {
        res.json({ message: e, code: e.code });
        isError = true;
      }

      Authors.updateOne(
        { _id: req.body.authorID },
        { $push: { albums: { id: album._id, name: req.body.name } } },
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

  app.post("/albums/update/:id", (req, res) => {
    let isError = false;

    Albums.findOne({ _id: req.params.id }, (e, album) => {
      if (e) {
        res.json({ message: e, code: e.code });
        isError = true;
      }

      Authors.updateOne(
        { _id: album.authorID, "albums.id": req.params.id },
        { $set: { "albums.$.name": req.body.name } },
        (e) => {
          if (e) {
            res.json({ message: e, code: e.code });
            isError = true;
          }
        }
      );

      Songs.updateMany({ albumID: album._id }, { $set: { image: req.body.image } }, (e) => {
        if (e) {
          res.json({ message: e, code: e.code });
          isError = true;
        }
      });

      Albums.updateOne(
        { _id: req.params.id },
        { $set: { name: req.body.name, image: req.body.image, date: req.body.date } },
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

  app.post("/albums/delete", (req, res) => {
    let isError = false;

    Albums.deleteOne({ _id: req.body.id }, (e) => {
      if (e) {
        isError = true;
        res.send(e);
      }
    });

    Authors.updateOne({ _id: req.body.authorID }, { $pull: { albums: { id: req.body.id } } }, (e) => {
      if (e) {
        res.json({ message: e, code: e.code });
        isError = true;
      }
    });

    Songs.deleteMany({ albumID: req.body.id }, (e) => {
      if (e) {
        isError = true;
        res.send(e);
      }
    });

    if (!isError) res.json({ message: "Success", code: 200 });
  });
};
