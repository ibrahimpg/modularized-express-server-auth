const jwt = require('jsonwebtoken');
const fs = require('fs');

const publicKey = fs.readFileSync('./public.key', 'utf8');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'], maxAge: '4h' });
    req.tokenData = decoded;
    next();
  } catch (err) {
    res.json('Authentication Failed.');
  }
};
