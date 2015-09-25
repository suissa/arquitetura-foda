// model.mongoose.js
const Mongoose = require('mongoose');
const skeleton = require('./../schemas/schema.beer');
const Schema = new mongoose.Schema(skeleton);
const ModelMongoose = mongoose.model('Beer', Schema);

Model = require('./model')(ModelMongoose);

module.exports = Model;
