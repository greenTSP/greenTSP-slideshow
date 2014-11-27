var img = function(name, desc, transition, last_modified, isGclImg){
    this.name = name;
    this.desc = desc;
    this.transition = transition;
	this.last_modified = last_modified;
	this.isGclImg = isGclImg;
};

img.prototype.toString = function imgToString(){
	return JSON.stringify(this);
};

exports.img = img;