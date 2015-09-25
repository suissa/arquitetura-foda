// schema.beer.js
const Skeleton = require('./skeleton.beer');
const Schema = require('./schema.mongoose.factory')(Skeleton);
console.log(Schema);
module.exports = Schema;