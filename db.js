
var mongojs = require('mongojs');
var databaseurl = 'tkpdb';
var collections = ['solarplant','solarroof'];
var connect = mongojs(databaseurl,collections);

module.exports = {
	connect: connect
}
