import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import env from 'dotenv';
import User from '../models/user';

env.config();

class Valid {
  static email(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  static password(pass) {
    const re = /^[a-zA-Z0-9]+$/;
    return re.test(String(pass).toLowerCase());
  }
}

class Auth {
  static signup(req, res) {
    const user = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    };
    if (!user.username) {
      res.status(400).json({
        status: 'fail',
        message: 'missing username fields',
      });
    } else if (!user.email) {
      res.status(400).json({
        status: 'fail',
        message: 'missing email fields',
      });
    } else if (!user.password) {
      res.status(400).json({
        status: 'fail',
        message: 'missing password fields',
      });
    } else if (!Valid.email(user.email)) {
      res.status(400).json({
        status: 'fail',
        message: 'bad email format',
      });
    } else if (!Valid.password(user.password)) {
      res.status(400).json({
        status: 'fail',
        message: 'bad password (use letters and numbers)',
      });
    } else {
      User.findUserByEmail(user.email)
        .then((result) => {
          if (result.rowCount >= 1) {
            res.status(400).json({
              status: 'fail',
              message: 'Email is already registered',
            });
          } else {
            User.findUserByUsername(user.username)
              .then((usernameResp) => {
                if (usernameResp.rowCount >= 1) {
                  res.status(400).json({
                    status: 'fail',
                    message: 'username already taken',
                  });
                } else {
                  const hashedPassword = bcrypt.hashSync(user.password, 8);

                  const newUser = {
                    firstName: user.firstname,
                    lastName: user.lastname,
                    username: user.username,
                    email: user.email,
                    password: hashedPassword,
                    dateCreated: new Date().toISOString(),
                  };
                  User.create(newUser)
                    .then(() => {
                      res.status(201).json({
                        status: 'success',
                        message: 'account created',
                        user: {
                          firstname: newUser.firstname,
                          lastname: newUser.lastname,
                          username: newUser.username,
                          email: newUser.email,
                        },
                      });
                    })
                    .catch(() => {
                      res.status(500).json({
                        status: 'error',
                        message: 'account creation failed. server error',
                      });
                    });
                }
              });
          }
        })
        .catch(() => {
          res.status(500).json({
            error: 'server error',
          });
        });
    }
  }

  // logs user in
  static login(req, res) {
    const user = {
      email: req.body.email,
      password: req.body.password,
    };

    if (!user.email || !user.password) {
      res.status(400).json({
        status: 'fail',
        message: 'supply email and password!',
      });
    } else if (!Valid.email(user.email)) {
      res.status(400).json({
        status: 'fail',
        message: 'bad email format',
      });
    } else if (!Valid.password(user.password)) {
      res.status(400).json({
        status: 'fail',
        message: 'bad password (use letters and numbers)',
      });
    } else {
      // query user model
      User.findUserByEmail(user.email)
        .then((result) => {
          if (result.rowCount < 1) {
            res.status(404).json({
              status: 'fail',
              message: 'Authentication Failed! wrong email or password',
            });
          } else {
            // validate credential
            const comparePassword = bcrypt.compareSync(user.password, result.rows[0].password);
            if (!comparePassword) {
              // invalid credential
              res.status(401).json({
                status: 'fail',
                message: 'Authentication Failed! wrong email or password',
              });
            } else {
              // valid credentials
              const profile = {
                userId: result.rows[0].userid,
                username: result.rows[0].username,
              };
              jwt.sign({ profile }, process.env.JWT_SECRET_TOKEN, { expiresIn: '24h' },
                (error, token) => {
                  if (error) {
                    res.status(522).json({
                      status: 'Error',
                      message: 'Server Authentication Failed!',
                    });
                  } else {
                    res.status(200).json({
                      status: 'success',
                      message: 'login successful',
                      token,
                    });
                  }
                });
            }
          }
        })
        .catch(() => {
          res.status(500).json({
            status: 'error',
            message: 'server Error ',
          });
        });
    }
  }
}

export default Auth;
