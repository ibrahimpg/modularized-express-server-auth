/* eslint-disable no-underscore-dangle */
const nodemailer = require('nodemailer');

const database = require('../index');

module.exports = (req, res) => {
  database.db().collection('users').findOne({
    $or: [{ email: req.body.email }, { username: req.body.username }],
  })
    .then((user) => {
      if (user !== null) {
        return nodemailer.createTransport({
          host: 'nanoca.sh', port: 465, secure: true, auth: { user: 'tester@nanoca.sh', pass: process.env.MAIL_PASSWORD },
        }).sendMail({
          from: '"Tester" <tester@nanoca.sh>',
          to: user.email,
          subject: 'Verify your email',
          html: `
            Please click on the link below in order to verify your email.
            ---    
            http://localhost:8888/verify/${user.username}/${user._id}
            `,
        })
          .then(() => res.sendStatus(201))
          .catch(err => console.log(err));
      }
      return res.sendStatus(400);
    })
    .catch(() => res.sendStatus(500));
};

// if the error in the catch statement would include finding null... if/else can be removed
