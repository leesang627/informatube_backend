const passport = require('passport');
const User = require('../schemas/user');
const local = require('./local');

module.exports = () => {
  passport.serializeUser((user, done) => {
    console.log('serialized');
    return done(null, user._id);
  });

  passport.deserializeUser(async (_id, done) => {
    try {
      const user = await User.findOne({
        _id: _id,
      });
      return done(null, user); // req.user
    } catch (e) {
      console.error(e);
      return done(e);
    }
  });

  local();
};