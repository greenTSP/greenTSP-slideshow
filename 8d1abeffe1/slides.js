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
  var slidesData;
  var slidesNode, statusNode, prevNode, nextNode, counterNode, navNode;

  var slidesNodeList;

  var current;

  function Slideshow(opts) {
    slidesData = opts.slides;
    var root = document.querySelector(opts.id);

    slidesNode = root.querySelector('.slides');
    statusNode = root.querySelector('.status');
    prevNode = root.querySelector('.prev');
    nextNode = root.querySelector('.next');
    counterNode = root.querySelector('.counter');
    navNode = root.querySelector('nav');

    slidesNodeList = slidesNode.children;

    current = 0;
  }

  Slideshow.prototype.init = function() {
    var links = navNode.getElementsByTagName('a'),
        len = links.length;

    for(var i = 0; i < len; i++) {
      var a = links[i];
      a.addEventListener('click', function(event){
        // toggle current image
        slidesNodeList.item(current).classList.toggle('show');

        // toggle dest image
        var dest = slidesNode.children.item(this);
        dest.classList.toggle('show');

        current = i;
      }.bind(i));
    }

    nextNode.addEventListener('click', nextSlide);
    prevNode.addEventListener('click', prevSlide);
  }

  function nextSlide(event) {
    console.log('toggle ' + current + ' and ' + (current + 1));
    var dest = slidesNodeList.item(current + 1),
        cur = slidesNodeList.item(current);
    console.log(dest, cur);

    cur.classList.toggle('show');
    dest.classList.toggle('show');
  }

  function prevSlide(event) {
    console.log('toggle ' + current + ' and ' + (current + 1));
    var dest = slidesNodeList.item(current - 1),
    cur = slidesNodeList.item(current);
    console.log(dest, cur);

    cur.classList.toggle('show');
    dest.classList.toggle('show');
  }

  var slideshow = new Slideshow(_slides);
  slideshow.init();
})();
