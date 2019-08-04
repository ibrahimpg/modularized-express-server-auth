const database = require('../index');

module.exports = (req, res) => {
  database.db().collection('users').findOne({
    $or: [{ email: req.body.email }, { username: req.body.username }],
  })
    .then((user) => {
      if (user !== null) {
        // send user._id based verification link to user.email with nodemailer
        .then(() => res.sendStatus(201));
      }
      return res.sendStatus(400);
    })
    .catch(() => res.sendStatus(500));
};
