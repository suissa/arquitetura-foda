const Model = function(ModelDB) {

  return {
    create: function(data, callback) {
      ModelDB.save(data, callback);
    }
  , retrieve: function(data, callback) {
      ModelDB.find(data.query, callback);
    }
  , update: function(data, callback) {
      ModelDB.update(data.query, data.mod, callback);
    }
  , delete: function(data, callback) {
      ModelDB.remove(data.query, callback);
    }
  };
}

module.exports = Model;