const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const database = require('../index');

module.exports = (req, res) => {
  database.db().collection('users').findOne({ username: req.params.username })
    .then((user) => {
      if (user !== null && user._id === req.params.id) {
        
        .then(() => res.sendStatus(201));
      }
    }
      return res.sendStatus(400);
    })
    .catch(() => res.sendStatus(500));
};
