# Atomic Design Universal

**Uma arquitetura que rode módulos híbridos como serviço (quem sabe usando Docker), escritos em diferentes linguagens e usando diferentes bancos, todos assíncronos e baseados em eventos ou REST.**

Um padrão para que as funções possam ser reusadas nos módulos, esses sendo assíncronos e com uma API REST e/ou Eventos.

**[Explicar essa merda melhor, caraleo]**

Criando um padrão de JSON usando as funções já criadas como módulos de JavaScript, futuramente se você quiser mudar de framework ou linguagem de programação bastaria pegar seu JSON de configuração do módulo e executar o gerador para aquela linguagem ou framework específicos. Criando um algoritmo de como os módulos de comunicam, qualquer dev pode gerar o código que bem entender, porém usará a mesma língua e não linguagem, o HTTP ou Eventos.

Criar um padrão de módulo composto por funções atômicas que possam ser reusadas nos módulos, esses sendo assíncronos e com uma API REST e/ou Eventos.

# Frontend
- Atomic Design Reativo
- StyleGuide Driven Development
- Frontend Driven Development
- Mobile-first
- Offline-first

# Backend
- API-first
- Functional Reactive Programming
- Event-driven
- Isomórfico
- RabbitMQ? ZeroMQ? [Troupe](https://github.com/rafakato/troupe)
- [UniversalValidator](https://github.com/Webschool-io/UniversalValidator)
- Service Workers?
- Docker
- [runtime.js](https://medium.com/@iefserge/runtime-js-javascript-library-os-823ada1cc3c)

# Banco de dados
- DALU: Data Access Layer Universal
  - Uma camada para acesso a bancos de dados, inicialmente para NoSQL onde todos os bancos terão a mesma API de CRUD, porém cada tipo de banco terá funcionalidades específicas, como:
    - Grafos: busca por nós
    - Cache: expiração de dados
    - etc.
Além disso ele receberia um JSON como um roteiro de onde colocar os dados, por exemplo:

> Insere o objeto no MongoDB

> Cria um objeto com _id e nome e insere no Neo4J

> Atualiza no Cache

# Arquitetura

## Módulos como Serviço

Cada módulo deve ser atômico e independente no nível da aplicação, pois seu funcionamento interno não importa para o sistema, a aplicação não deve conhecer de antemão seus módulos.

O módulo para funcionar como ums serviço precisa prover 2 APIs:

- REST
- Eventos

### REST

### Eventos

## Funções
Arquitetura baseada em funções atômicas e um módulo com um JSON de config que deve ser lido e gerado para a linguagem e framework que quiser.

Nessa arquitetura teremos umm sistema de mensagens que será nosso EventEmitter para todos, porém no Node.js podemos usar o `EventEmitter`.

Exemplo de JSON de rotas no Express mas que pode ser usado para gerar rotas no Angular ou qualquer outro.

```js
var express = require('express')
  , router = express.Router()
  , Controller = require('./../controller')
  , Routes = require('./../../routes')
  , EventController = require('event-controller')
  ;

var cbCreate = function(req, res) {
    var data = req.body;
    EventController.emit('MyModuleCreate', data);
  }
  , cbRetrieve = function(req, res) {
    EventController.emit('MyModuleRetrieve');
  }
  , cbGet = function(req, res) {
    var find = res.body.find;
    EventController.emit('MyModuleGet', find);
  }
  , cbUpdate = function(req, res) {
    var data = req.body;
    EventController.emit('MyModuleUpdate', data);
  }
  , cbDelete = function(req, res) {
    var find = res.body.find;
    EventController.emit('MyModulDelete', find);
  }
  ;

var routes = [{
      action: 'create'
    , method: 'post'
    , url: '/'
    , callback: cbCreate
    }
  , {
      action: 'retrieve'
    , method: 'get'
    , url: '/'
    , callback: cbRetrieve
  }
  , {
      action: 'get'
    , method: 'get'
    , url: '/:id'
    , callback: cbGet
  }
  , {
      action: 'update'
    , method: 'put'
    , url: '/:id'
    , callback: cbUpdate
  }
  , {
      action: 'delete'
    , method: 'delete'
    , url: '/:id'
    , callback: cbDelete
  }
];

Routes.createModuleRoutes(router, routes);

module.exports = router;

```

Agora refatorando para usar eventos.

```js
var express = require('express')
  , router = express.Router()
  , Controller = require('./../controller')
  , Routes = require('./../../routes')
  , EventController = require('event-controller')
  ;

var cbCreate = function(req, res) {
    var data = req.body;
    EventController.emit('MyModuleCreate', data);
    Controller.create(req, res);
  }
  , cbRetrieve = function(req, res) {
    EventController.emit('MyModuleRetrieve');
      Controller.retrieve(req, res);
  }
  , cbGet = function(req, res) {
    var find = res.body.find;
    EventController.emit('MyModuleGet', find);
      Controller.get(req, res);
  }
  , cbUpdate = function(req, res) {
    var data = req.body;
    EventController.emit('MyModuleUpdate', data);
      Controller.update(req, res);
  }
  , cbDelete = function(req, res) {
    var find = res.body.find;
    EventController.emit('MyModulDelete', find);
      Controller.remove(req, res);
  }
  ;

var routes = [{
      action: 'create'
    , method: 'post'
    , url: '/'
    , callback: cbCreate
    }
  , {
      action: 'retrieve'
    , method: 'get'
    , url: '/'
    , callback: cbRetrieve
  }
  , {
      action: 'get'
    , method: 'get'
    , url: '/:id'
    , callback: cbGet
  }
  , {
      action: 'update'
    , method: 'put'
    , url: '/:id'
    , callback: cbUpdate
  }
  , {
      action: 'delete'
    , method: 'delete'
    , url: '/:id'
    , callback: cbDelete
  }
];

Routes.createModuleRoutes(router, routes);

module.exports = router;
```

Analisando esse código percebemos um padrão para o *array* de rotas.

### Rotas - Padrão

```js
var routes = [{
      action: 'create'
    , method: 'post'
    , url: '/'
    , callback: cbCreate
    }
  , {
      action: 'retrieve'
    , method: 'get'
    , url: '/'
    , callback: cbRetrieve
  }
  , {
      action: 'get'
    , method: 'get'
    , url: '/:id'
    , callback: cbGet
  }
  , {
      action: 'update'
    , method: 'put'
    , url: '/:id'
    , callback: cbUpdate
  }
  , {
      action: 'delete'
    , method: 'delete'
    , url: '/:id'
    , callback: cbDelete
  }
];
```

Perceba que cada objeto da rota é:

```js
{
    action: 'create'
  , method: 'post'
  , url: '/'
  , callback: cbCreate
}

```

Ou seja:

```js
{
    ação
  , métodoHTTP
  , url
  , funçãoASerExecutada
}

```

Podemos então padronizar como:

```js
Route.action
Route.method
Route.url
Route.callback
```

Nesse caso criamos a rota como um átomo que possa ser reusada, podemos modularizá-la assim:

```js
// route.create.js
const ACTION = 'create';
const METHOD = 'post';
const URL = '/';
const CALLBACK = function(req, res) {
    var data = req.body;
    Controller.create(req, res);
}

var Route = {
    action: ACTION
  , method: METHOD
  , url: URL
  , callback: CALLBACK
};
module.exports = Route
```

Agra perceba que ainda temos a dependência do `Controller` nesse módulo, então se quisermos utilizar outro módulo externo, precisamos injetar ele na nossa rota.

```js
// route.create.js
var Route = function(Action) {
const ACTION = 'create';
const METHOD = 'post';
const URL = '/';
const CALLBACK = function(req, res) {
    var data = req.body;
    Action.create(req, res);
}
  return {
      action: ACTION
    , method: METHOD
    , url: URL
    , callback: CALLBACK
  };
}
module.exports = Route;
```

Estamos usando const para garantir que nossa rota seja um *"módulo puro"*, conceito de [Pure Functions](https://github.com/Webschool-io/workshop-js-funcional-free#pure-functions), nesse caso com esse padrão de rota para o `create` precisamos apenas importá-lo injetando o objeto `Action` que contém a função de *callback*.

Já podemos usar sussegadamente `let` e `const` com o Node v4.

> Extended ES6 support

> ECMA-262 is the latest version of the JavaScript language specification and – by building on a recent V8 version – Node.js 4.0.0 supports many new language features out of the box.
Here are some examples
Block scoping using let and const
Classes. Yes really, JavaScript now supports classes but they are just syntactic sugar built around the prototypical inheritance model of JavaScript. So if you are using CoffeeScript because you just can not live without having a ‘class’ keyword this new feature is for you.
Generators (function*, next and yield) It makes sense to get used to- and understand them. They will be heavily used in the future. koa.js, for instance, was built by the express folks and heavily depends on them.

fonte: [http://apmblog.dynatrace.com/2015/09/05/all-you-need-to-know-about-node-js-4-0/](http://apmblog.dynatrace.com/2015/09/05/all-you-need-to-know-about-node-js-4-0/)

Bom se já temos o padrão para a rota `create` agora ficou fácil para o resto do [CRUD]():

- Retrieve: lista todos

```js
// route.retrieve.js
var Route = function(Action) {
const ACTION = 'retrieve';
const METHOD = 'get';
const URL = '/';
const CALLBACK = function(req, res) {
    var data = req.body;
    Action.retrieve(req, res);
}
  return {
      action: ACTION
    , method: METHOD
    , url: URL
    , callback: CALLBACK
  };
}
module.exports = Route;
```

- Update: altera uma entidade apatir de um identificador único sendo a variável `:id` na rota:

```js
// route.update.js
var Route = function(Action) {
const ACTION = 'update';
const METHOD = 'put';
const URL = '/:id';
const CALLBACK = function(req, res) {
    var data = req.body;
    Action.update(req, res);
}
  return {
      action: ACTION
    , method: METHOD
    , url: URL
    , callback: CALLBACK
  };
}
module.exports = Route;
```

- Delete: deleta uma entidade apatir de um identificador único sendo a variável `:id` na rota:

```js
// route.delete.js
var Route = function(Action) {
const ACTION = 'delete';
const METHOD = 'delete';
const URL = '/:id';
const CALLBACK = function(req, res) {
    var data = req.body;
    Action.delete(req, res);
}
  return {
      action: ACTION
    , method: METHOD
    , url: URL
    , callback: CALLBACK
  };
}
module.exports = Route;
```

**Notou mais um padrão???**

Pois olhe bem a chamada da função do `Action`, o nome da função é sempre o valor da constante `ACTION`, então vamos refatorar para:

```js
// route.default.js
const Route = function(Action, RouteConfig) {
const ACTION = 'delete';
const METHOD = 'delete';
const URL = '/:id';
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
```

E nosso objeto de configuração de rota ficará assim:

```js
RouteConfig.action;
RouteConfig.method;
RouteConfig.url;
RouteConfig.callback;
};
module.exports = RouteConfig
```

Então eu posso fazer assim no meu módulo de Rotas:

```js
// route.create.config.js
const RouteConfig = {
    action: 'create'
  , method: 'post'
  , url: '/'
  , callback: ''
};
module.exports = RouteConfig;
```

Então para criar uma Rota de `create` usamos:

```js
const ACTIONS_FOLDER = './actions/';
const ROUTES_FOLDER = './routes/';

const Action = require(ACTIONS_FOLDER + 'action.create.js');
const RouteConfig = require(ROUTES_FOLDER + 'route.create.config');
const RouteCreate = require(ROUTES_FOLDER + 'route.default.js')(Action, RouteConfig);

console.log(RouteCreate.action);
```

Criando as outras rotas:

```js
const ACTIONS_FOLDER = './actions/';
const ROUTES_FOLDER = './routes/';

// Create
const Action = require(ACTIONS_FOLDER + 'action.create.js');
const RouteConfig = require(ROUTES_FOLDER + 'route.create.config');
const RouteCreate = require(ROUTES_FOLDER + 'route.default.js')(Action, RouteConfig);
// Retrieve
const Action = require(ACTIONS_FOLDER + 'action.retrieve.js');
const RouteConfig = require(ROUTES_FOLDER + 'route.retrieve.config');
const RouteCreate = require(ROUTES_FOLDER + 'route.default.js')(Action, RouteConfig);
// Update
const Action = require(ACTIONS_FOLDER + 'action.update.js');
const RouteConfig = require(ROUTES_FOLDER + 'route.update.config');
const RouteCreate = require(ROUTES_FOLDER + 'route.default.js')(Action, RouteConfig);
// Delete
const Action = require(ACTIONS_FOLDER + 'action.delete.js');
const RouteConfig = require(ROUTES_FOLDER + 'route.delete.config');
const RouteCreate = require(ROUTES_FOLDER + 'route.default.js')(Action, RouteConfig);
```

**Percebeu outro padrão?**

Então olhe essa refatoração!!!

# TO SEM aCENTO no a [arrumar acentos]

O módulo de rotas tera suas configurações também como a pasta de *actions* e *routes*, além das ações, ficando assim:

```js
// routes.js
const ACTIONS_FOLDER = './actions/';
const ROUTES_FOLDER = './routes/';
const ACTIONS = ['create', 'retrieve', 'update', 'delete'];
var Routes = [];

ACTIONS.forEach(function(action) {
  const Action = require(ACTIONS_FOLDER + 'action.'+ action +'.js');
  const Config = require(ROUTES_FOLDER + 'route.'+ action +'.config');
  const Route = require(ROUTES_FOLDER + 'route.default.js')(Action, Config);
  Routes.push(Route);
});
module.exports = Routes;
```

Nosso padrao de rota ficou assim:

```js
// route.default.js
const Route = function(Action, RouteConfig) {
  const ACTION = RouteConfig.action;
  const METHOD = RouteConfig.method;
  const URL = RouteConfig.url;
  const CALLBACK = function(req, res) {
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
```

E os arquivos de confirguraçao de cada rota ficou:

```js
// route.create.config.js
const RouteConfig = {
    action: 'create'
  , method: 'post'
  , url: '/'
  , callback: ''
};
module.exports = RouteConfig;

// route.retrieve.config.js
const RouteConfig = {
    action: 'retrieve'
  , method: 'get'
  , url: '/'
  , callback: ''
};
module.exports = RouteConfig;

// route.update.config.js
const RouteConfig = {
    action: 'update'
  , method: 'update'
  , url: '/:id'
  , callback: ''
};
module.exports = RouteConfig;

// route.delete.config.js
const RouteConfig = {
    action: 'delete'
  , method: 'delete'
  , url: '/:id'
  , callback: ''
};
module.exports = RouteConfig;
```

Nesse caso tenho um CRUD padronizado e simples de adicionar outra rota.

### Actions

Uma `Action` é um módulo independente que executara uma funçao, nesse caso iniciado pela requisiçao em uma rota.

Vamos continuar com o exemplo do Express:

```js
const Action = {
  create: function(req, res) {
    console.log('Action CREATE');
  }
}
module.exports = Action;
```

Vamos imaginar que iremos criar uma entidade com o `Mongoose`:

```js
const Action = function(Model) {
  return {
    create: function(req, res) {
      const data = req.body;
      Model.create(data, callback);
    }
  }
};
module.exports = Action;
```

Entao injetamos o `Model` e chamamos a funçao `create`, porém ela precisa de um callback, pois é essa `Action` que responsavel pela continuaçao dos dados no Sistema, ja que um `Model` nao pode ter essa responsabilidade, ele dera apenas fazer a interaçao com o Banco.

```js
// action.create.js
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
```

Porém o `callbackJSON` só sera chamado no `Model`, porém antes de usarmos um `Model` ele deve ser criado com base no `Schema` passado.

### Schema

Como no meu exemplo estou usando `Mongoose` precisamos entao antes de tudo, vamos pegar um exemplo que ensino no meu Workshop Be MEaN antigo:

```js
var Schema = mongoose.Schema
  ,  _schema = {
      name: { type: String, default: '' }
    , description: { type: String, default: '' }
    , alcohol: { type: Number, min: 0, default: '' }
    , price: { type: Number, min: 0, default: '' }
    , category: { type: String, default: ''}
    , created_at: { type: Date, default: Date.now }
  }
  , BeerSchema = new Schema(_schema)
  , Beer = mongoose.model('Beer', BeerSchema)
  ;

module.exports = Beer;
```

Inicialmente separamos o `Schema` do `Model` para ele poder ser reaproveitado:

```js
const Schema = {
  name: { type: String, default: '' }
, description: { type: String, default: '' }
, alcohol: { type: Number, min: 0, default: '' }
, price: { type: Number, min: 0, default: '' }
, category: { type: String, default: ''}
, created_at: { type: Date, default: Date.now }
}

module.exports = Schema;
```

Antes de ir para o `Model` vamos criar um objeto que seja o padrão para qualquer `Schema`:

```js
const Schema = {
  field: {
    type: String
  , default: undefined
  , validate: Function
  , index: Boolean
  , required: Boolean
  }
}

module.exports = Schema;
```

Além disso para que cada campo seja um átomo independente vamos refatorar nosso `Schema` para criar um esqueleto dos campos para posteriormente ser convertido no `Schema` específico do `Mongoose`.

#### Skeleton

```js
const Skeleton = [
  { field: 'name'
  , props:
    {
      type: String,
      default: ''
    }
  }
, { field: 'description'
  , props:
    {
      type: String,
      default: ''
    }
  }
, { field: 'alcohol'
  , props:
    {
      type: Number,
      default: ''
    }
  }
, { field: 'price'
  , props:
    {
      type: Number,
      default: ''
    }
  }
, { field: 'category'
  , props:
    {
      type: String,
      default: ''
    }
  }
, { field: 'created_at'
  , props:
    {
      type: Date,
      default: Date.now
    }
  }
]

module.exports = Skeleton;
```

O `Skeleton` é um *array* de campos com suas propriedades, criamos dessa forma para poder modularizar ainda mais, aguarde um pouco. Vamos refatorar o `Schema` para aceitar o `Skeleton`, para isso criamos uma *Factory* de `Schemas`:

```js
// schema.mongoose.factory.js
var Schema = {};
const SchemaSkeleton = function(Skeleton) {
  const createSchemaField = function(SkeletonAtom) {
    // chamar função que validará cada field se tem a interface correta
    Schema[SkeletonAtom.field] = SkeletonAtom.props;
  }
  Skeleton.forEach(createSchemaField);
  return Schema;
};

module.exports = SchemaSkeleton;
```

Depois de criado o `Skeleton` e o `SchemaFactory` podemos agora criar um `Schema` específico dessa forma:

```js
// schema.beer.js
const Skeleton = require('./skeleton.beer');
const Schema = require('./schema.mongoose.factory')(Skeleton);

module.exports = Schema;
```

##### Skeleton Atômico

Como eu disse que cada campo será um módulo atômico, aí você deve se perguntar:

**- Mas por quê?**

Porque eu vou querer reusar esses mesmos campos no *Frontend*, essa arquitetura é bem modular para que possa ser reaproveitada em qualquer lugar.

precisamos refatorar o `Skeleton` para:

```js
const Skeleton = [
  require('./fields/field.name')
, require('./fields/field.description')
, require('./fields/field.alcohol')
, require('./fields/field.price')
, require('./fields/field.category')
, require('./fields/field.created_at')
]

module.exports = Skeleton;
```

Para que isso seja possível eu criei uma pasta `fields` que conterá todos os campos atômicos do `Schema` de cervejas, por exemplo o campo `name`.

```js
// field.name.js
const Field = {
  field: 'name'
  , props:
    {
      type: String,
      default: ''
    }
}

module.exports = Field;
```

### Model

Precisamos entao criar o `Model` para o `Mongoose`:

```js
// model.mongoose.js
const Mongoose = require('mongoose');
const skeleton = require('./../schemas/schema.beer');
const Schema = new mongoose.Schema(skeleton);
const Model = mongoose.model('Beer', Schema);

module.exports = Model;
```


O `Model` **deve** possuir uma interface padrao para o CRUD:

```js
Model.create;
Model.retrieve;
Model.update;
Model.delete;
```

E lembrando da nossa assinatura na `Action`:

```js
Model.create(data, callbackJSON);
```

Então refatorando o Model temos:

```js
// model.mongoose.js
const Mongoose = require('mongoose');
const skeleton = require('./../schemas/schema.beer');
const Schema = new mongoose.Schema(skeleton);
const ModelMongoose = mongoose.model('Beer', Schema);

Model = {
  create: function(data, callback) {
    ModelMongoose.save(data, callback);
  }
, retrieve: function(data, callback) {
    ModelMongoose.find(data.query, callback);
  }
, update: function(data, callback) {
    ModelMongoose.update(data.query, data.mod, callback);
  }
, delete: function(data, callback) {
    ModelMongoose.remove(data.query, callback);
  }
}

module.exports = Model;
```

Nesse caso o `Model` para qualquer CRUD será genérico, bastando apenas a criação anterior do Model específico para seu sistema, podemos modularizar ainda mais, confira comigo:

```js
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
```

Com isso criamos uma forma de *Factory* para *Models* independente do Banco, ficando assim o *Model* do *Mongoose*:

```js
// model.mongoose.js
const Mongoose = require('mongoose');
const skeleton = require('./../schemas/schema.beer');
const Schema = new mongoose.Schema(skeleton);
const ModelMongoose = mongoose.model('Beer', Schema);

Model = require('./model')(ModelMongoose);

module.exports = Model;
```

Agora para tudo isso funcionar precisamos criar o módulo do Banco.

#### Config - Database

Para que nossa conexão com o Banco de Dados seja modular temos que analisar quais são os valores básicos a serem chamados nas conexões com a maioria dos bancos, rapidamente na mente vêm:

- host
  + endereço do serviço do Banco
  + exemplo: 'mongodb://localhost'
- porta
  + porta do serviço do Banco
  + exemplo: 27017
- database
  + nome do banco de dados a ser acessado

Então vamos iniciar pensando no módulo da conexão para o MongoDb:

```js
const DBConfig = {
  type: 'Document'
, name: 'MongoDb'
, host: 'mongodb://localhost/'
, database: 'arquitetura-foda-test'
, port: 27017
}

module.exports = DBConfig;
```

Para criarmos uma conexão com o MongoDB é bem simples, código antigo retirado do Be MEAN:

```js
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/maceio-setembro-2015');

var db = mongoose.connection;
db.on('error', function(err){
    console.log('Erro de conexao.', err);
});
db.on('open', function () {
  console.log('Conexão aberta.');
});
db.on('connected', function(err){
    console.log('Conectado');
});
db.on('disconnected', function(err){
    console.log('Desconectado');
});

```

Então baseando-me nesse código podemos refatorar para:

```js
// db.mongodb.js
const DB_CONFIG = require('./db.mongodb.config');
const DB_URL = DB_CONFIG.host + DB_CONFIG.database

const mongoose = require('mongoose');
mongoose.connect(DB_URL);

const db = mongoose.connection;
db.on('error', function(err){
    console.log('Erro de conexao.', err);
});
db.on('open', function () {
  console.log('Conexão aberta.');
});
db.on('connected', function(err){
    console.log('Conectado');
});
db.on('disconnected', function(err){
    console.log('Desconectado');
});

module.exports = db;
```

Percebeu que o *Mongoose* retorna um objeto da conexão que possui alguns eventos que podemos ouvir, logo teremos que criar um padrão para o objeto de conexão a ser retornado pelos módulos de Banco, irei retirar o evento `open` pois se ele conectar já saberemos que passou por esse estado.

```js
DBConnection.error;
DBConnection.connected;
DBConnection.disconnected;
```

Pois nos Bancos sem eventos, eles virarão funções a serem chamadas.

```js
const DB_CONFIG = require('./db.mongodb.config');
const DB_URL = DB_CONFIG.host + DB_CONFIG.database

const mongoose = require('mongoose');
mongoose.connect(DB_URL);

const db = mongoose.connection;
var Connection = {
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
console.log(Connection);
Connection
  .on('error', Connection.callbacks.error)
  .on('connected', Connection.callbacks.connected)
  .on('disconnected', Connection.callbacks.disconnected);

module.exports = db;
```

Perceba que mesmo o *Mongoose* nos fornecer o método `on` ele não retorna o mesmo objeto para encadearmos, então para deixar o módulo de Conexão, além dos *callbacks* para cada evento também criei o método `on` que irá garantir o encadeamento de eventos para qualquer conexão. E se temos um módulo de conexão precisamos separá-lo:

```js
// connection.default.js
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
```

Pronto agora é só importar nossa conexão e passar o objeto de conexão do Banco desejado.

```js
// db.mongodb.js
const DB_CONFIG = require('./db.mongodb.config');
const DB_URL = DB_CONFIG.host + DB_CONFIG.database

const mongoose = require('mongoose');
mongoose.connect(DB_URL);

const db = mongoose.connection;
const Connection = require('./connection.default')(db);

Connection
  .on('error', Connection.callbacks.error)
  .on('connected', Connection.callbacks.connected)
  .on('disconnected', Connection.callbacks.disconnected);

module.exports = db;
```

Pronto!

Agora para começarmos a usar nosso módulo `Routes` no `Express` precisamos criar o `express.js`:

```js

```

## FRP - Functional reactive programming

> Functional reactive programming (FRP) is a programming paradigm for reactive programming (asynchronous dataflow programming) using the building blocks of functional programming (e.g. map, reduce, filter). FRP has been used for programming graphical user interfaces (GUIs), robotics, and music, aiming to simplify these problems by explicitly modeling time.

fonte: [https://en.wikipedia.org/wiki/Functional_reactive_programming](https://en.wikipedia.org/wiki/Functional_reactive_programming)

# Validação

Para isso criaremos um módulo/serviço de validação universal e atômica.

Leia mais sobre o [UniversalValidator](https://github.com/Webschool-io/UniversalValidator).

# Refêrencias

## Meus artigos sobre esses temas:

- [http://nomadev.com.br/frontend-driven-development-com-mean-e-atomic-design/](http://nomadev.com.br/frontend-driven-development-com-mean-e-atomic-design/)
- [http://nomadev.com.br/fullstack-offline-api-first/](http://nomadev.com.br/fullstack-offline-api-first/)
- [http://nomadev.com.br/passo-a-passo-como-desenvolver-com-atomic-design-mobile-first-e-stylus/](http://nomadev.com.br/passo-a-passo-como-desenvolver-com-atomic-design-mobile-first-e-stylus/)
- [http://nomadev.com.br/passo-a-passo-como-desenvolver-com-atomic-design-mobile-first-e-stylus-parte-2/](http://nomadev.com.br/passo-a-passo-como-desenvolver-com-atomic-design-mobile-first-e-stylus-parte-2/)

## De terceiros

- [https://www.bignerdranch.com/blog/what-is-functional-reactive-programming/](https://www.bignerdranch.com/blog/what-is-functional-reactive-programming/)
- [https://en.wikipedia.org/wiki/Functional_reactive_programming](https://en.wikipedia.org/wiki/Functional_reactive_programming)