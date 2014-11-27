
var fs = require('fs');

var exec = require('child_process').exec;
var sys = require('sys');

var jpegoptim = "/usr/local/bin/jpegoptim";
var jpegoptions = "--max=90 --all-progressive --strip-all --preserve --totals";

var optipng = "/usr/bin/optipng";
var pngoptions = "-o2 -preserve";

var converter = "/usr/bin/convert";
var converterOptions  = "";

var size = { small: { width: 320, height: 128 }, large: { width: 900, height: 360 }};
var output = { small: '../../backofficeimages/small/' , large: '../../backofficeimages/large/'};

var resizer = new Object();

/*
*	setConverter(pathToConverter[, converterOptions]);
*/
resizer.setConverter = function(conv, options){
	converter = conv;
	converterOptions = options;
};

resizer.setJpegOptimizer = function(optimizer, options){
	jpegoptim = optimizer;
	jpegoptions = options;
};

resizer.setPngOptimizer = function(optimizer, options){
	optipng = optimizer;
	pngoptions = options;
};

resizer.exportImg = function(name, input, callback){
	exportLargeInput(name, input, function(){exportSmallImg(name, input, callback);});
};

var resize = function(input, output, sizeX, sizeY, callback){
	resizeImage(input, output, sizeX, sizeY, function(err, file){
		optim(file, callback);
	});
};

var exportSmallImg = function(name, input, callback){
	resize(input, output.small+name, size.small.width, size.small.height, callback);
};

var exportLargeInput = function(name, input, callback){
	resize(input, output.large+name, size.large.width, size.large.height, callback);
};

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
};

var resizeIfNeeded = function(folder, infos, oldInfos){	
	var i = 0;
	
	var n = infos.imgs.length;
	var old_n = oldInfos.imgs.length;
	
	var exist;
	
	var filenames = [];
	
	for(i; i<n; i++)
	{
		exist = false;
		
		var img = infos.imgs[i];
		
		filenames.push(img.name);
		
		for(var j=0; j<old_n; j++)
		{
			var oldImg = oldInfos.imgs[j];
			if(img.name !== oldImg.name)
				continue;
			
			exist = true;
			if(img.last_modified > oldImg.last_modified){
				resizer.exportImg(img.name,folder+img.name);
				break;
			}
		}
		if(!exist)
			resizer.exportImg(img.name,folder+img.name);
	};
	
	// Delete old images
	for(i=0; i<old_n; i++)
	{
		var oldImg = oldInfos.imgs[i];
		if(filenames.indexOf(oldImg.name) === -1){
			fs.unlink(output.small+oldImg.name);
			fs.unlink(output.large+oldImg.name);
		}
	}
};

exports.resizeIfNeeded = resizeIfNeeded;
exports.exportImg = resizer.exportImg;
exports.setPngOptimizer = resizer.setPngOptimizer;
exports.setJpegOptimizer = resizer.setJpegOptimizer;
exports.setConverter = resizer.setConverter;