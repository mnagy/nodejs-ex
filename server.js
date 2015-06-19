//  OpenShift sample Node application
var express = require('express');
var fs      = require('fs');
var app     = express();
var eps     = require('ejs');

app.engine('html', require('ejs').renderFile);

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
var mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL;
if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
	var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase();
	var mongoHost = process.env[mongoServiceName + "_SERVICE_HOST"];
	var mongoPort = process.env[mongoServiceName + "_SERVICE_PORT"];
	var mongoUser = process.env.MONGODB_USER
	if (mongoHost && mongoPort && process.env.MONGODB_DATABASE) {
      mongoURL = 'mongodb://';
      if (process.env.MONGODB_USER && process.env.MONGODB_PASSWORD) {
        mongoURL += process.env.MONGODB_USER + ':' + process.env.MONGODB_PASSWORD + '@';
	  }
      mongoURL += mongoHost + ':' + mongoPort + '/' + process.env.MONGODB_DATABASE;
	}
}
var db = null;
var dbDetails = new Object();

var initDb = function(callback) {
	if (mongoURL == null) return;

	var mongodb = require('mongodb');	
	if (mongodb == null) return;
	
	mongodb.connect(mongoURL, function(err, conn) {
		if (err) {
			callback(err);
			return;
		}

		db = conn;
		dbDetails.databaseName = db.databaseName;
		dbDetails.url = db.options.url;
	  	dbDetails.type = 'MongoDB';

		console.log("Connected to MongoDB at: " + mongoURL);
	});
};

app.get('/', function (req, res) {
  if (db) {
	  var col = db.collection('counts');
	  // Create a document with request IP and current time of request
	  col.insert({ip: req.ip, date: Date.now()});
	  col.count(function(err, count){
        // console.log("Page count: " + count);
		res.render('index.html', { pageCountMessage : count, dbInfo: dbDetails });
	  });
  } else { 
    res.render('index.html', { });
  }
});

app.get('/pagecount', function (req, res) {
  if (db) {
	  db.collection('counts').count(function(err, count ){
        // console.log("Page count: " + count);
		res.send('{ pageCount: ' + count +'}');
	  });
  } else { 
	  res.send('{ pageCount: -1 }');
  }
});

// error handling
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500).send('Something bad happened!');
});

initDb(function(err){
	console.log('Error connecting to Mongo. Message:\n'+err);
});

app.listen(port, ip);
console.log('Server running on ' + ip + ':' + port);


