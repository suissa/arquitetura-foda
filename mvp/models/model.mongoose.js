// model.mongoose.js
const Action = function(Model) {
  const callbackJSON = function(req, res) {
    res.json(data);
  };
  return {
    create: function(req, res) {
      const data = req.body;
      Model.create(data, callbackJSON);
    }
  }
};
module.exports = Action;
