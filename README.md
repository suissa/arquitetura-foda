# a Ideia

Criar um padrão para que as funções possam ser reusadas nos módulos, esses sendo assíncronos e com uma API REST e/ou Eventos.

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
- RabbitMQ? ZeroMQ?

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

git@github.com:suissa/arquitetura-foda.git

Meus artigos sobre esses temas:

[http://nomadev.com.br/frontend-driven-development-com-mean-e-atomic-design/](http://nomadev.com.br/frontend-driven-development-com-mean-e-atomic-design/)
[http://nomadev.com.br/fullstack-offline-api-first/](http://nomadev.com.br/fullstack-offline-api-first/)
[http://nomadev.com.br/passo-a-passo-como-desenvolver-com-atomic-design-mobile-first-e-stylus/](http://nomadev.com.br/passo-a-passo-como-desenvolver-com-atomic-design-mobile-first-e-stylus/)
[http://nomadev.com.br/passo-a-passo-como-desenvolver-com-atomic-design-mobile-first-e-stylus-parte-2/](http://nomadev.com.br/passo-a-passo-como-desenvolver-com-atomic-design-mobile-first-e-stylus-parte-2/)
[]()
