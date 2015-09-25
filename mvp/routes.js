const ACTIONS_FOLDER = './actions/';
const ROUTES_FOLDER = './routes/';

const Action = require(ACTIONS_FOLDER + 'action.create.js');
const RouteConfig = require(ROUTES_FOLDER + 'route.create.config');
const RouteCreate = require(ROUTES_FOLDER + 'route.default.js')(Action, RouteConfig);

console.log(RouteCreate.action);