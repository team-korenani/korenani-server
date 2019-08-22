const express = require("express");
const app = express();
const api = require("./controllers");
const port = process.env.PORT || 4000;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.json({ limit: "50mb" }));

app.use("/api", api);

app.get("*", (req, res) => {
  res.status(404).send("Go is not here at the moment!");
});
app.listen(port, () => {
  console.log(`Listening on sweet ol' port ${port}!`);
});
