var express = require('express');
var Infostamp = require('../schemas/infostamp');
var User = require('../schemas/user');
var router = express.Router();

router.get('/', function(req, res, next) {
  Infostamp.find({}).populate('stamper')
    .then((infostamps) => {
      res.json(infostamps);
    })
    .catch((err) => {
      next(err);
    })
});

router.patch('/like', function(req, res, next) {
  Infostamp.updateOne(
    {_id: req.body.iid},
    { $push: {likedUsers: req.body.uid} })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      next(err);
    });
  User.updateOne(
    {_id: req.body.uid},
    { $push: {likedInfostamps: req.body.iid} })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      next(err);
    })
});

router.patch('/like/cancel', function(req,res,next) {
  Infostamp.updateOne(
    {_id: req.body.iid},
    { $pull: {likedUsers: req.body.uid} })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      next(err);
    });
  User.updateOne(
    {_id: req.body.uid},
    { $pull: {likedInfostamps: req.body.iid} })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      next(err);
    })
})

router.patch('/dislike', function(req,res,next) {
  Infostamp.updateOne(
    {_id: req.body.iid},
    { $push: {dislikedUsers: req.body.uid} })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      next(err);
    });
  User.updateOne(
    {_id: req.body.uid},
    { $push: {dislikedInfostamps: req.body.iid} })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      next(err);
    })
})

router.patch('/dislike/cancel', function(req,res,next) {
  Infostamp.updateOne(
    {_id: req.body.iid},
    { $pull: {dislikedUsers: req.body.uid} })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      next(err);
    });
  User.updateOne(
    {_id: req.body.uid},
    { $pull: {dislikedInfostamps: req.body.iid} })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      next(err);
    })
})

module.exports = router;