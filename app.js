/**
|--------------------------------------------------------------------------
| Local Library App
|--------------------------------------------------------------------------
|
| Notes:
|
*/


/**
|--------------------------------------------------------------------------
| Module dependencies
|--------------------------------------------------------------------------
*/

const express              =  require('express');

const appRoot              =  require('app-root-path');
const chalk                =  require('chalk');
const compression          =  require('compression');
const cookieParser         =  require('cookie-parser');
const createError          =  require('http-errors');
const dotenv               =  require('dotenv');
const expressStatusMonitor =  require('express-status-monitor');
const fs                   =  require('fs');
const helper               =  require(appRoot + '/lib/helper.js');
const moment               =  require('moment');
const mongoose             =  require('mongoose');
const morgan               =  require('morgan');
const path                 =  require('path');
const util                 =  require('util');
const winston              =  require(appRoot + '/config/winston');



/**
|--------------------------------------------------------------------------
| Load environment variables from .env
|--------------------------------------------------------------------------
*/

dotenv.config({ path: '.env' });



/**
|--------------------------------------------------------------------------
| Controllers (route handlers)
|--------------------------------------------------------------------------
*/

const catalogRouter    =  require('./routes/catalog');
const indexRouter      =  require('./routes/index');
const usersRouter      =  require('./routes/users');



/**
|--------------------------------------------------------------------------
| Create Express server
|--------------------------------------------------------------------------
*/

var app = express();



/**
|--------------------------------------------------------------------------
| Set up mongoose connection
|--------------------------------------------------------------------------
*/

mongoose.connect(process.env.MONGO_URI, {
  useFindAndModify: false,
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(()=>{
  console.log('%s Connection to database established', chalk.green('✓'))
}).catch(err=>{
  // console.log(`db error ${err.message}`);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit(-1)
});



/**
|--------------------------------------------------------------------------
| View engine setup
|--------------------------------------------------------------------------
*/

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');



/**
|--------------------------------------------------------------------------
| Middleware setup
|--------------------------------------------------------------------------
*/

// Folders for static content
app.use(express.static(path.join(__dirname, 'public')));

// Parser for JSON contents using bodyParser
app.use(express.json());

// Recognize incoming Request Object as strings or arrays
app.use(express.urlencoded({ extended: false }));

// Parse Cookie header and populate req.cookies with object keyed by cookie names
app.use(cookieParser());

// Report real time server metrics for Express-based node servers.
app.use(expressStatusMonitor());

// Node.js compression middleware | supported compression codings: deflate | gzip
app.use(compression());



/**
|--------------------------------------------------------------------------
| HTTP request logger setup: morgan to winston
|--------------------------------------------------------------------------
*/

app.use(morgan('dev', { stream: winston.stream }));           // broke morgan once
// app.use(morgan('combined', { "stream": winston.stream.write})); // fixed problem once



/**
|--------------------------------------------------------------------------
| Primary app routes
|--------------------------------------------------------------------------
|
*/

app.use('/', indexRouter);
app.use('/catalog', catalogRouter); 
app.use('/users', usersRouter);



/**
|--------------------------------------------------------------------------
| Catch 404 and forward to error handler
|--------------------------------------------------------------------------
*/

// Catch 404
app.use(function(req, res, next) {
  next(createError(404));
});


// Error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // include winston logging
  winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
