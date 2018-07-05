import log from 'fancy-log';
import bcrypt from 'bcrypt';
import env from 'dotenv';
import userModel from '../models/user';

env.config();

class userAuth {
  static signup(req, res) {
    const {
      firstname, lastname, username, email, password,
    } = req.body;

    userModel.findUserByEmail(email)
      .then((result) => {
        if (result.rowCount >= 1) {
          res.status(400).json({
            error: 'Email is already registered',
          });
        } else {
          log(password);
          const hashedPassword = bcrypt.hashSync(password, 8);

          const newUser = {
            firstName: firstname,
            lastName: lastname,
            username,
            email,
            password: hashedPassword,
            dateCreated: new Date().toISOString(),
          };

          userModel.create(newUser)
            .then((dbRes) => {
              log(dbRes);
              res.status(201).json({
                message: 'success',
                user: newUser,
              });
            })
            .catch((dbError) => {
              log.error(dbError);
              res.status(500).json({
                error: 'account creation failed.',
              });
            });
        }
      })
      .catch((emailError) => {
        log.error(emailError);
        res.status(500).json({
          error: 'error',
        });
      });
  }
}

export default userAuth;
