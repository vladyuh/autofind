//Remove animations on load
window.onload = function () {
    document.querySelector('body').classList.remove('perf-no-animation');
}

//100vh hack
var vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty("--vh", "".concat(vh, "px"));
window.addEventListener("resize", function () {
    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", "".concat(vh, "px"));
});


//Mobile menu init
function mobileMenu() {
    var toggle = document.querySelector('.header-burger .burger');
    var menu = document.querySelector('.mobileMenu');
    var body = document.querySelector('body');

    this.onOpen = function () {
        toggle.classList.add('open');
        menu.classList.add('opened');
        body.classList.add('mobile');
        return true;
    };

    this.onClose = function () {
        toggle.classList.remove('open');
        menu.classList.remove('opened');
        body.classList.remove('mobile');
    }

    this.isOpen = function () {
        if (menu.classList.contains('opened')) {
            return true;
        }
    }
}

var mobileMenu = new mobileMenu();

document.querySelector('.header-burger .burger').addEventListener('click', function (e) {
    e.preventDefault();
    if (mobileMenu.isOpen()) {
        mobileMenu.onClose();
    } else {
        mobileMenu.onOpen();
    }

});

var navLinks = document.querySelectorAll('.mobileMenu-nav__ul li a');
for (var i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener('click', function () {
        mobileMenu.onClose();
    });
}

var fieldGroup = document.querySelectorAll('.accordion__expand .toggle');
for (var i = 0; i < fieldGroup.length; i++) {
    fieldGroup[i].addEventListener('click', function () {
        var elem = this.parentNode;
        var fields = elem.parentNode;
        this.classList.toggle('is-active');
        fields.classList.toggle('is-active');
    })
}

var fieldCollapse = document.querySelectorAll('.collapse-toggle input[type="checkbox"]');
for (var i = 0; i < fieldCollapse.length; i++) {
    fieldCollapse[i].addEventListener('change', function () {
        var label = this.parentNode;
        var field = label.parentNode;
        field.classList.toggle('is-active');
    })
}

//Browser-level image lazy-loading
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    for (var i = 0; i < images.length; i++) {
        images[i].src = images[i].dataset.src;
    }
} else {
    const script = document.createElement('script');
    script.src = '/js/lazysizes.min.js';
    document.body.appendChild(script);
}

//close select on mouse leave
var selectParent = document.querySelectorAll('.select');
for (var i = 0; i < selectParent.length; i++) {
    selectParent[i].addEventListener('mouseleave', function () {
        this.querySelector('.select__value').classList.remove('is-active');
    })
}

//open / close select on click
var select = document.querySelectorAll('.select__value');
for (var i = 0; i < select.length; i++) {
    select[i].addEventListener('click', function (e) {
        if (this.classList.contains('is-active')) {
            this.classList.remove('is-active');
        } else {
            this.classList.add('is-active');
        }

    })
}

//select item in select
var selectRadio = document.querySelectorAll('.select__value input[type="radio"]');
for (var i = 0; i < selectRadio.length; i++) {
    selectRadio[i].addEventListener('change', function () {
        var parent = this.parentNode;
        var value = parent.querySelectorAll('label > span')[0].innerText;

        var parentSiblings = parent.parentNode.querySelectorAll('label');
        for (var j = 0; j < parentSiblings.length; j++) {
            parentSiblings[j].classList.remove('is-active');
        }

        parent.classList.add('is-active');

        var parentValue = this.closest('.select__value').querySelectorAll('.value')[0];
        parentValue.innerHTML = value;

        this.closest('.select__value').classList.remove('is-active');
        this.closest('.select__value').classList.remove('is-invalid');
    })

    selectRadio[i].addEventListener('invalid', function () {
        this.closest('.select__value').classList.add('is-invalid');
    })
}

//form submit
var submit = document.querySelectorAll('input[type=submit], button[type="submit"]');
for (var i = 0; i < submit.length; i++) {
    submit[i].addEventListener('click', function (e) {
        this.closest('form').classList.add('submitted');
    });
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js');
    });
}