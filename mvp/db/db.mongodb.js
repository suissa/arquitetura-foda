const DB_CONFIG = require('./db.mongodb.config');
const DB_URL = DB_CONFIG.host + DB_CONFIG.database

const mongoose = require('mongoose');
mongoose.connect(DB_URL);

const db = mongoose.connection;
const Connection = require('./connection.default')(db);

Connection
  .on('error', Connection.callbacks.error)
  .on('connected', Connection.callbacks.connected)
  .on('disconnected', Connection.callbacks.disconnected);

module.exports = db;