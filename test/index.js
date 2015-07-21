'use strict';

var assert = require('assert');
var proxyquire = require('proxyquire');
var Readable = require('stream').Readable;

var GraylogReporter = proxyquire('../', {graylog2: {graylog: graylog}});

function readStream() {
  var stream = new Readable({ objectMode: true });
  stream._read = function() {};
  return stream;
}

function graylog() {}

describe('good-graylog2', function() {
  it('should send log events with graylog.info', function(done) {
    var infoLog = {
      event     : 'log',
      timestamp : 1396207735000,
      tags      : ['info', 'server'],
      data      : 'Log message',
      pid       : 1234
    };

    var reporter = new GraylogReporter({log: '*'}, {});
    var stream = readStream();

    reporter.client.info = function(message) {
      assert.equal(message, infoLog);
      done();
    };

    reporter.init(stream, null, function() {
      stream.push(infoLog);
    });
  });

  it('should send error events with graylog.error', function(done) {
    var errorLog = {
      event     : 'error',
      timestamp : 1396207735000,
      tags      : ['error', 'server'],
      data      : 'Log message',
      pid       : 1234
    };

    // Branch coverage.
    var config = { container: 'test.container'};

    var reporter = new GraylogReporter({error: '*'}, config);
    var stream = readStream();

    reporter.client.error = function(message) {
      assert.equal(message, errorLog);
      done();
    };

    reporter.init(stream, null, function() {
      stream.push(errorLog);
    });
  });
});
