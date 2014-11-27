(function() {
  // img size: width="900" height="360"
  /*
  var _slides = {
  id: '#slideshow',
  slides: [
  {src: '../gclcimages/bach_creek_river.jpg', caption: 'Un ruisseau ombragé'},
  {src: '../gclcimages/canoe_water_nature.jpg', caption: 'Une invitation à naviguer paisiblement'},
  {src: '../gclcimages/gclc.png', caption: 'le logo officiel du Green Code Lab Challenge'},
  {src: '../gclcimages/guyana_sky_clouds.jpg', caption: 'Landscape in Amazonian Guyana'}
  ]
};
  */
  var slidesData, counterSeparator;
  var slidesNode, statusNode, prevNode, nextNode, counterNode, navNode;
  var slidesNodeList;
  var current;

  function Slideshow(opts) {
    this.autoplay = true;
    slidesData = opts.slides;
    counterSeparator = opts.counterSeparator || ' / ';
    var root = document.querySelector(opts.id);

    slidesNode = root.querySelector('.slides');
    statusNode = root.querySelector('.status');
    prevNode = root.querySelector('.prev');
    nextNode = root.querySelector('.next');
    counterNode = root.querySelector('.counter');
    navNode = root.querySelector('nav');

    slidesNodeList = slidesNode.children;

    current = 0;
  };

  Slideshow.prototype.slideTo = function(to) {
    console.log('slide from ' + current + ' to ' + to);
    var cur = slidesNodeList.item(current),
    dest = slidesNodeList.item(to);

    cur.classList.toggle('show');
    dest.classList.toggle('show');

    current = to;

    counterNode.textContent = (current + 1) + counterSeparator + slidesNodeList.length;
  };

  Slideshow.prototype.nextSlide = function nextSlide() {
    this.slideTo((current + 1) % slidesNodeList.length);
  };

  Slideshow.prototype.prevSlide = function prevSlide() {
    var len = slidesNodeList.length;
    this.slideTo( (((current-1)%len)+len)%len );
  };

  Slideshow.prototype.init = function() {
    var links = navNode.getElementsByTagName('a'),
        len = links.length;

    for(var i = 0; i < len; i++) {
      var a = links[i];
      a.addEventListener('click', function(event){
        // toggle current image
        this.slideshow.slideTo(this.to);
      }.bind({slideshow: this, to: i}));
    }

    nextNode.addEventListener('click', this.nextSlide.bind(this));
    prevNode.addEventListener('click', this.prevSlide.bind(this));

    var timeout = function(){
      if(this.autoplay) {
        this.nextSlide();
        setTimeout(timeout.bind(this), 3000);
      }
    };

    setTimeout(timeout.bind(this), 3000);
  };

  Slideshow.prototype.pause = function() {
    this.autoplay = false;
  };

  Slideshow.prototype.play = function() {
    this.autoplay = true;
  };

  slideshow = new Slideshow(_slides);
  slideshow.init();

  Slideshow.prototype.lazyLoad = function(index)
  {
	var prev, next;

	this.load(index);

	prev = (index===0)?slides.length:index-1;
	this.load(prev);

	next = ((index+1)===slides.length)?0:index+1;
	this.load(next);
  };

  Slideshow.prototype.load = function(index)
  {
	if(!slides[index].load)
		document.getElementById(slides[index-1].id).setAttribute('src', slides[index].src);
  };
})();
