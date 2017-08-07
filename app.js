const _ = require('lodash');
const express = require('express');
const async = require('neo-async');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const MONGO_URL = 'mongodb://localhost:27017/todo';

const mongoConnect = (callback) => {
  MongoClient.connect(MONGO_URL, callback);
};

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://52.193.135.71');
  next();
});

app.get('/status', (req, res) => {
  res.send('alive');
});

app.get('/todo/find', (req, res) => {
  async.angelFall([
    mongoConnect,
    (db, next) => {
      db.collection('todo').find({}, next);
    }
  ], (err, todos) => {
    if (err)
      return res.status(500).json(err);
    res.json(todos);
  });
});

app.post('/todo/save', (req, res) => {
  async.angelFall([
    mongoConnect,
    (db, next) => {
      const todo = _.pick(req.params, ['_id', 'body']);
      db.collection('todo').update(todo, {w: 1}, next);
    }
  ], (err) => {
    if (err)
      return res.status(500).json(err);
    res.ok();
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}!`)
});
