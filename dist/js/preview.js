window.addEventListener("load", function () {
  var slider = document.querySelectorAll('[data-glide-el="track"]');
  if (slider.length !== 0) {
      var glide = document.createElement('script');
      glide.src = "/js/glide.min.js";
      glide.onload = initSliders;
      document.body.appendChild(glide);
  }
});

function initSliders() {
  var preview = document.querySelectorAll('.preview__slider');
  preview.forEach(element => {
      var glide = new Glide(element, {
          type: "carousel",
          perView: 6,
          gap: 10,
          breakpoints: {
              640: {
                  perView: 4,
              }
          }
      });
      glide.on('move.after', function () {
          var active = element.querySelector('.glide__slide--active');
          var image = element.querySelector('.glide__preview .image img');
          image.src = active.querySelector('img').getAttribute('src');
      });
      glide.mount();
  });
}