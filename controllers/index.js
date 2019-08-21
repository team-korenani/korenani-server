const express = require("express");
const router = express.Router();
const axios = require("axios");
const converter = require("xml-js");

require("dotenv").config({ path: `${__dirname}/../.env` });

router.post("/photos", async (req, res) => {
  const imageData = req.files.image.data;
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
  const xmlString = converter.xml2json(responseFromMStext.data);
  const en = responseFromMS.data.description.tags;
  const ja = JSON.parse(xmlString).elements[0].elements[0].text.split(",");
  const final = {};
  for (let i = 0; i < en.length; i++) {
    final[en[i]] = ja[i];
  }
  res.status(200).send(final);
});

router.get("/", (req, res) => {
  res.sendStatus(418);
});
router.get("*", (req, res) => {
  res.status(404).send("This page does not exist... yet.");
});

module.exports = router;
