'use strict';

var graylog2 = require('graylog2');
var Squeeze = require('good-squeeze').Squeeze;

function GraylogReporter(events, config) {
  this.client = new graylog2.graylog({
    servers: [{ host : config.host, port: config.port }],
    facility: config.service,
    hostname: (config.hostname) ? config.hostname : undefined
  });

  this.squeeze = new Squeeze(events);
}

GraylogReporter.prototype.init = function(readstream, emitter, callback) {
  this.squeeze.on('data', this._report.bind(this));
  readstream.pipe(this.squeeze);
  callback();
};

GraylogReporter.prototype._report = function(report) {
  if (report.event === 'error') {
    this.client.error(report);
    return;
  }

  this.client.info(report);
};

module.exports = GraylogReporter;
