const database = require('../index');

module.exports = (req, res) => {
  database.db().collection('users').findOne({ username: req.params.username })
    .then((user) => {
      // eslint-disable-next-line no-underscore-dangle
      if (user !== null && user._id === req.params.randomId) {
        return database.db().collection('users').updateOne(
          { username: req.params.username },
          { $set: { verified: true } },
        )
          .then(() => res.status(201).json('Thank bruv'))
          .catch(err => console.log(err));
      }
      return res.sendStatus(400);
    })
    .catch(() => res.sendStatus(500));
};
