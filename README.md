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

### Rotas - Padrçao

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