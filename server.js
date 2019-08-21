const express = require("express");
const app = express();
const axios = require("axios");

const port = process.env.PORT || 4000;

const api = require("./controllers");

app.use("/api", api);

app.get("*", (req, res) => {
  res.sendStatus(404);
});
app.listen(port, () => {
  console.log(`Listening on sweet ol' port ${port}!`);
});
