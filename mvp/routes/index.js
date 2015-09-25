var Action = {
  create: function(req, res) {
    console.log('Action CREATE');
  }
}

var RouteCreate = require('./route.create.js')(Action);