const express = require('express');
const http = require('http');
const path = require('path');
const router = require('./routes/index');
const mysql = require('mysql');
const sql = require("./models/db.js");
const { auth } = require('express-openid-connect');
const sgMail = require('@sendgrid/mail');

const app = express();
const config = {
  authRequired: false,
  auth0Logout: true,
  baseURL: 'http://localhost:3000',
  clientID: 'YjOttdizFjGAcJ0hWfnfGsBhMnbbcgUt',
  issuerBaseURL: 'https://dev-a0b3azkh.us.auth0.com',
  secret: 'UwcPIwmeLUTyhZl4nj_Mm5rE7Kkwn52k7j5vVeq_Kt6csZC9_FxwykewkwVxoRiR'
};

sql.query(`CREATE TABLE IF NOT EXISTS userprofile (id INT NOT NULL AUTO_INCREMENT, 
  username TEXT, fullname TEXT, email TEXT, origin CHAR, verified BOOLEAN, PRIMARY KEY (id));`, (err, res) => {
  if (err) console.error(err);
});

sql.query(`CREATE TABLE IF NOT EXISTS userlog (userid TEXT, datetime TEXT, token TEXT);`, (err, res) => {
  if (err) console.error(err);
});

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use(auth(config));

app.use(function (req, res, next) {
  res.locals.user = req.oidc.user;
  //console.log(res.locals.user);
  next();
});

app.use('/', router);

http.createServer(app).listen(3000, () => {
  console.log(`Listening on ${config.baseURL}`);
});