const bcrypt = require("bcrypt");
const saltRounds = 10;

const Users = require("./../models/userModel");

module.exports = (app) => {
  app.post("/register", (req, res) => {
    Users.findOne({ email: req.body.email, username: req.body.username }, (e, user) => {
      if (e) {
        res.json({ message: e, code: null });
        return;
      }

      if (!user || user.length === 0) {
        bcrypt.hash(req.body.password, saltRounds, (e, hashedPassword) => {
          if (e) {
            res.json({ message: e, code: null });
            return;
          }

          Users.create(
            {
              name: req.body.username,
              email: req.body.email,
              password: hashedPassword,
              image: "",
              likedSongs: [],
              likedAlbums: [],
              likedPodcasts: [],
              playlists: [],
              following: [],
              followers: [],
              history: [],
              listeningHistory: [],
            },
            (e) => {
              if (e) {
                res.json({ message: e, code: null });
                return;
              }

              res.json({ message: "Success", code: 200 });
            }
          );
        });
      } else {
        if (user.username === req.body.username) {
          res.json({ message: "This username is already taken.", code: null });
          return;
        } else if (user.email === req.body.email) {
          res.json({ message: "This email is already taken.", code: null });
          return;
        }
      }
    });
  });

  app.post("/login", (req, res) => {
    Users.findOne({ email: req.body.email }, (e, user) => {
      if (e) {
        res.json({ message: e, code: null });
        return;
      }

      if (!user) {
        res.json({ message: "There is no user with such email.", code: null });
        return;
      }

      if (user) {
        bcrypt.compare(req.body.password, user.password, (e, result) => {
          if (e) {
            res.json({ message: e, code: null });
            return;
          }

          if (result === true) {
            res.json({ message: "Success", code: 200, user: user });
          } else if (result === false) {
            res.json({ message: "Your password is incorrect.", code: null });
          }
        });
      }
    });
  });
};
