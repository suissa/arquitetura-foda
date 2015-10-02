// model.mongoose.js
const MODEL = function(schemaMongoose){
  const mongoose = require('mongoose');
  const ModelMongoose = mongoose.model('Beer', schemaMongoose);
  return require('./model')(ModelMongoose);
}


module.exports = MODEL;
