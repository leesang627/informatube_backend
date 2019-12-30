var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var session = require('express-session');
const passport = require('passport');

const passportConfig = require('./passport');
var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var infostampsRouter = require('./routes/infostamps');
var infostampRouter = require('./routes/infostamp');
var connect = require('./schemas');

var app = express();
connect();
passportConfig();

app.use(logger('dev'));
app.use(express.json({limit: '5mb'}));
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(cookieParser('Woogler'));
app.use(session({
  secret: 'Woogler',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
  },
  name: 'logincookie',
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/infostamps', infostampsRouter);
app.use('/infostamp', infostampRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
});

module.exports = app;
