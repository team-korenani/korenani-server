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
      "https://microsoft-azure-microsoft-computer-vision-v1.p.rapidapi.com/analyze?visualfeatures=Tags",
    headers: {
      "X-RapidAPI-Host":
        "microsoft-azure-microsoft-computer-vision-v1.p.rapidapi.com",
      "X-RapidAPI-Key": process.env.KEY,
      "Content-Type": "application/octet-stream"
    },
    data: imageData
  });

  const resultFiltered2 = responseFromMS.data.tags.filter(item => {
    if (item.confidence > 0.85) {
      return item.name;
    }
  });

  //edge case if no confidence greater then 0.85 or too much results over 0.85
  if (resultFiltered2.length === 0) {
    res.send("I'm not quite sure... please take a picture again");
  } else if (resultFiltered2.length > 5) {
    resultFiltered2.splice(5);
  }

  const resultMapped = resultFiltered2.map(item => {
    return item.name;
  });
  const stringText = resultMapped.toString();

  //send stringify array to MS text API to translate
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

  //creates result object with combination of english and japanese
  const xmlString = converter.xml2json(responseFromMStext.data);
  const en = resultMapped;
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
