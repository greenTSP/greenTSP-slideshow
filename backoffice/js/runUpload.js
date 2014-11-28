var resizer = require('./resizer.js');
var propParser = require('./propParser.js');
var fs = require('fs');
var util = require('util');

var exportToJson = function(infos){
	mergeBackofficeInfos(oldInfos, infos);
	resizer.exportGclImg('./tempimg/', infos, oldInfos);
	
	fs.writeFile('../../backofficeimages/imgs.info.json', JSON.stringify(infos), {flag: 'w+'}, function (err) {
		if (err) throw err;
	});
};

var mergeBackofficeInfos = function(oldInfos, infos)
{
	for(var i=0; i<oldInfos.imgs.length; i++){
		if(!oldInfos.imgs[i].isGclImg){
			infos.imgs.push(oldInfos.imgs[i]);
		}
	}
};

var getInfos = function(){
	if(!fs.existsSync('../../backofficeimages/imgs.info.json'))
		return {"imgs":[]};
	
	return JSON.parse(fs.readFileSync('../../backofficeimages/imgs.info.json'));
};

var oldInfos = getInfos();

propParser.getImgInfos(function(result){ exportToJson(result);});
