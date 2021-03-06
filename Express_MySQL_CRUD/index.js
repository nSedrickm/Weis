const path = require('path');
const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'raider',
  password: 'raider_dev',
  database: '__DEKU__'
});

connection.connect((err) => {
  if (err) {
    throw (err);
  }
  console.log('Connected')
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//route for homepage
app.get('/', (req, res) => {
  res.render('home', {
    title: "Dashboard - Home"
  });
});
//route for sms logs
app.get('/sms-logs', (req, res) => {
  let sql = "SELECT * FROM MODEM_SMS_RECEIVED";
  let query = connection.query(sql, (err, data) => {
    if (err) {
      res.render('error');
      throw err;
    }

    res.render('sms-logs', {
      data: data,
      title: "message logs"
    });
  });
});
// route for threads
app.post('/thread', function (req, res, next) {
  let phone_number = req.body.phone_number;
  let sql = "SELECT * FROM MODEM_SMS_RECEIVED WHERE PHONENUMBER = " + phone_number;
  let query = connection.query(sql, (err, data) => {
    if (err) {
      res.render('error');
      throw err;
    }
    res.render('message-thread', {
      data: data,
      title: "Thread " + phone_number
    });

  })
});

app.listen(8001, () => {
  console.log('Server is running at port 8001');
});