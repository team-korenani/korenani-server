const express = require("express");
const router = express.Router();
const axios = require("axios");
const converter = require("xml-js");

require("dotenv").config({ path: `${__dirname}/../.env` });
router.post("/photos", async (req, res) => {
  let arrayOfWords = req.body.keywords;

  const stringText = arrayOfWords.toString();

  // example sentences in EN
  const exampleSentences = await Promise.all(
    arrayOfWords.map(async word => {
      return await axios({
        method: "get",
        url: "https://twinword-word-graph-dictionary.p.rapidapi.com/example/",
        headers: {
          "X-RapidAPI-Host": "twinword-word-graph-dictionary.p.rapidapi.com",
          "X-RapidAPI-Key": process.env.KEY
        },
        params: { entry: word }
      })
        .then(resultArr => {
          return resultArr.data.example.splice(0, 3);
        })
        .catch(e => console.log(e));
    })
  );

  if (exampleSentences[0] === undefined) {
    res.sendStatus(500);
  }

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
  const en = arrayOfWords;
  const ja = JSON.parse(xmlString).elements[0].elements[0].text.split(",");
  const final = [];
  for (let i = 0; i < en.length; i++) {
    const word = {};
    word["en"] = en[i];
    word["ja"] = ja[i];
    word["ex"] = exampleSentences[i];
    final.push(word);
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
