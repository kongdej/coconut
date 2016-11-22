var mongojs = require('./db');
//var mysql = require('mysql');

var dateFormat = require('dateformat');
var express = require('express');
var app = express();
var port = 2016
var port = process.env.PORT || port
//var oid = require('./config/oidtag');
var db = mongojs.connect;

app.use(express.static('public'));

var kco =  0.517;  // 0.517 tonCO2/MWh
var kpt = 1.25;    // tCO2 = 200

// Routing
app.get('/sp',function (req,res){

   	var db = mongojs.connect;
	db.solarplant.findOne({plant:"Solar Plant"},function(err,doc){
		doc['data'].forEach(function (item) {
			if (item.oid == '4222124661211148')	{
				cov = item.value*kco;
				console.log(cov);

				co2 = {'oid':'1', name:'CO2', value: cov, unit: 'Ton'}
			}		
		});
		ptv = cov*200/kpt;

		pt = {'oid':'2', name:'Plant', value: ptv, unit: 'EA'}
		
		doc['data'][20]=co2;
		doc['data'][21]=pt;
		res.json(doc);
		console.log(doc.lastmodified + ': Solar Plant is requested.');
	});
});

// Routing
app.get('/sr',function (req,res){

   	var db = mongojs.connect;
	db.solarroof.findOne({plant:"Solar Roof"},function(err,doc){
		res.json(doc);
		console.log(doc.lastmodified + ': Solar Roof is requested.');
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
