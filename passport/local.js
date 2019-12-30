const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const User = require('../schemas/user');

module.exports = () => {
  passport.use(new LocalStrategy({
    usernameField: 'name',
    passwordField: 'password',
  }, async (name, password, done) => {
    try {
      const user = await User.findOne({name: name});
      if(!user) {
        const newUser = new User({
          name: name,
          likedInfostamps: [],
          unlikedInfostamps: [],
        })
        newUser.save()
          .then((result) => {
            console.log(result);
            return done(null, result, {reason: '기존 유저가 없으므로 새로운 유저로 등록되었습니다.'})
          })
          .catch((e) => {
            console.error(err);
            return done(e);
          })
      }
      return done(null, user, {reason: '기존 유저로 로그인 되었습니다.'});
    } catch(e) {
      console.error(e);
      return done(e);
    }
  }))
}