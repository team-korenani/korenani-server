const express = require("express");
const router = express.Router();
const axios = require("axios");

require("dotenv").config({ path: `${__dirname}/../.env` });

router.post("/photos", (req, res) => {
  console.log(req);
  // const results = await axios({
  //   method: "post",
  //   url:
  //     "https://microsoft-azure-microsoft-computer-vision-v1.p.rapidapi.com/describe",
  //   headers: {
  //     "X-RapidAPI-Host":
  //       "microsoft-azure-microsoft-computer-vision-v1.p.rapidapi.com",
  //     "X-RapidAPI-Key": process.env.KEY
  //   },
  //   data: req
  // });
  // console.log("here the results!", results);
  res.send("I have been naughty... ( ͡° ͜ʖ ͡°)");
});

router.get("/", (req, res) => {
  res.sendStatus(418);
});
router.get("*", (req, res) => {
  res.status(404).send("This page does not exist... yet.");
});

module.exports = router;
