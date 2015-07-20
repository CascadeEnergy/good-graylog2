var Stream = require('stream');
var assert = require('assert');
var should = require('should');
var proxyquire = require('proxyquire');


var graylog = {

};
var goodGraylog2 = proxyquire('../index', {graylog2: graylog});


describe('good-graylog2', function() {
  var config = {
    host: 'graylog2.example.com',
    port: 1234,
    service: 'test-service',
    docker : true,
    container: '1234abcd'
  };
  var readStream = function () {
    return new Stream.Readable({ objectMode: true });
  };

  it('should create a graylog client', function(done) {
    var goodReporter = new goodGraylog2(null,config);
    should.exist(goodReporter.client);
    done();
  });

  it('should log an event', function(done) {
    var goodReporter = new goodGraylog2({log: '*'}, config);
    var stream = readStream();

    goodReporter.client.log = function(short_message) {
      assert.equal(short_message, 'log data');
      done();
    };

    goodReporter._report('log data');
  });

  it('should init', function(done) {
    var goodReporter = new goodGraylog2({log: '*'}, config);
    var stream = readStream();

    goodReporter.init(stream, null, function(err) {
      should.not.exist(err);
      done();
    });
  })
});
