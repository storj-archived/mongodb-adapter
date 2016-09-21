MongoDB Storage Adapter
=======================

[![Build Status](https://img.shields.io/travis/Storj/mongodb-adapter.svg?style=flat-square)](https://travis-ci.org/Storj/mongodb-adapter)

A [storj-lib](https://github.com/storj/core) compatible storage adapter for 
MongoDB, primarily used by [storj-bridge](https://github.com/storj/bridge).

Prerequisites
-------------

* MongoDB
* Storj Core

Installation
------------

```
npm install storj-mongodb-adapter --save
```

Usage
-----

```js
var storj = require('storj-lib');
var MongoStorageAdapter = require('storj-mongo-adapter');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/dbname', function() {
  var adapter = new MongoStorageAdapter(mongoose);
  var manager = new storj.StorageManager(adapter);
  var renter = new storj.RenterInterface({
    storageManager: manager,
    // ...
  });

  // That's it! The `renter` object now uses MongoDB to store
  // contract data!
});
```

License
-------

This software is licensed under the terms of the GNU Lesser General Public 
License, version 3 or later.
