var graylog2 = require('graylog2');
var goodSqueeze = require('good-squeeze');

var reporter = {};

module.exports = reporter.GraylogReporter = function (events, config) {
  this.client = new graylog2.graylog({
    servers: [
      {'host' : config.host, port: config.port}
    ],
    facility: config.service
  });

  if(config.docker) {
    this.client.hostname = config.container;
  }

  this.streams = {
    squeeze: goodSqueeze.Squeeze(events)
  };
};

reporter.GraylogReporter.prototype.init = function(readstream, emitter, callback) {
  this.streams.squeeze.on('data', this._report.bind(this));
  readstream.pipe(this.streams.squeeze);
  callback();
};

reporter.GraylogReporter.prototype._report = function(report) {
  this.client.log(report);
};
