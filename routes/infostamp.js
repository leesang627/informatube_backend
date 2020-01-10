var express = require('express');
var base64Img = require('base64-img');
const puppeteer = require('puppeteer');
var sharp = require('sharp');
var sizeOf = require('image-size');
var fs = require('fs');
var Infostamp = require('../schemas/infostamp');

var router = express.Router();

router.post('/url', function(req, res, next) {
  (async () => {
    let capturedUrl;
    const url = req.body.url;
    const time = new Date().getTime();
    const imgDir = `public/images/${req.body.uid}`;
    if(!fs.existsSync(imgDir)) {
      fs.mkdirSync(imgDir, {recursive: true}, (err) => {
        console.error(err);
      })
    }
    if(url.startsWith('http://') || url.startsWith('https://')){
      capturedUrl = url;
    } else {
      capturedUrl = 'http://'+url;
    }
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Linux; Android 5.1.1; Nexus 5 Build/LMY48B; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/43.0.2357.65 Mobile Safari/537.36');
    await page.goto(capturedUrl, {waitUntil: 'networkidle2'});
    await page.setViewport({
      width: 399,
      height: 860,
    });
    await page.evaluate(() => {
      let elements = document.getElementsByClassName('collapsible-heading');
      for (let element of elements)
        element.click();
    });
    await page.screenshot({
      path: `public/images/${req.body.uid}/tmp.jpg`,
      fullPage: true,
      quality: 90,
    });
    await browser.close();
    await res.json({imageUrl: `http://informatube.ngrok.io/images/${req.body.uid}/tmp.jpg?dummy=`+time});
  })();
})

router.post('/', async (req, res, next) => {
  //infostamp 추가
  try{
    const infostamp = new Infostamp({
      stamper: req.body.uid,
      url: req.body.url,
      info: req.body.info,
      time: req.body.time,
      scroll: req.body.scroll,
      likedUsers: [],
      unlikedUsers: [],
    });
    const imgDir = `public/images/${req.body.uid}`;
    console.log(imgDir);
    const result = await infostamp.save();
    const filepath = await base64Img.imgSync(req.body.imgData, imgDir, 'tmp_sketch');
    await sharp.cache(false);
    const composition = await sharp(filepath).resize({width: 399})
      .composite([{input:`${imgDir}/tmp.jpg`, blend:'overlay'}])
    await composition.jpeg({quality: 90}).toFile(`${imgDir}/${result.id}.jpg`);
    const savedInfostamp = await Infostamp.populate(result, {path: 'stamper'});
    res.status(201).json(savedInfostamp);
  } catch(e) {
    console.error(e);
  }
})

module.exports = router;