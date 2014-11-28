var resizer = require('./resizer.js'),
	exec = require('child_process').exec;

var finalName = process.argv[2],
	desc = process.argv[3],
	initName = process.argv[4];
	
process.chdir("/var/www/backoffice/js/");

resizer.exportBackofficeImg(finalName, desc, initName, function(err){
	if(err)
		throw err;
	var command = 'rm '+initName;
	console.log(command);
	exec(command, function(err){
		if(err)
			throw err;
		
	});
});