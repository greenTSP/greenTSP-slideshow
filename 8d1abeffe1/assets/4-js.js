var _slides = {id:'#slideshow',json:'../backofficeimages/imgs.info.json'};
!function(){function t(t,e,s,i){var n=document.createElement("figure");s.split(" ").forEach(function(t){n.classList.add(t)});var l=document.createElement("img"),o=document.createElement("figcaption");return l.src=i?t:"",l.alt=e,o.textContent=e,n.appendChild(l),n.appendChild(o),n}function e(){c.textContent=g+1+l+p.length}function s(t){o=t.autoplayTime||3e3,l=t.counterSeparator||" / ",m=document.querySelector(t.id),a=m.querySelector(".slides"),d=m.querySelector(".status"),r=m.querySelector(".prev"),h=m.querySelector(".next"),c=m.querySelector(".counter"),u=m.querySelector("nav"),p=a.children,g=0,t.slides?(n=t.slides,this.init(),this.play()):t.json&&(request=new XMLHttpRequest,request.onreadystatechange=function(){4===request.readyState&&(200===request.status?(n=JSON.parse(request.responseText).imgs,this.init(),this.play()):console.error("There was a problem with the request."))}.bind(this),request.open("GET",t.json),request.send())}function i(t){this.threshold=100,this.allowedTime=250,this.slideshow=t,this.startX=0,this.startY=0,this.dist=0,this.elapsedTime=null,this.startTime=null}var n,l,o,a,d,r,h,c,u,p,g,m;s.prototype.slideTo=function(t){this.load(t),this.load(t+1),this.load(t-1),p.item(g).classList.toggle("show"),p.item(t).classList.toggle("show"),u.children.item(g).classList.toggle("active"),u.children.item(t).classList.toggle("active"),g=t,e()},s.prototype.load=function(t){var e=t%n.length;if(e=0>e?e+n.length:e,!n[e].load){n[e].load=!0;var s=screen.width<=768?"small":"large",i="../backofficeimages/"+s+"/"+n[e].name;p.item(e).childNodes[0].src=i}},s.prototype.nextSlide=function(){this.slideTo((g+1)%p.length)},s.prototype.prevSlide=function(){var t=p.length;this.slideTo(((g-1)%t+t)%t)},s.prototype.init=function(){for(var s=screen.width<=768?"small":"large",l=0;l<n.length;l++)n[l].load=l%n.length<2,a.appendChild(t("../backofficeimages/"+s+"/"+n[l].name,n[l].desc,n[l].transition,n[l].load));for(var c=p.length,l=0;c>l;l++){var v=document.createElement("a");v.href="#",v.title="Go to n°"+(l+1),v.classList.add("bullet"),v.addEventListener("click",function(){this.slideshow.slideTo(this.to)}.bind({slideshow:this,to:l})),u.appendChild(v)}e(),p.item(g).classList.add("show"),u.children.item(g).classList.add("active"),h.addEventListener("click",this.nextSlide.bind(this)),r.addEventListener("click",this.prevSlide.bind(this)),d.addEventListener("click",this.toggleAutoplay.bind(this));var y=new i(this);m.addEventListener("touchstart",y.start.bind(y)),m.addEventListener("touchmove",y.move.bind(y)),m.addEventListener("touchend",y.end.bind(y)),m.addEventListener("mouseover",this.toggleAutoplay.bind(this)),m.addEventListener("mouseout",this.toggleAutoplay.bind(this)),m.addEventListener("focus",this.toggleAutoplay.bind(this)),m.addEventListener("blur",this.toggleAutoplay.bind(this));var f=function(){this.autoplay&&this.nextSlide(),setTimeout(f.bind(this),o)};setTimeout(f.bind(this),o)},s.prototype.play=function(){this.autoplay=!0,d.classList.add("playing"),d.classList.remove("stopped")},s.prototype.pause=function(){this.autoplay=!1,d.classList.remove("playing"),d.classList.add("stopped")},s.prototype.toggleAutoplay=function(){this.autoplay=this.autoplay?!1:!0,d.classList.toggle("playing"),d.classList.toggle("stopped")},i.prototype.start=function(t){console.log("touchstart"),this.slideshow.pause();var e=t.changedTouches[0];this.dist=0,this.startX=e.pageX,this.startY=e.pageY,this.startTime=(new Date).getTime()},i.prototype.move=function(t){t.preventDefault()},i.prototype.end=function(t){console.log("touchend");var e=t.changedTouches[0];this.dist=e.pageX-this.startX,this.elapsedTime=(new Date).getTime()-this.startTime,this.elapsedTime<=this.allowedTime&&Math.abs(this.dist)>=this.threshold&&Math.abs(e.pageY-this.startY)<=100&&(e.pageX-this.startX<0?this.slideshow.nextSlide():this.slideshow.prevSlide()),this.slideshow.play()},window.Slideshow=s;var v;_slides&&(v=new s(_slides)),window.onbeforeunload=function(){v=null,n=null,l=null,o=null,a=null,d=null,r=null,h=null,c=null,u=null,p=null,g=null,m=null}}();
!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");