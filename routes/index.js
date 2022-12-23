var router = require('express').Router();
const { user } = require("../middleware");
const { requiresAuth } = require('express-openid-connect');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

var logDate;
var logUser;
var logToday = 0;
var logUser = 0;
var arrUser;

async function getLog(userid) {
  const res1 = await user.getLog(userid);
  return res1;
}

async function getByEmail(email) {
  const res2 = await user.getByEmail(email);
  return res2;
}

async function insertNew(newUser) {
  const res3 = await user.insertNew(newUser);
  return res3;
}

async function insertLog(newLog) {
  const res4 = await user.insertLog(newLog);
  return res4;
}

async function checkToken(id, token) {
  const res5 = await user.checkToken(id, token);
  return res5;
}

async function getLogDash() {
  const res6 = await user.getLogDash();
  return res6;
}

async function getLogUser() {
  const res7 = await user.getLogUser();
  return res7;
}

async function verifyUser(email) {
  const res3 = await user.verifyUser(email);
  return res3;
}

router.get('/', function (req, res, next) {
  if(req.oidc.isAuthenticated()){
    getByEmail(req.oidc.user.email).then(result => {
      if(result=="empty"){
        const user = {username: req.oidc.user.nickname, fullname: req.oidc.user.name,
          email: req.oidc.user.email, verified: req.oidc.user.email_verified || false};
        insertNew(user).then(inUsr => {
          getByEmail(req.oidc.user.email).then(result1 => {
            checkToken(result1[0].id, req.oidc.idToken).then(tokens => {
              res.render('index', {title: 'Nodejs User Handling', isAuthenticated: req.oidc.isAuthenticated(), dataRes: result1});
            })
          })
        })
      }else{
        checkToken(result[0].id, req.oidc.idToken).then(tokens => {
          res.render('index', {title: 'Nodejs User Handling', isAuthenticated: req.oidc.isAuthenticated(), dataRes: result});
        })
      }
    })
  }else{
    res.render('index', {title: 'Nodejs User Handling', isAuthenticated: req.oidc.isAuthenticated()});
  }
});

router.get('/profile', requiresAuth(), function (req, res, next) {
  getByEmail(req.oidc.user.email).then(result => {
    if(result[0].verified){
      getLog(result[0].id).then(reslog => {
        logDate = [];
        for (let i = 0; i < reslog.length; i++) {
          logDate.push(reslog[i].datetime);
        }
        res.render('profile', {title: 'Nodejs User Handling', isAuthenticated: req.oidc.isAuthenticated(), 
          userProfile: req.oidc.user, dbData: result, dbLog: logDate});
      })
    }else{
      res.redirect('/');
    }
  });
});

router.get('/dashboard', requiresAuth(), function (req, res, next) {
  getLogDash().then(logdash => {
    getLogUser().then(loguser => {
      var dt = new Date();
      logToday = 0;
      arrUser = [];
      for (let i = 0; i < logdash.length; i++) {
        const arr = logdash[i].datetime.split(' ');
        if(arr[0] == dt.toISOString().slice(0,10)) {
          logToday++;
          arrUser.push(logdash[i].userid);
          //if(i > 0 && (logdash[i].userid != logdash[i-1].userid)) logUser++;
        }
        if(i == logdash.length-1){
          logUser = countUnique(arrUser);
        }
      }
      res.render('dashboard', {title: 'Nodejs User Handling', isAuthenticated: req.oidc.isAuthenticated(), 
        userProfile: req.oidc.user, dbUser: loguser, logToday: logToday, logUser: logUser});
    });
  });
});

router.get('/verify', requiresAuth(), function(req, res, next) {
  getByEmail(req.oidc.user.email).then(result => {
    if(!result[0].verified){
      const msg = {
        to: req.oidc.user.email,
        from: 'contact@benareli.com', // Use the email address or domain you verified above
        subject: 'Verify your account on NodeJS User Handling Exam',
        html: 'Please verify your email to use NodeJS User Handling Feature by clicking ' + 
          '<a href="http://localhost:3000/ver?email='+req.oidc.user.email+'">this link</a>',
      };
      sgMail.send(msg).then(() => {
        res.redirect('/');
      }).catch((error) => {console.error(error)})
    }
  })
})

router.get('/ver', requiresAuth(), function(req, res, next) {
  if(req.query.email){
    verifyUser(req.query.email).then(result => {
      if(result=="done"){
        const msg = {
          to: req.query.email,
          from: 'contact@benareli.com', // Use the email address or domain you verified above
          subject: 'Account Verified on NodeJS User Handling',
          html: 'Account is verified. You can use full feature on NodeJS User Handling now.',
        }
        sgMail.send(msg).then(() => {
          res.redirect('/');
        }).catch((error) => {console.error(error)})
      }
    })
  }else{
    res.redirect('/');
  }
})

function countUnique(iterable) {
  return new Set(iterable).size;
}

module.exports = router;
