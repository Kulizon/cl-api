const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

mongoose.Promise = global.Promise;

// mongoose.connect("mongodb://localhost:27017/clotify");
mongoose.connect(`mongodb+srv://new-admin:${process.env.DB_PASSWORD}@clotify.netpw.mongodb.net/clotify?retryWrites=true&w=majority`);

app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "50mb",
  })
);
app.use(bodyParser.json({ limit: "50mb" }));

require("./api/routes/authenticationRoutes")(app);
require("./api/routes/modelRoutes/songRoutes")(app);
require("./api/routes/modelRoutes/albumRoutes")(app);
require("./api/routes/modelRoutes/authorRoutes")(app);
require("./api/routes/modelRoutes/episodeRoutes")(app);
require("./api/routes/modelRoutes/podcastRoutes")(app);
require("./api/routes/modelRoutes/playlistRoutes")(app);
require("./api/routes/modelRoutes/userRoutes")(app);

require("./api/routes/otherRoutes")(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);

console.log("Server started on: " + PORT);
