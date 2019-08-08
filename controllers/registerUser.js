const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const database = require('../index');

module.exports = (req, res) => {
  const randomString = crypto.randomBytes(8).toString('hex');
  database.db().collection('users').find({
    $or: [{ email: req.body.email }, { username: req.body.username }],
  }).toArray()
    .then((users) => {
      if (users.length === 0
        && /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(req.body.email) === true
        && /^[a-z][a-z0-9]+$/.test(req.body.username) === true && (req.body.username).length >= 6
        && (/\d/).test(req.body.password) === true && (req.body.password).length >= 6) {
        return database.db().collection('users').insertOne({
          email: req.body.email,
          username: req.body.username,
          password: bcrypt.hashSync(req.body.password, 10),
          _id: randomString, // send w/ nodemailer to reg. email, can be used in verification string
          verified: false, // if verificationString = _id, set verified to true
        })
          .then(() => {
            nodemailer.createTransport({
              host: process.env.EMAIL_HOST,
              port: 26,
              secure: false,
              tls: { rejectUnauthorized: false },
              pool: true,
              auth: { user: process.env.EMAIL_ADDRESS, pass: process.env.EMAIL_PASSWORD },
            }).sendMail({
              from: process.env.EMAIL_ADDRESS,
              to: req.body.email,
              subject: 'Automatic reply from Ibrahim P.G.',
              html: `
        ${req.body.name},
        Please click on the link below in order to verify your email.
        ---    
        ${process.env.SERVER_URL}/user/verify/${randomString}
        `,
            });
          })
          .then(() => res.sendStatus(201));
      }
      return res.sendStatus(400);
    })
    .catch(() => res.sendStatus(500));
};
