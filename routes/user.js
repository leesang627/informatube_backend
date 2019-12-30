var express = require('express');
var User = require('../schemas/user');
const passport = require('passport');

var router = express.Router();

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    return req.login(user, (loginErr) => {
      if (loginErr){
        return next(loginErr);
      }
      return res.status(201).json(user);
    });
  })(req, res, next);
})

router.post('/logout', (req, res, next) => {
  console.log('logout request');
  req.logout();
  req.session.destroy();
  console.log('session destroyed');
  res.send('logout 성공!');
})

router.get('/', (req,res) => {
  if(!req.user) {
    return res.status(401).send('로그인이 필요합니다.');
  }
  return res.json(req.user);
})

module.exports = router;