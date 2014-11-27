(function() {
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

  function updateCounter() {
    counterNode.textContent = (current + 1) + counterSeparator + slidesNodeList.length;
  }

  function Slideshow(opts) {
    slidesData = opts.slides;
    autoplayTime = opts.autoplayTime || 3000;
    counterSeparator = opts.counterSeparator || ' / ';
    var root = document.querySelector(opts.id);

    if(opts.json) {
      // load json content as slidesData
      request = new XMLHttpRequest();
      request.onreadystatechange = function() {
        if (request.readyState === 4) {
          if (request.status === 200) {
            slidesData = JSON.parse(request.responseText).imgs;
            console.log(slidesData);

            this.init();
            this.play();
          } else {
            console.error('There was a problem with the request.');
          }
        }
      }.bind(this);
      request.open('GET', './images.json');
      request.send();
    }


    slidesNode = root.querySelector('.slides');
    statusNode = root.querySelector('.status');
    prevNode = root.querySelector('.prev');
    nextNode = root.querySelector('.next');
    counterNode = root.querySelector('.counter');
    navNode = root.querySelector('nav');

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

    updateCounter();
  };

  Slideshow.prototype.nextSlide = function nextSlide() {
    this.slideTo((current + 1) % slidesNodeList.length);
  };

  Slideshow.prototype.prevSlide = function prevSlide() {
    var len = slidesNodeList.length;
    this.slideTo( (((current-1)%len)+len)%len );
  };

  Slideshow.prototype.init = function() {
    var format = 'large'; // or small if on mobile

    // Generate the slides
    for(var i = 0; i < slidesData.length; i++) {
      slidesNode.appendChild(createSlide(
        '/backofficeimages/' + format + '/' + slidesData[i].name,
        slidesData[i].desc
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

      navNode.appendChild(a)
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

  var slideshow = new Slideshow(_slides);
})();
