const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const manageRouter = require('./routes/manage')

const app = express();
const swig = require('swig');

// view engine setup
app.engine('html', swig.renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
swig.setDefaults({
  cache: false
})

swig.setFilter('active0', function (input) {
  if (input === '/' || input.toLocaleLowerCase().indexOf('/news')!==-1) {
    return 'active'
  } else {
    return ''
  }
});
swig.setFilter('active1', function (input) {
  if (input.toLocaleLowerCase().indexOf('/about')!==-1) {
    return 'active'
  } else {
    return ''
  }
});
swig.setFilter('active2', function (input) {
  if (input.toLocaleLowerCase().indexOf('/class')!==-1) {
    return 'active'
  } else {
    return ''
  }
});
swig.setFilter('active3', function (input) {
  if (input.toLocaleLowerCase().indexOf('/solution')!==-1) {
    return 'active'
  } else {
    return ''
  }
});
swig.setFilter('active4', function (input) {
  if (input.toLocaleLowerCase().indexOf('/market')!==-1) {
    return 'active'
  } else {
    return ''
  }
});
swig.setFilter('active5', function (input) {
  if (input.toLocaleLowerCase().indexOf('/service')!==-1) {
    return 'active'
  } else {
    return ''
  }
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/manage', manageRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;