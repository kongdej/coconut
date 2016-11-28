var fs = require('fs');
var mongojs = require('./db');
var mysql = require('mysql');
var dateFormat = require('dateformat');
var oid = require('./config/oidtag');

var db = mongojs.connect;

/** configuration ********************************************************/

var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : '',
  database : 'pcs9700'
 /*
  host     : '10.20.18.132',
  user     : 'tub',
  password : 'gearman1',
  database : 'pcs9700'
  */
});

var now = new Date();
var table;
// table= 'analogueother'+dateFormat(now,"yyyymm");
table = 'analogueother201608';

//var fileName = "./roof/20160922.csv";
var fileName = "P:/solarRoof/20160922.csv";
//var fileName = 'z:/roof/' + dateFormat(now,"yyyymmdd")+'.csv';

var request_time = 2000; // 30 seconds
/********************************************************************/

/* build sql command */
var sql  = "SELECT attr_oid,fValue,from_unixtime(attr_time,'%Y-%m-%d %H:%i') modified FROM " + table + ' WHERE attr_oid in ';
var idlist=[];
for (var k in oid.name) {
	idlist.push(k);
}

sql +='('+idlist.join(',')+')';
sql +=	' ORDER BY attr_time DESC LIMIT 0,'+idlist.length;
console.log(sql);
/**/

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


connection.connect();

var interval = setInterval(function() {
	connection.query(sql, function(err, rows, fields) {
	  if (err) {
	  	console.log('err:' + sql);
		connection.end()
	  	return;
	  }

      /* get solar plant data */
	  var datalist=[];
	  for (var i=0; i < rows.length; i++) { 
	  	datalist[i] = new dataDetailobj(rows[i].attr_oid,oid.name[rows[i].attr_oid],rows[i].fValue,oid.unit[rows[i].attr_oid]);
	  };
	  
	 
	  var result = new dataobj("Solar Plant",rows[0].modified,datalist);

 	  db.solarplant.remove({});
 	  db.solarplant.insert(result);
 	  console.log('GET Solar Plant @'+rows[0].modified);

 	  /* get solar roof data*/
	  fs.readFile(fileName, 'utf-8', function(err, data) {
		    if (err) throw err;

		    var lines = data.trim().split('\n');
		    var firstLine = lines[9];
		    var lastLine = lines.slice(-1)[0];
		    var fields = lastLine.split(';');
		    var fields_first = firstLine.split(';');

		   	/* solar roof data structure */
			var datalist_roof=[];
			datalist_roof[0] = new dataDetailobj('1','Total Generating Capacity',fields[1],'kWh');
			datalist_roof[1] = new dataDetailobj('2','Total Active Power',fields[6],'W');
			datalist_roof[2] = new dataDetailobj('3','Today Generating Capacity',fields[1]-fields_first[1],'khW');
			datalist_roof[3] = new dataDetailobj('4','Average irradiance',fields[32],'W/m2');
			datalist_roof[4] = new dataDetailobj('5','Average Cell Temp',fields[33],'C');
			/* end */

	  	  	var result = new dataobj("Solar Roof",fields[0],datalist_roof);
	  	  	db.solarroof.remove({});
   	  		db.solarroof.insert(result);
	    	console.log('GET Solar Roof @'+fields[0]);
		});
 	});
}, request_time);

process.on('uncaughtException', function (err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});