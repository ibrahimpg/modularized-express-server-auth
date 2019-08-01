const express = require('express');

const app = express();

require('dotenv').config();

const { MongoClient } = require('mongodb');

// Database Connection and Variable Export

let db;

MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then((cluster) => { db = cluster.db('database'); })
  .then(() => app.listen(process.env.PORT || 8888))
  .catch(err => console.log(err));

exports.db = () => db;

// Route Logic

const loginUser = require('./controllers/login');

// The API Structure

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*' /* process.env.CLIENT_URL */);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
});

app.post('/login', loginUser);

// this error handling below needs testing. it doesn't seem to actually be useful.

app.use((req, res, next) => {
  const error = new Error('Route not available.');
  error.status = 404;
  next(error);
});

app.use((error, req, res) => {
  res.status(error.status || 500);
  res.json({ error: { message: error.message } });
});
