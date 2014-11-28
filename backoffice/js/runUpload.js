var resizer = require('./resizer.js'),
	exec = require('child_process').exec;

var finalName = process.argv[1],
	desc = process.argv[2],
	initName = process.argv[3];

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