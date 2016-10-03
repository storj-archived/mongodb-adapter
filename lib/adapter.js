'use strict';

var storj = require('storj-lib');
var inherits = require('util').inherits;
var Storage = require('storj-service-storage-models');
var Shard = Storage.models.Shard;
var mongoose = require('mongoose');
var assert = require('assert');

/**
 * Implements a MongoDB storage adapter for contract and audit management
 * @constructor
 * @extends {storj.StorageAdapter}
 * @param {Storage} mongooseConnection - The connection object from mongoose
 */
function MongoAdapter(mongooseConnection) {
  if (!(this instanceof MongoAdapter)) {
    return new MongoAdapter(mongooseConnection);
  }

  storj.StorageAdapter.call(this);

  if (mongooseConnection instanceof Storage) {
    this._model = mongooseConnection.models.Shard;
  } else {
    this._model = Shard(mongooseConnection);
  }
}

inherits(MongoAdapter, storj.StorageAdapter);

/**
 * Implements the abstract {@link storj.StorageAdapter#_get}
 * @private
 * @param {String} key
 * @param {Function} callback
 */
MongoAdapter.prototype._get = function(key, callback) {
  this._model.findOne({ hash: key }, function(err, shard) {
    if (err) {
      return callback(err);
    }

    if (!shard) {
      return callback(new Error('Shard data not found'));
    }

    callback(null, shard.toObject());
  });
};

/**
 * Implements the abstract {@link storj.StorageAdapter#_peek}
 * @private
 */
MongoAdapter.prototype._peek = MongoAdapter.prototype._get;

/**
 * Implements the abstract {@link storj.StorageAdapter#_put}
 * @private
 * @param {String} key
 * @param {storj.StorageItem} item
 * @param {Function} callback
 */
MongoAdapter.prototype._put = function(key, item, callback) {
  this._model.create(item, callback);
};

/**
 * Implements the abstract {@link storj.StorageAdapter#_del}
 * @private
 * @param {String} key
 * @param {Function} callback
 */
MongoAdapter.prototype._del = function(key, callback) {
  // NB: Bridge does not store data shards, so there is no reason to try and
  // NB: reap stale data. We always want a record of the contracts, audits,
  // NB: and challenges, so this method is just a passthrough to maintain
  // NB: compatibility with `storj/core`.
  callback(null);
};

/**
 * Implements the abstract {@link storj.StorageAdapter#_keys}
 * @private
 * @param {Function} callback
 */
MongoAdapter.prototype._keys = function(callback) {
  // NB: Bridge does not store data shards, so there is no reason to try and
  // NB: reap stale data. We always want a record of the contracts, audits,
  // NB: and challenges, so this method is just a passthrough to maintain
  // NB: compatibility with `storj/core`.
  callback(null, []);
};

/**
 * Implements the abstract {@link storj.StorageAdapter#_size}
 * @private
 * @param {Function} callback
 */
MongoAdapter.prototype._size = function(callback) {
  callback(null, 0);
};

module.exports = MongoAdapter;
