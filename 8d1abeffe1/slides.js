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
  var slidesData, counterSeparator, autoplayTime;
  var slidesNode, statusNode, prevNode, nextNode, counterNode, navNode;
  var slidesNodeList;
  var current;

  function createSlide(src, caption) {
    var fig = document.createElement('figure');
    var img = document.createElement('img');
    var figcaption = document.createElement('figcaption');

    img.src = src;
    img.alt = caption;
    figcaption.textContent = caption;

    fig.appendChild(img);
    fig.appendChild(figcaption);

    return fig;
  }

  function Slideshow(opts) {
    slidesData = opts.slides;
    autoplayTime = opts.autoplayTime || 3000;
    counterSeparator = opts.counterSeparator || ' / ';
    var root = document.querySelector(opts.id);


    slidesNode = root.querySelector('.slides');
    statusNode = root.querySelector('.status');
    prevNode = root.querySelector('.prev');
    nextNode = root.querySelector('.next');
    counterNode = root.querySelector('.counter');
    navNode = root.querySelector('nav');

    // Generate the slides
    for(var i = 0; i < slidesData.length; i++) {
      slidesNode.appendChild(createSlide(slidesData[i].src,slidesData[i].caption));
    }

    // List of slides
    slidesNodeList = slidesNode.children;
    current = 0;
  };

  Slideshow.prototype.slideTo = function(to) {
    console.log('slide from ' + current + ' to ' + to);

    slidesNodeList.item(current).classList.toggle('show');
    slidesNodeList.item(to).classList.toggle('show');

    navNode.children.item(current).classList.toggle('active');
    navNode.children.item(to).classList.toggle('active');

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
    var len = slidesNodeList.length;

    // Generate navigation
    console.log('generating ' + len + ' links');
    for(var i = 0; i < len; i++) {
      var a = document.createElement('a');
      a.href = '#';
      a.title = 'Go to n°' + (i+1);
      a.classList.add('bullet');

      // On click go to slide i
      a.addEventListener('click', function(event){
        this.slideshow.slideTo(this.to);
      }.bind({slideshow: this, to: i}));

      navNode.appendChild(a)
    }

    // Set default classes
    slidesNodeList.item(current).classList.add('show');
    navNode.children.item(current).classList.add('active');

    // Add a bunch of listener
    nextNode.addEventListener('click', this.nextSlide.bind(this));
    prevNode.addEventListener('click', this.prevSlide.bind(this));
    statusNode.addEventListener('click', this.toggleAutoplay.bind(this));

    // Autoplay repetition logic.
    var timeout = function(){
      if(this.autoplay) {
        this.nextSlide();
      }
      setTimeout(timeout.bind(this), autoplayTime);
    };
    // Launch the autoplay
    setTimeout(timeout.bind(this), autoplayTime);
  };

  Slideshow.prototype.play = function() {
    this.autoplay = true;
    statusNode.classList.add('playing');
    statusNode.classList.remove('stopped');
  }

  Slideshow.prototype.toggleAutoplay = function() {
    this.autoplay = this.autoplay ? false : true;

    statusNode.classList.toggle('playing');
    statusNode.classList.toggle('stopped');
  };

  Slideshow.prototype.lazyLoad = function(index) {
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

  var slideshow = new Slideshow(_slides);
  slideshow.init();
  slideshow.play();
})();
