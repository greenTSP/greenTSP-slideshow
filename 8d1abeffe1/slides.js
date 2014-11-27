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
  var root, slides, controls;

  function Slideshow(opts) {
    slides = opts.slides;
    root = document.querySelector(opts.id);

  }

  Slideshow.prototype.init = function() {
    // display navigation links
    console.log(slides, root, controls);
  }


  var slideshow = new Slideshow(_slides);
  slideshow.init();
})();
