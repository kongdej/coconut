var mongojs = require('./db');
//var mysql = require('mysql');
var dateFormat = require('dateformat');
var express = require('express');
var app = express();
var port = 80
var port = process.env.PORT || port
//var oid = require('./config/oidtag');
var db = mongojs.connect;

app.use(express.static('public'));

// Routing
app.get('/sp',function (req,res){

   	var db = mongojs.connect;
	db.solarplant.findOne({plant:"Solar Plant"},function(err,doc){
		res.json(doc);
		console.log(doc.lastmodified);
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
