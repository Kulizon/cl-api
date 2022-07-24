const Podcasts = require("./../../models/podcastModel");
const Episodes = require("./../../models/episodeModel");

module.exports = (app) => {
  app.get("/episodes/:id", (req, res) => {
    console.log(123);
    console.log(req.params);
    if (req.params.id === ",") {
      res.json([]);
      return;
    }

    const ids = req.params.id.split(",").slice(0, -1);

    Episodes.find({ _id: { $in: ids } }, (e, podcasts) => {
      if (e) res.send(e);
      res.json(podcasts);
    });
  });

  app.post("/episodes/create", (req, res) => {
    Episodes.create({ ...req.body }, (e, episode) => {
      if (e) res.json({ message: e, code: e.code });

      Podcasts.updateOne({ _id: req.body.podcastID }, { $push: { episodes: { ...episode } } }, (e) => {
        if (e) res.json({ message: e, code: e.code });
        else res.json({ message: "Success", code: 200 });
      });
    });
  });

  app.post("/episodes/delete", (req, res) => {
    Podcasts.updateOne(
      { "episodes._id": mongoose.Types.ObjectId(req.body.id) },
      { $pull: { episodes: { _id: mongoose.Types.ObjectId(req.body.id) } } },
      (e) => {
        if (e) res.json({ message: e, code: e.code });

        Episodes.deleteOne({ _id: req.body.id }, (e) => {
          if (e) res.json({ message: e, code: e.code });
          else res.json({ message: "Success", code: 200 });
        });
      }
    );
  });

  app.post("/episodes/update/:id", (req, res) => {
    Podcasts.updateOne(
      { _id: req.body.podcastID, "episodes._id": mongoose.Types.ObjectId(req.params.id) },
      {
        $set: {
          "episodes.$.name": req.body.name,
          "episodes.$.image": req.body.image,
          "episodes.$.episodeLength": req.body.episodeLength,
          "episodes.$.audio": req.body.audio,
          "episodes.$.description": req.body.description,
          "episodes.$.date": req.body.date,
        },
      },
      (e, p) => {
        if (e) console.log(e);

        Episodes.updateOne(
          { _id: req.params.id },
          {
            name: req.body.name,
            image: req.body.image,
            episodeLength: req.body.episodeLength,
            audio: req.body.audio,
            description: req.body.description,
            date: req.body.date,
          },
          (e) => {
            if (e) res.json({ message: e, code: e.code });
            else res.json({ message: "Success", code: 200 });
          }
        );
      }
    );
  });
};
