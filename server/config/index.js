'use strict';

var path = require('path');
var _ = require('lodash');

var allconfig = {
	root: path.normalize(__dirname + '/../../'),
	seedDB: false,
	db_url: "mongodb://localhost:27017/swiftdb2"
}

module.exports = allconfig;