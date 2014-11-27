var resizer = require('./resizer.js');
var propParser = require('./propParser.js');
var fs = require('fs');
var util = require('util');

var exportToJson = function(infos){
	resizer.exportGclImg('../../gclcimages/', infos, oldInfos);
	
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

propParser.getImgInfos(function(result){ exportToJson(result);});