var resizer = require('./resizer.js');

var finalname = process.argv[1],
	desc = process.argv[2],
	initname = process.argv[3];

resizer.exportBackofficeImg(finalname, desc, initname, function(){
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