const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const privateKey = fs.readFileSync('./private.key', 'utf8');

const database = require('../index');

module.exports = (req, res) => {
  database.db().collection('users').findOne({
    $or: [{ email: req.body.email }, { username: req.body.username }],
  })
    .then((user) => {
      if (bcrypt.compareSync(req.body.password, user.password) === true) {
        const token = jwt.sign(
          { username: user.username, email: user.email },
          privateKey,
          { expiresIn: '4h', algorithm: 'RS256' },
        );
        return res.json({
          message: 'Login successful.', token, username: user.username,
        })
          .then(() => res.sendStatus(201));
      }
      return res.sendStatus(400);
    })
    .catch(() => res.sendStatus(500));
};
