// model.mongoose.js
const Model = function(DB, schema) {
  const dados = req.body;

  const model = new Model(dados);
  model.save(function (err, data) {
    if (err){
      console.log('Erro: ', err);
      msg = 'Erro: ' + err;
    }
    else{
      console.log('Cerveja Inserida', data);
      msg = data;
    }
    res.json(msg);
  });
};
module.exports = Action;
