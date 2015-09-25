// route.default.js
const Route = function(Action, RouteConfig) {
const ACTION = RouteConfig.action;
const METHOD = RouteConfig.method;
const URL = RouteConfig.url;
const CALLBACK = function(req, res) {
    var data = req.body;
    Action.ACTION(req, res);
}
  return {
      action: ACTION
    , method: METHOD
    , url: URL
    , callback: CALLBACK
  };
}
module.exports = Route;