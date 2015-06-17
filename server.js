#!/bin/env node
//  OpenShift sample Node application
var express = require('express');
var fs      = require('fs');
var jade    = require('jade');
var app     = express();
app.set('views', './views');
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/public'))

var port = process.env.PORT || process.env.port || process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

// Forward on to jade
app.get('/', function (req, res) {
  res.render('index', { title : 'Node.js simple example for OpenShift' });
})

// error handling
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500).body('Something bad happened!');
});

app.listen(port, ip);
console.log('Server running on ' + ip + ':' + port);


