const sql = require("./db.js");

const User = function(user) {
  this.username = user.username;
  this.fullname = user.fullname;
  this.email = user.email;
  this.verified = user.verified;
  this.picture = user.picture;
};

User.create = (newUser, result) => {
  sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
    if (err) {
      console.error(err);
      result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...newTutorial });
  });
};

User.findById = (id, result) => {
  sql.query(`SELECT * FROM users WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.error(err);
      result(err, null);
      return;
    }

    if (res.length) {
      result(null, res[0]);
      return;
    }
    result({ kind: "not_found" }, null);
  });
};

User.getAll = (username, result) => {
  let query = "SELECT * FROM users";

  if (username) {
    query += ` WHERE username LIKE '%${username}%'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.error(err);
      result(null, err);
      return;
    }
    result(null, res);
  });
};

User.updateById = (id, user, result) => {
  sql.query(
    "UPDATE users SET username = ?, fullname = ?, WHERE id = ?",
    [user.username, user.fullname, id],
    (err, res) => {
      if (err) {
        console.error(err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }
      result(null, { id: id, ...tutorial });
    }
  );
};

User.remove = (id, result) => {
  sql.query("DELETE FROM users WHERE id = ?", id, (err, res) => {
    if (err) {
      console.error(err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    result(null, res);
  });
};

User.removeAll = result => {
  sql.query("DELETE FROM users", (err, res) => {
    if (err) {
      console.error(err);
      result(null, err);
      return;
    }
    result(null, res);
  });
};

module.exports = User;