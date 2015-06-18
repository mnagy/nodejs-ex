var util = require('util');
var url = require('url');
var qs = require('querystring');
var os = require('os')
var port = process.env.PORT || process.env.port || process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ip = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
var nodeEnv = process.env.NODE_ENV || 'unknown';
// TODO: Handle missing database service name
var mongoIp = process.env.MONGODB_SERVICE_HOST;
var mongoPort = process.env.MONGODB_SERVICE_PORT;

var express = require('express');
var mongo = require('mongodb').MongoClient;
if (process.env.MONGODB_SERVICE_HOST && process.env.MONGODB_SERVICE_PORT) {
	mongo.connect('mongodb://' + process.env.MONGODB_SERVICE_HOST + ':' + process.env.MONGODB_SERVICE_PORT + '/' + process.env.MONGODB_DATABASE, function (err, db) {
		console.log("Err is " + err);
	});
}

var app = express();
app.use(function(req, res, next) {
	var url_parts = url.parse(req.url, true);

	var body = '';
	req.on('data', function (data) {
		body += data;
	});
	req.on('end', function () {
		var formattedBody = qs.parse(body);

		res.writeHead(200, {'Content-Type': 'text/plain'});

		res.write('Hello OpenShift World! This is a Node.js-based sample application.\n');
		res.write('Mongo URL: mongodb://' + process.env.MONGODB_SERVICE_HOST + ':' + process.env.MONGODB_SERVICE_PORT + '/' + process.env.MONGODB_DATABASE + '\n');
		res.write('Host: ' + req.headers.host + '\n');
		res.write('\n');
		res.write('node.js Production Mode: ' + (nodeEnv == 'production' ? 'yes' : 'no') + '\n');
		res.write('\n');
		res.write('HTTP/' + req.httpVersion +'\n');
		res.write('Request headers:\n');
		res.write(util.inspect(req.headers, null) + '\n');
		res.write('Request query:\n');
		res.write(util.inspect(url_parts.query, null) + '\n');
		res.write('Request body:\n');
		res.write(util.inspect(formattedBody, null) + '\n');
		res.write('\n');
		res.write('Host: ' + os.hostname() + '\n');
		res.write('OS Type: ' + os.type() + '\n');
		res.write('OS Platform: ' + os.platform() + '\n');
		res.write('OS Arch: ' + os.arch() + '\n');
		res.write('OS Release: ' + os.release() + '\n');
		res.write('OS Uptime: ' + os.uptime() + '\n');
		res.write('OS Free memory: ' + os.freemem() / 1024 / 1024 + 'mb\n');
		res.write('OS Total memory: ' + os.totalmem() / 1024 / 1024 + 'mb\n');
		res.write('OS CPU count: ' + os.cpus().length + '\n');
		res.write('OS CPU model: ' + os.cpus()[0].model + '\n');
		res.write('OS CPU speed: ' + os.cpus()[0].speed + 'mhz\n');
		res.end('\n');
	});
	next();
});

app.listen(port, ip);
console.log('Server running on ' + ip + ':' + port);
