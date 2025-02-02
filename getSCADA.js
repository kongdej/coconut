var fs = require('fs');
var mongojs = require('./db');
var mysql = require('mysql');
var dateFormat = require('dateformat');
var oid = require('./config/oidtag');

var fileName = "roof/solarroof.csv";
var db = mongojs.connect;
var connection = mysql.createConnection({
/*
  host     : '127.0.0.1',
  user     : 'root',
  password : '',
  database : 'pcs9700'
 */
  host     : '10.20.18.132',
  user     : 'tub',
  password : 'gearman1',
  database : 'pcs9700'
});

connection.connect();

//var port = process.env.PORT || 2016
var request_time = 30000; // 30 seconds

var sql  = "SELECT attr_oid,fValue,from_unixtime(attr_time,'%Y-%m-%d %H:%i') modified FROM ";

//select table yyyymm
//var now = new Date();
//sql += 'analogueother'+dateFormat(now,"yyyymm");
sql += 'analogueother201610';

sql += ' WHERE attr_oid in ';
var idlist=[];
for (var k in oid.name) {
	idlist.push(k);
}

sql +='('+idlist.join(',')+')';
sql +=	' ORDER BY attr_time DESC LIMIT 0,'+idlist.length;

function dataobj(plant,lastmodified,datalist) {
	this.plant = plant;
	this.lastmodified=lastmodified;
	this.data = datalist;
}

function dataDetailobj(oid,name,value,unit) {
	this.oid=oid;
	this.name=name;
	this.value=value;
	this.unit=unit;
}

console.log(sql);

var interval = setInterval(function() {
	connection.query(sql, function(err, rows, fields) {
	  if (err) {
	  	console.log('err:' + sql);
		connection.end()
	  	return;
	  }

	  //var date = new Date();
      //console.log(rows);

 	  db.solarplant.remove({});

	  var datalist=[];
	  for (var i=0; i < rows.length; i++) { 
	  	datalist[i] = new dataDetailobj(rows[i].attr_oid,oid.name[rows[i].attr_oid],rows[i].fValue,oid.unit[rows[i].attr_oid]);
	  };
	  var result = new dataobj("Solar Plant",rows[0].modified,datalist);
 	  db.solarplant.insert(result);


	  fs.readFile(fileName, 'utf-8', function(err, data) {
		    if (err) throw err;

		    var lines = data.trim().split('\n');
		    var lastLine = lines.slice(-1)[0];

		    var fields = lastLine.split(';');

			var datalist_roof=[];
			datalist_roof[0] = new dataDetailobj('1','Total Power',fields[1],'kWh');
			datalist_roof[1] = new dataDetailobj('2','Current Power',fields[2],'W');
			
	  	  	var result = new dataobj("Solar Roof",fields[0],datalist_roof);
	  	  	db.solarroof.remove({});
   	  		db.solarroof.insert(result);
	    	console.log(result);
		});


 	});
}, request_time);
