const express = require("express");
const app = express();
const api = require("./controllers");

const port = process.env.PORT || 4000;

app.use("/api", api);

app.get("*", (req, res) => {
  res.status(404).send("Go is not here at the moment!");
});
app.listen(port, () => {
  console.log(`Listening on sweet ol' port ${port}!`);
});
