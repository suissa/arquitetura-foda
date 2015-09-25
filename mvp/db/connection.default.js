const Connection = function(db) {
  
  return {
    callbacks: {
      error: function(err){
        return console.log('Erro de conexao.', err);
      }
    , connected: function(err){
        return console.log('Conectado');
      }
    , disconnected: function(err){
        return console.log('Desconectado');
      }
    }
  , on: function(event, callback) {
      db.on(event, callback);
      return db;
    }
  };
};

module.exports = Connection;