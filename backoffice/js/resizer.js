var img_constructor = require('./img.js').img;
var fs = require('fs');

var exec = require('child_process').exec;
var sys = require('sys');

var jpegoptim = "/usr/local/bin/jpegoptim";
var jpegoptions = "--max=90 --all-progressive --strip-all --preserve --totals";

var optipng = "/usr/local/bin/optipng";
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
	var command = converter + " " + input + " " + converterOptions +" " + "-resize '"+sizeX + "x" + sizeY + "^' -crop " + sizeX+"x"+sizeY+ "+0+0 -strip -interlace plane " + output;
	
	child = exec(command, function(err, stdout, stderr){
		if(callback)
			callback(err, output);
	});
};

var exportBackofficeImg = function(filename, description, input, callback){
	resizer.exportImg(filename,input, callback);
	
	var infos = getInfos();
	var n = infos.imgs.length;
	var added = false;
	
	for(var i=0; i<n ; i++)
	{
		var old_img = infos.imgs[i];
		if(old_img === filename)
		{
			infos.imgs[i] = new img_constructor(filename, description, old_img.transition, new Date(), false);
			added = true;
			break;
		}
	}
	if(!added)
		infos.imgs.push(new img_constructor(filename, description, (i%2===0)?'fade':'translate', new Date(), false));
	
	exportToJson(infos);
};

var exportToJson = function(infos){
	exportGclImg('../../gclcimages/', infos, oldInfos);
	
	fs.writeFile('../../backofficeimages/imgs.info.json', JSON.stringify(infos), function (err) {
		if (err) throw err;
	});
};

var getInfos = function(){
	if(!fs.existsSync('../../backofficeimages/imgs.info.json'))
		return {"imgs":[]};
	
	return JSON.parse(fs.readFileSync('../../backofficeimages/imgs.info.json'));
};

var oldInfos = getInfos();

var exportGclImg = function(folder, infos, oldInfos){	
	var i = 0;
	
	var n = infos.imgs.length;
	var old_n = oldInfos.imgs.length;
	
	var exist;
	
	var filenames = [];
	console.log('reze');
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
				console.log('exporting '+img.name);
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
		if(oldImg.isGclImg &&filenames.indexOf(oldImg.name) === -1){
			fs.unlink(output.small+oldImg.name);
			fs.unlink(output.large+oldImg.name);
		}
	}
};

exports.exportBackofficeImg = exportBackofficeImg;
exports.exportGclImg = exportGclImg;
exports.exportImg = resizer.exportImg;
exports.setPngOptimizer = resizer.setPngOptimizer;
exports.setJpegOptimizer = resizer.setJpegOptimizer;
exports.setConverter = resizer.setConverter;
