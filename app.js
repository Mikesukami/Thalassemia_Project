var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const db = require('./util/db.config'); // นำเข้า db.config
const verifyToken = require('./auth/verifyUser')

// set port
var port = 4000;

var app = express();
var cors = require('cors');

app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// ซิงโครไนซ์โมเดลกับฐานข้อมูล
db.sequelize.sync({ force: false }) // ตั้งค่าเป็น true เพื่อดรอปตารางที่มีอยู่แล้วและสร้างใหม่
  .then(() => {
    console.log('Database synchronized');
  })
  .catch(err => {
    console.error('Error synchronizing database:', err);
  });

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

// set port & run server
//kuy
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
