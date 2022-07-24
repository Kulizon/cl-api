const Albums = require("./../../models/albumModel");
const Songs = require("./../../models/songModel");
const Authors = require("./../../models/authorModel");

module.exports = (app) => {
  app.get("/authors/random", async (req, res) => {
    const c = await Authors.countDocuments();
    const random = Math.floor(Math.random() * parseInt(c));

    Authors.find({}, (e, authors) => {
      if (e) console.log(e);
      res.json(authors[0]);
    })
      .limit(0)
      .skip(random);
  });

  app.get("/authors/:id", (req, res) => {
    Authors.findOne({ _id: req.params.id }, (e, author) => {
      if (e) res.send(e);
      res.json(author);
    });
  });

  app.get("/authors/multiple/:id", (req, res) => {
    if (req.params.id === "null") {
      res.json([]);
      return;
    }
    const ids = req.params.id.split(",");

    Authors.find({ _id: { $in: ids } }, (e, foundAuthors) => {
      if (e) res.send(e);
      res.json(foundAuthors);
    });
  });

  app.post("/authors/create", (req, res) => {
    Authors.create({ ...req.body }, (e) => {
      if (e) res.json({ message: e, code: e.code });
      else res.json({ message: "Success", code: 200 });
    });
  });

  app.post("/authors/update/:id", (req, res) => {
    let isError = false;

    Authors.findOne({ _id: req.params.id }, (e, author) => {
      if (e) {
        res.json({ message: e, code: e.code });
        isError = true;
      }

      Albums.updateMany({ authorID: author._id }, { $set: { author: req.body.name } }, (e) => {
        if (e) {
          res.json({ message: e, code: e.code });
          isError = true;
        }
      });

      Songs.updateMany({ authorID: author._id }, { $set: { author: req.body.name } }, (e) => {
        if (e) {
          res.json({ message: e, code: e.code });
          isError = true;
        }
      });

      Authors.updateOne({ _id: req.params.id }, { $set: { name: req.body.name, image: req.body.image } }, (e) => {
        if (e) {
          res.json({ message: e, code: e.code });
          isError = true;
        }
      });
    });

    if (!isError) res.json({ message: "Success", code: 200 });
  });

  app.post("/authors/delete", (req, res) => {
    let isError = false;

    Authors.deleteOne({ _id: req.body.id }, (e) => {
      if (e) {
        isError = true;
        res.send(e);
      }
    });

    Albums.deleteMany({ authorID: req.body.id }, (e) => {
      if (e) {
        isError = true;
        res.send(e);
      }
    });

    Songs.deleteMany({ authorID: req.body.id }, (e) => {
      if (e) {
        isError = true;
        res.send(e);
      }
    });

    if (!isError) res.json({ message: "Success" });
  });
};
