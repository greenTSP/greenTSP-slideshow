var fs = require('fs');
var path = '../../gclcimages/';

var transitions = ['fade', 'translate'];

var img = function(name, desc, transition, last_modified){
    this.name = name;
    this.desc = desc;
    this.transition = transition;
	this.last_modified = last_modified;
};

img.prototype.toString = function imgToString(){
	return JSON.stringify(this);
};

var getImgInfos = function(callback){
    var filePattern = /.prop/i;
    var descriptionPattern = /Description.*\n/;

	var response = {imgs: []};

    fs.readdir(path, function(err, files){
        if(err)
            throw err;

        var propFile, imageFile;
        var transNumber = 0;
        var numberPropFiles = 0;
        var numberPushedFiles = 0;

        files.sort();
        while(files.length !== 0){
            if(filePattern.test(files[0])){
                propFile = files.shift();
                imageFile = files.shift();
            } else {
                imageFile = files.shift();
                propFile = files.shift();
            }
            numberPropFiles += 1;
            (function(propFile, imageFile, transNumber){
                fs.readFile(path+propFile, function(err, data){
                    if(err)
                        throw err;
                    var str='';
                    str += descriptionPattern.exec(data);
                    str = str.replace("Description=","").replace("Description:","").replace("\n","");
					
					last_modified = fs.statSync(path+propFile).ctime;
					
                    response.imgs.push(new img(imageFile, str, transitions[transNumber], last_modified));
					
                    ++numberPushedFiles;
                    if(numberPushedFiles === numberPropFiles){
						callback(response);
                    }
                });
            })(propFile, imageFile, transNumber);
            transNumber = (transNumber+1)%2;
        }
    });
};

exports.getImgInfos = getImgInfos;