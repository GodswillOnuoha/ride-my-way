import db from '../database/connection';

class User {
  static findUserByEmail(email) {
    const query = {
      text: 'SELECT * FROM users WHERE email = $1',
      values: [email],
    };
    const res = db.query(query);
    return res;
  }

  static findUserById(userId) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [userId],
    };
    const res = db.query(query);
    return res;
  }

  static findAllUsers() {
    const res = db.query('SELECT * FROM users');
    return res;
  }

  static create(user) {
    const query = {
      text: 'INSERT INTO users(firstName, lastName, username, email, password, datecreated) VALUES ($1, $2, $3, $4, $5, $6)',
      values: [user.firstName, user.lastName, user.username,
      user.email, user.password, user.datecreated],
    };
    const res = db.query(query);
    return res;
  }

  static findUserByUsername(username) {
    const query = {
      text: 'SELECT * FROM users WHERE username = $1',
      values: [username],
    };
    const res = db.query(query);
    return res;
  }
}

export default User;
