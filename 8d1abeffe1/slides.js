(function() {
  var slidesData, counterSeparator, autoplayTime;
  var slidesNode, statusNode, prevNode, nextNode, counterNode, navNode;
  var slidesNodeList;
  var current;
  var root;

  function createSlide(src, caption, transition, load) {
    var fig = document.createElement('figure');
    transition.split(' ').forEach(function(anim){
      fig.classList.add(anim);
    });

    var img = document.createElement('img');
    var figcaption = document.createElement('figcaption');

	if(load)
		img.src = src;

    img.alt = caption;
    figcaption.textContent = caption;

    fig.appendChild(img);
    fig.appendChild(figcaption);

    return fig;
  }

  function updateCounter() {
    counterNode.textContent = (current + 1) + counterSeparator + slidesNodeList.length;
  }

  function Slideshow(opts) {

    autoplayTime = opts.autoplayTime || 3000;
    counterSeparator = opts.counterSeparator || ' / ';
    root = document.querySelector(opts.id);

    slidesNode = root.querySelector('.slides');
    statusNode = root.querySelector('.status');
    prevNode = root.querySelector('.prev');
    nextNode = root.querySelector('.next');
    counterNode = root.querySelector('.counter');
    navNode = root.querySelector('nav');

    // List of slides
    slidesNodeList = slidesNode.children;
    current = 0;

    if(opts.slides) {
      // We can provide data as
      slidesData = opts.slides;

      this.init();
      this.play();
    } else if(opts.json) {
      // load json content as slidesData
      request = new XMLHttpRequest();
      request.onreadystatechange = function() {
        if (request.readyState === 4) {
          if (request.status === 200) {
            slidesData = JSON.parse(request.responseText).imgs;

            this.init();
            this.play();
          } else {
            console.error('There was a problem with the request.');
          }
        }
      }.bind(this);
      request.open('GET', opts.json);
      request.send();
    }
  };

  Slideshow.prototype.slideTo = function(to) {
  	this.load(to);
  	this.load(to+1);
  	this.load(to-1);

    slidesNodeList.item(current).classList.toggle('show');
    slidesNodeList.item(to).classList.toggle('show');

    navNode.children.item(current).classList.toggle('active');
    navNode.children.item(to).classList.toggle('active');

    current = to;

    updateCounter();
  };

  Slideshow.prototype.load = function(i) {
  	var index = i%slidesData.length;
  	index = (index<0)?index+slidesData.length:index;

  	if(slidesData[index].load)
  		return;

  	slidesData[index].load = true;
  	var format = (screen.width <= 768) ? 'small' : 'large';
  	var link = '../backofficeimages/' + format + '/' + slidesData[index].name;
  	slidesNodeList.item(index).childNodes[0].src = link;
  };

  Slideshow.prototype.nextSlide = function nextSlide() {
    this.slideTo((current + 1) % slidesNodeList.length);
  };

  Slideshow.prototype.prevSlide = function prevSlide() {
    var len = slidesNodeList.length;
    this.slideTo( (((current-1)%len)+len)%len );
  };

  Slideshow.prototype.init = function() {
    var format = (screen.width <= 768) ? 'small' : 'large';

    // Generate the slides
    for(var i = 0; i < slidesData.length; i++) {
	  // Load only current, previous and next.
	  slidesData[i].load = (i%slidesData.length < 2);
      slidesNode.appendChild(createSlide(
        '../backofficeimages/' + format + '/' + slidesData[i].name,
        slidesData[i].desc,
        slidesData[i].transition,
		slidesData[i].load
      ));
    }

    // Generate navigation
    var len = slidesNodeList.length;

    for(var i = 0; i < len; i++) {
      var a = document.createElement('a');
      a.href = '#';
      a.title = 'Go to n°' + (i+1);
      a.classList.add('bullet');

      // On click go to slide i
      a.addEventListener('click', function(event){
        this.slideshow.slideTo(this.to);
      }.bind({slideshow: this, to: i}));

      navNode.appendChild(a);
    }

    // Display where we are in that slideshow
    updateCounter();

    // Set default classes
    slidesNodeList.item(current).classList.add('show');
    navNode.children.item(current).classList.add('active');

    // Add a bunch of listener
    nextNode.addEventListener('click', this.nextSlide.bind(this));
    prevNode.addEventListener('click', this.prevSlide.bind(this));
    statusNode.addEventListener('click', this.toggleAutoplay.bind(this));

    // Add touch feedback
    var touch = new TouchListener(this);
    root.addEventListener('touchstart', touch.start.bind(touch));
    root.addEventListener('touchmove', touch.move.bind(touch));
    root.addEventListener('touchend', touch.end.bind(touch));

    // Let some event deactivate the autoplay
    root.addEventListener('mouseover', this.toggleAutoplay.bind(this));
    root.addEventListener('mouseout', this.toggleAutoplay.bind(this));
    root.addEventListener('focus', this.toggleAutoplay.bind(this));
    root.addEventListener('blur', this.toggleAutoplay.bind(this));

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

  Slideshow.prototype.pause = function() {
    this.autoplay = false;
    statusNode.classList.remove('playing');
    statusNode.classList.add('stopped');
  }

  Slideshow.prototype.toggleAutoplay = function() {
    this.autoplay = this.autoplay ? false : true;

    statusNode.classList.toggle('playing');
    statusNode.classList.toggle('stopped');
  };

  function TouchListener(slideshow) {
    this.threshold = 100; //required min distance traveled to be considered swipe
    this.allowedTime = 250; // maximum time allowed to travel that distance

    this.slideshow = slideshow;
    this.startX = 0;
    this.startY = 0;
    this.dist = 0;
    this.elapsedTime = null;
    this.startTime = null;
  };

  TouchListener.prototype.start = function(e) {
    console.log('touchstart');
    this.slideshow.pause();

    var touchobj = e.changedTouches[0];
    this.dist = 0;
    this.startX = touchobj.pageX;
    this.startY = touchobj.pageY;
    this.startTime = new Date().getTime(); // record time when finger first makes contact with surface
  };

  TouchListener.prototype.move = function(e) {
    e.preventDefault();
  };

  TouchListener.prototype.end = function(e) {
    console.log('touchend');

    var touchobj = e.changedTouches[0];
    this.dist = touchobj.pageX - this.startX; // get total dist traveled by finger while in contact with surface
    this.elapsedTime = new Date().getTime() - this.startTime; // get time elapsed

    // check that elapsed time is within specified,
    //       horizontal dist traveled >= threshold,
    //       and vertical dist traveled <= 100
    if(this.elapsedTime <= this.allowedTime
      && Math.abs(this.dist) >= this.threshold
      && Math.abs(touchobj.pageY - this.startY) <= 100) {

      // Swipe to right
      if(touchobj.pageX - this.startX < 0) {
        this.slideshow.nextSlide();
      } else {
        this.slideshow.prevSlide();
      }
    }

    this.slideshow.play();
  };

  // Provide it as a module for everyone to use
  window.Slideshow = Slideshow;

  if(_slides) {
    new Slideshow(_slides);
  }
})();
