var createError = require('http-errors');
var express = require('express');
var expressLayouts=require('express-ejs-layouts');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
 var mongoose=require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var flash = require('connect-flash');
var session = require('express-session');
var passport=require('passport');

var app = express();
//passport to config
require('./config/passport')(passport);


//connect mongodb
const url = 'mongodb://localhost:27017/auth';



//connect mongoose
mongoose.connect(url,{useNewUrlParser:true , useUnifiedTopology: true })
.then((db)=>console.log("connected to db"))
.catch(err=>console.log(err));

// view engine setup
// app.set('view engine', 'jade');

//EJS  setup
console.log(__dirname);
app.use(expressLayouts);
//app.set('views', path.join(__dirname, 'views'));

app.set('view engine','ejs');

//bodyParser , to get data from form with req.body
app.use(express.urlencoded({ extended: false }));

//express session declare
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
     
  }));
//passport middlware
  app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash())

//global variables

app.use((req,res,next)=>{

    res.locals.success=req.flash('success_msg');
    
    res.locals.error=req.flash('error_msg');

    res.locals.error_msg=req.flash('error');
    next();
})
app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   //res.status(err.status || 500);
//   //res.render('error');
// });

module.exports = app;
