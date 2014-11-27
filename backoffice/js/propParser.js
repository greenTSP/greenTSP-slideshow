var fs = require('fs');
var img_constructor = require('./img.js').img;

var path = '../../gclcimages/';

var transitions = ['fade', 'translate'];

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
					
                    response.imgs.push(new img_constructor(imageFile, str, transitions[transNumber], last_modified, true));
					
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