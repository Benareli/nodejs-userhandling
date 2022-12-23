//const User = require("../models/user.model.js");
const sql = require("../models/db.js");

function insertNew(newUser) {
  return new Promise((resolve, reject) => {
    sql.query("INSERT INTO userprofile SET ?", newUser, (err, res) => {
      if (err) {reject(err); return;}
      resolve("done");
  });
  })
}

function verifyUser(email) {
  return new Promise((resolve, reject) => {
    sql.query("UPDATE userprofile SET verified = true WHERE email = ?", email, (err, res) => {
      if (err) {reject(err); return;}
      resolve("done");
  });
  })
}

function checkToken(id, token) {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM userlog WHERE token = '${token}'`, (err, res) => {
      if(err) {reject(err); return;}
      if(res.length) {resolve("done");return;}
      else {
        var today = new Date();
        const newLog = {userid: id, token: token, datetime: today}
        sql.query("INSERT INTO userlog SET ?", newLog, (err, res) => {
          if(err) {reject(err); return;}
          if(res) {resolve("done"); return;}
        });
      }
    })
  })
}

function getLog(userid) {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM userlog WHERE userid = '${userid}'`, (err, res) => {
      if(err) {reject(err); return;}
      if (res.length) {
        resolve(res);
        return;
      }
      resolve({ kind: "not_found" });
    });
  })
};

function getLogDash() {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM userlog ORDER BY userid ASC`, (err, res) => {
      if(err) {reject(err); return;}
      if (res.length) {
        resolve(res);
        return;
      }
      resolve({ kind: "not_found" });
    })
  })
};

function getLogUser() {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT COUNT(userid) FROM userlog`, (err, res) => {
      if(err) {reject(err); return;}
      if (res.length) {
        resolve(res);
        return;
      }
      resolve({ kind: "not_found" });
    })
  })
}

function getLogToday() {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT COUNT(userid) FROM userlog `, (err, res) => {
      if(err) {reject(err); return;}
      if (res.length) {
        resolve(res);
        return;
      }
      resolve({ kind: "not_found" });
    })
  })
}

function getByEmail(email) {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM userprofile WHERE email = '${email}'`, (err, res) => {
      if(err) {reject(err); return;}
      if (res.length) {
        resolve(res);
        return;
      }
      resolve("empty");
    });
  })
};

const user = {
  insertNew,
  verifyUser,
  checkToken,
  getLog,
  getLogDash,
  getLogUser,
  getByEmail,
};
module.exports = user;
