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
    const browser = await puppeteer.launch({
      defaultViewport: {
        width: 400,
        height: 860,
        deviceScaleFactor: 1.5,
      }
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1');
    await page.goto(capturedUrl, {waitUntil: 'networkidle2'});
    await page.evaluate(() => {
      let elements = document.getElementsByClassName('collapsible-heading');
      for (let element of elements)
        element.click();
    });
    await page.screenshot({
      path: `public/images/${req.body.uid}/tmp.jpg`,
      fullPage: true,
    });
    await browser.close();
    await res.json({imageUrl: `http://informatube.ngrok.io/images/${req.body.uid}/tmp.jpg?dummy=`+time});
  })();
})

router.post('/', function(req, res, next) {
  //infostamp 추가
  const infostamp = new Infostamp({
    stamper: req.body.uid,
    url: req.body.url,
    info: req.body.info,
    time: req.body.time,
    scroll: req.body.scroll,
    likedUsers: [],
    unlikedUsers: [],
  });
  infostamp.save()
    .then((result) => {
      const imgDir = `public/images/${req.body.uid}`;
      base64Img.img(req.body.imgData,imgDir,'tmp_sketch',(err, filepath) => {
        const dimension = sizeOf(`public/images/${req.body.uid}/tmp.jpg`);
        sharp.cache(false);
        console.log(filepath);
        sharp(filepath)
          .resize({width: dimension.width})
          .composite([{input:`${imgDir}+/tmp.jpg'`, blend:'overlay'}])
          .toFile(`${imgDir}/${result.id}.jpg`);
      })
      return Infostamp.populate(result, {path: 'stamper'});
    })
    .then((result) => {
      console.log('save');
      res.status(201).json(result);
    })
  
})

module.exports = router;