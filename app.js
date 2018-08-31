var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('hbs');
var fs = require('fs');
var ifCondHelper = require('./views/helpers/if-cond')
var paginationHelper = require('./views/helpers/pagination')

var userpageRouter = require('./routes/userpage');
var usersRouter = require('./routes/users');
var signinRouter = require('./routes/sign-in');
var jumboRouter = require('./routes/jumbo');
var regRouter = require('./routes/register');
var signoutRouter = require('./routes/signout');
var usersSearchRouter = require('./routes/usersSearch');


var app = express();
var connect = require('./database/index').connectToDb;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
var partialsDir = __dirname + '/views/partials';
var filenames = fs.readdirSync(partialsDir);

filenames.forEach(function (filename) {
  var matches = /^([^.]+).hbs$/.exec(filename);
  if (!matches) {
    return;
  }
  var name = matches[1];
  var template = fs.readFileSync(partialsDir + '/' + filename, 'utf8');
  return hbs.registerPartial(name, template);
});

    
hbs.registerHelper('ifCond', ifCondHelper);
hbs.registerHelper('pagination', paginationHelper);


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

connect();

app.use('/', jumboRouter);
app.use('/users', usersRouter);
app.use('/signin', signinRouter);
app.use('/jumbo', jumboRouter);
app.use('/register',regRouter);
app.use('/signout',signoutRouter);
app.use('/users/userpage/', userpageRouter);
app.use('/users/search', usersSearchRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
