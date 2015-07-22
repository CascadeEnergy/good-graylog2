# good-graylog2
_Good Reporter For Graylog2_

__Hapi:__ http://hapijs.com/
__Good:__ https://github.com/hapijs/good
__Graylog2:__ https://www.graylog.org/



## Usage:

```
'use strict';

var Hapi = require('hapi');
var good = require('good');
var GoodGraylog2 = require('good-graylog2');

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

var goodOptions = {
  reporters: [
    {
      reporter: GoodGraylog2,
      events: {
        response: '*',
        log: '*',
        error: '*'
      },
      config: {
        service: 'service-name',
        host: 'graylog.example.com',
        port: '1234',
        //hostname: 'myContainerId' //optional 
      }
    }
  ],
  responsePayload: true
};

server.register({ register: good, options: goodOptions}, function(err) {
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
