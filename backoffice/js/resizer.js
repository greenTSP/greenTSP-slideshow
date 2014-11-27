
var exec = require('child_process').exec;
var sys = require('sys');

var jpegoptim = "/usr/local/bin/jpegoptim";
var jpegoptions = "--max=90 --all-progressive --strip-all --preserve --totals";

var optipng = "/usr/bin/optipng";
var pngoptions = "-o2 -preserve";

var converter = "/usr/bin/convert";
var converterOptions  = "";

var resizer = new Object();

/*
*	setConverter(pathToConverter[, converterOptions]);
*/
resizer.setConverter = function(conv, options){
	converter = conv;
	converterOptions = options;
}

resizer.setJpegOptimizer = function(optimizer, options){
	jpegoptim = optimizer;
	jpegoptions = options;
}

resizer.setPngOptimizer = function(optimizer, options){
	optipng = optimizer;
	pngoptions = options;
}

resizer.resize = function(input, output, sizeX, sizeY, callback){
	resizeImage(input, output, sizeX, sizeY, function(err, file){
		optim(file, callback);
	});
}

var optim = function(imgpath, callback){
	//teste le format de l'image
	var regexPNG = new RegExp("^.*\.png", "i");
	var regexJPEG = new RegExp("^.*\.(jpg|jpeg)", "i");
	
	if(regexPNG.test(imgpath))
		optimPNG(imgpath, callback);
	else if(regexJPEG.test(imgpath))
		optimJPEG(imgpath, callback);
	else {
		if(callback)
			callback(null, imgpath);
	}
}

var optimJPEG = function(imgpath, callback){
	var command = jpegoptim+" "+jpegoptions+" "+imgpath;
	
	child = exec(command, function(err, stdout, stderr){
		if(callback)
			callback(err, imgpath);
	});
}

var optimPNG = function(imgpath, callback){
	var command = optipng + " " + pngoptions + " "+imgpath;
	
	child = exec(command, function(err, stdout, stderr){
		if(callback)
			callback(err, imgpath);
	});
}

var resizeImage = function(input, output, sizeX, sizeY, callback){
	var command = converter + " " + input + " " + converterOptions +" " + "-resize "+sizeX + "x" + sizeY + " " + output;
	
	child = exec(command, function(err, stdout, stderr){
		if(callback)
			callback(err, output);
	});
}

exports.resize = resizer.resize;
exports.setPngOptimizer = resizer.setPngOptimizer;
exports.setJpegOptimizer = resizer.setJpegOptimizer;
exports.setConverter = resizer.setConverter;