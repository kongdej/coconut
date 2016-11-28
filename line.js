request = require('request');
var mongojs = require('./db');
var db = mongojs.connect;
var currentpower;

db.solarplant.findOne({plant:"Solar Plant"},function(err,doc){
	doc['data'].forEach(function (item) {
		if (item.oid == '4222124661145612')	{
			currentpower = item.value;
		}		
	});

	var value1 = "Current Active Power="+currentpower+"KW<br>";
	var ifttt = {
//	        headers: {'content-type' : 'application/x-www-form-urlencoded'},
	        url    :'https://maker.ifttt.com/trigger/coconut/with/key/daLG1oQVqJ2WhydHpOccSQ',
	        proxy  :'http://proxy.egat.co.th:8080',
//	        body   : "value1="+value1
			form:    { value1: value1 }
	}
	console.log(ifttt);
	request.post(ifttt, function (error, response, body) {
	    if (!error && response.statusCode == 200) {

	        console.log(body);
	        process.exit();
	    }
	});
});

