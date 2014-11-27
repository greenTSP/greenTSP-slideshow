var express = require('express')
	,multer = require('multer')
	,exec = require('child_process').exec
	,fs = require('fs')
	;
var sys = require('sys');
	
var resizer = require('./resizer.js');

var localFolder = "../../8d1abeffe1",
	port = 3000;

var app = express();

app.use(multer({dest:'./tempimg/'}));
app.use(express.static(localFolder));

app.get('/', function(req, res){
	res.redirect("/index.html");
});

app.post('/upload', function(req, res){
	var finalName = (new Date()).getTime()+"."+req.files['image'].extension;
	var initName = req.files['image'].path;
	
	var desc = req.body.description;
	resizer.exportBackofficeImg(finalName, desc, initName, function(){
		var command = 'rm '+initName;
		console.log(command);
		exec(command, function(err){
			if(err)
				throw err;
			console.log('desc = ' + desc);
			console.log('File removed');
			res.send('success');
			
		});
	});
});


app.listen(port);
