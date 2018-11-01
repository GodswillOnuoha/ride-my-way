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
        error: 'username',
        message: 'missing username fields',
      });
    } else if (!user.email) {
      res.status(400).json({
        status: 'fail',
        error: 'email',
        message: 'missing email fields',
      });
    } else if (!user.password) {
      res.status(400).json({
        status: 'fail',
        error: 'password',
        message: 'missing password fields',
      });
    } else if (!Valid.email(user.email)) {
      res.status(400).json({
        status: 'fail',
        error: 'email',
        message: 'bad email format',
      });
    } else if (!Valid.password(user.password)) {
      res.status(400).json({
        status: 'fail',
        error: 'password',
        message: 'bad password (use letters and numbers)',
      });
    } else {
      User.findUserByEmail(user.email)
        .then((result) => {
          if (result.rowCount >= 1) {
            res.status(400).json({
              status: 'fail',
              error: 'email',
              message: 'Email is already registered',
            });
          } else {
            User.findUserByUsername(user.username)
              .then((usernameResp) => {
                if (usernameResp.rowCount >= 1) {
                  res.status(400).json({
                    status: 'fail',
                    error: 'username',
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
                      User.findUserByEmail(user.email)
                        .then((result) => {
                          const userid = result.rows[0].userid
                          const rUsername = result.rows[0].username
                          const profile = {
                            userId: userid,
                            username: rUsername,
                          };
                          res.status(201).json({
                            status: 'success',
                            message: 'account created',
                            user: {
                              id: userid,
                              firstname: newUser.firstname,
                              lastname: newUser.lastname,
                              username: newUser.username,
                              email: newUser.email,
                              token: jwt.sign({ profile }, process.env.JWT_SECRET_TOKEN, { expiresIn: '24h' })
                            }
                          });
                        })
                    })
                    .catch(() => {
                      res.status(500).json({
                        status: 'fail',
                        error: 'server',
                        message: 'account creation failed. server error',
                      });
                    });
                }
              });
          }
        })
        .catch(() => {
          res.status(500).json({
            status: 'fail',
            error: 'server',
            message: 'server error',
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
        error: 'email',
        message: 'supply email and password!',
      });
    } else if (!Valid.email(user.email)) {
      res.status(400).json({
        status: 'fail',
        error: 'email',
        message: 'bad email format',
      });
    } else if (!Valid.password(user.password)) {
      res.status(400).json({
        status: 'fail',
        error: 'password',
        message: 'bad password (use letters and numbers)',
      });
    } else {
      // query user model
      User.findUserByEmail(user.email)
        .then((result) => {
          if (result.rowCount < 1) {
            res.status(404).json({
              status: 'fail',
              error: 'email',
              message: 'Authentication Failed! wrong email or password',
            });
          } else {
            // validate credential
            const comparePassword = bcrypt.compareSync(user.password, result.rows[0].password);
            if (!comparePassword) {
              // invalid credential
              res.status(401).json({
                status: 'fail',
                error: 'email',
                message: 'Authentication Failed! wrong email or password',
              });
            } else {
              // valid credentials
              const { userid, username, email, firstname, lastname } = result.rows[0]
              const profile = {
                userId: userid,
                username: username,
              };
              jwt.sign({ profile }, process.env.JWT_SECRET_TOKEN, { expiresIn: '24h' },
                (error, token) => {
                  if (error) {
                    res.status(522).json({
                      status: 'fail',
                      error: 'server',
                      message: 'Server Authentication Failed!',
                    });
                  } else {
                    res.status(200).json({
                      status: 'success',
                      message: 'login successful',
                      user: {
                        id: userid,
                        firstname,
                        lastname,
                        username,
                        email,
                        token
                      }
                    });
                  }
                });
            }
          }
        })
        .catch(() => {
          res.status(500).json({
            status: 'fail',
            error: 'server',
            message: 'server Error ',
          });
        });
    }
  }
}

export default Auth;
