var mongojs = require('./db');
var mysql = require('mysql');
var dateFormat = require('dateformat');
//var express = require('express');
//var app = express();
var oid = require('./config/oidtag');
var db = mongojs.connect;
var connection = mysql.createConnection({
  host     : '10.20.18.132',
  user     : 'tub',
  password : 'gearman1',
  database : 'pcs9700'
});

connection.connect();

var port = process.env.PORT || 2016
var request_time = 15000; // 15 seconds

var sql  = 'SELECT attr_oid,fValue,from_unixtime(attr_time) modified FROM ';

//select table
//var now = new Date();
//sql += 'analogueother'+dateFormat(now,"yyyymm");
sql += 'analogueother201608';

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

	  var date = new Date();
      console.log(date);

	  var datalist=[];
	  for (var i=0; i < rows.length; i++) { 
	  	datalist[i] = new dataDetailobj(rows[i].attr_oid,oid.name[rows[i].attr_oid],rows[i].fValue,oid.unit[rows[i].attr_oid]);
	  };
	  
	  var result = new dataobj("Solar Plant",rows[0].modified,datalist);

 	  db.solarplant.remove({});
 	  db.solarplant.insert(result);
 	});
}, request_time);

/*
app.use(express.static('public'));

// Routing
app.get('/sp',function (req,res){

   	var db = mongojs.connect;
	db.solarplant.findOne({plant:"Solar Plant"},function(err,doc){
		res.json(doc);
		console.log("/GET/sp");
	});
});

app.get('/sp/:oid',function (req,res){
   	var db = mongojs.connect;
   	var id = parseInt(req.params.oid);
    console.log("/GET/"+id);

	db.solarplant.findOne({plant:"Solar Plant"},function(err,doc){
		if (err) {
			res.send(err);
			return;
		}
		else {
			for(var i=0; i<doc.data.length;i++) {
				if (doc.data[i].oid ==  id) {
					res.json(doc.data[i]);
					console.log(doc.data[i]);				
				}
			}
		}
	});
});


// Web Start
app.listen(port,function(){
	console.log('Starting node on port '+port);
});
*/
