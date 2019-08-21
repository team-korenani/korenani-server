const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/photos", (req, res) => {
  res.send("I have been naughty... ( ͡° ͜ʖ ͡°)");
});

router.get("/", (req, res) => {
  res.sendStatus(418);
});
router.get("*", (req, res) => {
  res.status(404).send("This page does not exist... yet.");
});

module.exports = router;
