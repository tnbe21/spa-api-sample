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
console.log('set header');
  next();
});

app.get('/status', (req, res) => {
  res.send('alive');
});

app.get('/todo/find', (req, res) => {
  let db = {};
  async.angelFall([
    (next) => { mongoConnect(next); },
    (_db, next) => {
      db = _db;
      db.collection('todo').find({}).toArray(next);
    }
  ], (err, todos) => {
    if (err)
      return res.status(500).json(err);

    db.close();

    res.json(todos);
  });
});

app.post('/todo/save', (req, res) => {
  let db = {};
  async.angelFall([
    (next) => { mongoConnect(next); },
    (_db, next) => {
      db = _db;
      const todo = _.pick(req.params, ['_id', 'body']);
      db.collection('todo').update(todo, {w: 1}, next);
    }
  ], (err) => {
    if (err)
      return res.status(500).json(err);
    db.close();
    res.ok();
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}!`)
});
