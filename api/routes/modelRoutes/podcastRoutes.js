const Podcasts = require("./../../models/podcastModel");
const Episodes = require("./../../models/episodeModel");

module.exports = (app) => {
  app.get("/podcasts/:id", (req, res) => {
    if (req.params.id === "null") {
      res.json([]);
      return;
    };
    const ids = req.params.id.split(",");

    console.log(ids);

    Podcasts.find({ _id: { $in: ids } }, (e, podcasts) => {
      if (e) res.send(e);
      res.json(podcasts);
    });
  });

  app.post("/podcasts/create", (req, res) => {
    Podcasts.create({ ...req.body }, (e) => {
      if (e) res.json({ message: e, code: e.code });
      else res.json({ message: "Success", code: 200 });
    });
  });

  app.post("/podcasts/update/:id", (req, res) => {
    Podcasts.updateOne(
      { _id: req.params.id },
      { name: req.body.name, image: req.body.image, author: req.body.author, description: req.body.description },
      (e) => {
        if (e) res.json({ message: e, code: e.code });

        Episodes.updateMany({ podcastID: req.params.id }, { podcast: req.body.name }, (e) => {
          if (e) res.json({ message: e, code: e.code });
          else res.json({ message: "Success", code: 200 });
        });
      }
    );
  });

  app.post("/podcasts/delete", (req, res) => {
    Podcasts.deleteOne({ _id: req.body.id }, (e) => {
      if (e) res.json({ message: e, code: e.code });

      Episodes.deleteMany({ podcastID: req.body.id }, (e) => {
        if (e) res.json({ message: e, code: e.code });
        else res.json({ message: "Success", code: 200 });
      });
    });
  });
};
