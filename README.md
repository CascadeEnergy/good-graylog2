# good-graylog2
Good reporter for graylog2

## Usage:

```
'use strict';

var Hapi = require('hapi');
var good = require('good');
var goodConsole = require('good-console');
var graylogReporter = require('good-graylog2');
var config = require('config');

var server = new Hapi.Server();

server.connection({
  port: 1234,
  routes: {cors: true}
});


server.route([
  {
    method: 'GET',
    path: '/healthcheck',
    handler: function(request, reply) {
      reply('OK');
    }
  }
]);

var hapiOptions = {
  reporters: [
    {
      reporter: graylogReporter,
      events: {
        response: '*',
        log: '*',
        error: '*'
      },
      config: {
        service: 'service-name',
        host: 'graylog.example.com',
        port: '1234',
        container: config.container // optional
      }
    }
  ],
  responsePayload: true
};

server.register({ register: good, options: hapiOptions}, function(err) {
  if(err) {
    server.log(['service-name', 'error'], err);
  } else {
    server.start(function() {
      server.log(['service-name', 'info'], 'service-name running at: ' + server.info.uri);
    });
  }
});
```

## Graylog Setup:
This module requires a _GELF_UDP_ input to be configured on your graylog server.
