'use strict';

var storj = require('storj-lib');
var mongoose = require('mongoose');
var expect = require('chai').expect;
var MongoAdapter = require('..');

describe('MongoAdapter', function() {

  var storage = null;

  before(function(done) {
    mongoose.connect('mongodb://localhost/storj-mongo-test', function(err) {
      storage = new MongoAdapter(mongoose);
      done(err);
    });
  });

  describe('#put', function() {

    it('should throw if invalid storage item supplied', function() {
      expect(function() {
        storage.put({ wrong: 'type' });
      }).to.throw(Error, 'Invalid storage item supplied');
    });

    it('should put the item into the database', function(done) {
      storage.put(storj.StorageItem({
        hash: storj.utils.rmd160('key')
      }), function(err) {
        expect(err).to.equal(null);
        done();
      });
    });

  });

  describe('#get', function() {

    it('should callback error if no shard found', function(done) {
      storage.get(storj.utils.rmd160('wrongkey'), function(err) {
        expect(err.message).to.equal('Shard data not found');
        done();
      });
    });

    it('should callback with the storage item', function(done) {
      storage.get(storj.utils.rmd160('key'), function(err, item) {
        expect(err).to.equal(null);
        expect(item).to.be.instanceOf(storj.StorageItem);
        expect(item.hash).to.equal(storj.utils.rmd160('key'));
        done();
      });
    });

  });

  describe('#flush', function() {

    it('should not throw', function(done) {
      storage.flush(done);
    });

  });

  after(function(done) {
    storage._model.remove(done);
  });

});
