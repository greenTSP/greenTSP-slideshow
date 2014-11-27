var img = function(name, desc){
    this.name = name;
    this.desc = desc;
    this.transition = transition;
};

img.prototype.toString = function imgToString(){
    return "\n\t{\n\t\t\"name\": \""+this.name+"\",\n\t\t\"desc\": \""+this.desc+"\",\n\t\t\"transition\": \""+this.transition+"\"\n\t}";
};

var createJsonImages = function(){
    var fs = require('fs');
    var path = '../../gclcimages/';
    var filePattern = /.prop/i;
    var descriptionPattern = /Description.*\n/;

    var propList = [];

    fs.readdir(path, function(err, files){
        if(err)
            throw err;

        var propFile, imageFile;
        var transitions = ['fade', 'translate'];
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
                    propList.push(new img(imageFile, str, transitions[transNumber]));
                    numberPushedFiles += 1;
                    if(numberPushedFiles === numberPropFiles){
                        var msg = "{ imgs : ["+propList+" \n\t]\n}";
                        fs.writeFile('../../backofficeimages/imgs.info.json', msg, function (err) {
                            if (err) throw err;
                        });
                    }
                });
            })(propFile, imageFile, transNumber);
            transNumber = (transNumber+1)%2;
        }
    });
};

exports.createJsonImages = createJsonImages;
