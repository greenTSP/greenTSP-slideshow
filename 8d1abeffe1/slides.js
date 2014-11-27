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
  var slides;
  var slidesNode, statusNode, prevNode, nextNode, counterNode, navNode;

  var current;

  function Slideshow(opts) {
    slides = opts.slides;
    var root = document.querySelector(opts.id);

    slidesNode = root.querySelector('.slides');
    statusNode = root.querySelector('.status');
    prevNode = root.querySelector('.prev');
    nextNode = root.querySelector('.next');
    counterNode = root.querySelector('.counter');
    navNode = root.querySelector('nav');

    current = slidesNode.children.item(0);
    console.log(current);
  }

  Slideshow.prototype.init = function() {
    var links = navNode.getElementsByTagName('a'),
        len = links.length;

    for(var i = 0; i < len; i++) {
      var a = links[i];
      a.addEventListener('click', function(event){
        // toggle current image
        current.classList.toggle('show');

        // toggle dest image
        var dest = slidesNode.children.item(this);
        dest.classList.toggle('show');

        current = dest;
      }.bind(i));
    }
  }

  var slideshow = new Slideshow(_slides);
  slideshow.init();
})();
