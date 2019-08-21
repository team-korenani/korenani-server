const express = require("express");
const router = express.Router();
const axios = require("axios");

require("dotenv").config({ path: `${__dirname}/../.env` });

router.post("/photos", async (req, res) => {
  const imageData = req.files.steppico.data;
  const responseFromMS = await axios({
    method: "post",
    url:
      "https://microsoft-azure-microsoft-computer-vision-v1.p.rapidapi.com/describe",
    headers: {
      "X-RapidAPI-Host":
        "microsoft-azure-microsoft-computer-vision-v1.p.rapidapi.com",
      "X-RapidAPI-Key": process.env.KEY,
      "Content-Type": "application/octet-stream"
    },
    data: imageData
  });
  const stringText = responseFromMS.data.description.tags.toString();

  const responseFromMStext = await axios({
    method: "get",
    url: "https://microsoft-azure-translation-v1.p.rapidapi.com/translate",
    headers: {
      "X-RapidAPI-Host": "microsoft-azure-translation-v1.p.rapidapi.com",
      "X-RapidAPI-Key": process.env.KEY,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    params: {
      from: "en",
      to: "ja",
      text: stringText
    }
  });
  console.log("from MS vision", responseFromMS.data.description.tags);
  console.log("here the translate", responseFromMStext.data);
  res.send("I have been naughty... ( ͡° ͜ʖ ͡°)");
});

router.get("/", (req, res) => {
  res.sendStatus(418);
});
router.get("*", (req, res) => {
  res.status(404).send("This page does not exist... yet.");
});

module.exports = router;
