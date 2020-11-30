var loading = false;
globalThis.laoding = false;

window.onscroll = function () { scrollFunction() };

function scrollFunction() {
  if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
    document.getElementById("header").style.boxShadow = "0 0 15px rgba(0,0,0,0.30)";
  } else {
    document.getElementById("header").style.boxShadow = "none";
  }
  setTimeout(() => {
    if (elementInViewport(document.getElementById("counters")) == true) {
      if (globalThis.laoding == false) {
        globalThis.laoding = true;
        $('.cont').each(function () {
          $(this).prop('Counter', 0).animate({
            Counter: $(this).text()
          }, {
            duration: 3000,
            easing: 'swing',
            step: function (now) {
              $(this).text(Math.ceil(now));
              var item = $(this).text();
              var num = Number(item).toLocaleString('it');
              $(this).text(num);
            }
          });
        });
      }
    }
  }, 500)
}

function elementInViewport(el) {
  var top = el.offsetTop;
  var left = el.offsetLeft;
  var width = el.offsetWidth;
  var height = el.offsetHeight;

  while (el.offsetParent) {
    el = el.offsetParent;
    top += el.offsetTop;
    left += el.offsetLeft;
  }

  return (
    top >= window.pageYOffset &&
    left >= window.pageXOffset &&
    (top + height) <= (window.pageYOffset + window.innerHeight) &&
    (left + width) <= (window.pageXOffset + window.innerWidth)
  );
}