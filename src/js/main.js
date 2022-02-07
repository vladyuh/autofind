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

function fileUpload() {
    var imgData = {};
    function sendFiles(files, elem, callback) {
        for (var i = 0; i < files.length; i++) {
            var file = files.item(i);
            // проверяем что бы небыло одинаковых файлов
            if (imgData) {
                var count = 0
                for (thing in imgData) {
                    var thingObj = imgData[thing]
                    for (thingImg in imgData[thing]) {
                        count++;
                        if (thingImg == file.size) {
                            alert('Такой файл уже прикреплен, выберите другой файл ')
                            return false;
                        }
                    }
                }
            }
            //проверяем тип файла
            if (file.type === 'image/jpeg' || file.type === 'image/png') {
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function (e) {
                    var request = new XMLHttpRequest();
                    var data = new FormData();
                    data.append('file', file.name);
                    data.append('data', e.target.result);
                    request.addEventListener('loadstart', function () {
                        var html = '' +
                            '<div class="input-file__previewItem loading" id="file_' + e.total + '">' +
                            '<div class="input-file__previewLoading"></div>' +
                            '<div class="input-file__previewRemove" data-id="' + e.total + '" >&times;</div>' +
                            '<div class="input-file__previewImage">' +
                            '<span class="bgimage" style="background-image: url(' + e.target.result + ')"></span>' +
                            '</div>' +
                            '</div>';
                        var div = document.createElement('div');
                        div.innerHTML = html.trim();
                        var filePreview = elem.parentNode.querySelector('.input-file__preview');
                        filePreview.appendChild(div.firstChild);
                    })

                    request.addEventListener('readystatechange', function (dataImage) {
                        if (request.readyState == 4) {
                            dataImage = JSON.parse(request.responseText);
                            callback(e, dataImage);
                            setTimeout(function () {
                                var file = document.querySelector('#file_' + e.total);
                                file.classList.remove('loading');
                                var remove = file.querySelector('.input-file__previewRemove');
                                remove.setAttribute('data-attach-id', dataImage.attach_id);
                            }, 1000)
                        }
                    })
                    request.open("POST", 'upload.php');
                    request.send(data);
                }

            }
        }
    }
    var fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(element => {
        element.addEventListener('change', function () {
            let files = this.files;
            let elem = element;
            sendFiles(files, elem, function (link, dataImage) {
                var idThing = elem.getAttribute('data-thingid');
                if (!imgData['thing_' + idThing]) {
                    var itemImage = imgData['thing_' + idThing] = {};
                }
                var itemImage = imgData['thing_' + idThing]
                itemImage[link.total] = [dataImage.url];
            });
            console.log(imgData)
        })
    });
    var removeAttach = document.querySelectorAll('.input-file__previewRemove');
    document.body.addEventListener('click', function (event) {
        if (event.target.getAttribute('data-attach-id')) {
            elem = event.target;
            var id = elem.getAttribute('data-id');
            var attach_id = elem.getAttribute('data-attach-id');
            var input = elem.closest('.input-file');
            var idThing = input.querySelector('input[type="file"]').getAttribute('data-thingid');
            var previewItem = elem.parentNode;
            if (id && delete imgData['thing_' + idThing][id]) {
                if (confirm('Удалить прикрепленное изображение?')) {
                    previewItem.remove();
                    var request = new XMLHttpRequest();
                    var data = new FormData();
                    data.append('id', attach_id);
                    request.open("POST", 'remove.php');
                    request.send(data);
                }
            }
        };
    });
}

var fileUploads = new fileUpload();

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

function carDetails(){
    var colorsData = {};
    var currentPath;
    var svg = document.querySelectorAll('.car-details__wrapper svg path[data-name]');
    svg.forEach(element => {
        element.addEventListener('click', function () {
            document.querySelector('.popup-colors').style.display = "flex";            
            document.querySelector('.popup-colors__title').textContent = element.getAttribute('data-name');
            currentPath = this;

        })
    });

    var popupClose = document.querySelector('.popup-colors__close');
    popupClose.addEventListener('click', function(){
        document.querySelector('.popup-colors').style.display = "none";
    })

    var popup = document.querySelectorAll('.popup-colors__item');
    popup.forEach(element => {
        element.addEventListener('click', function () {
            currentPath.style.fill = this.getAttribute('data-color');
            element.parentNode.parentNode.style.display = "none";

            var idThing = currentPath.getAttribute('data-name');
            if (!colorsData[idThing]) {
                var itemImage = colorsData[idThing] = {};
            }
            var itemImage = colorsData[idThing];
            if(itemImage.current){
                itemImage.previous = itemImage.current;
            }
            else{
                itemImage.previous= "rgba(255,255,255)"; 
            }            
            itemImage.current = currentPath.style.fill;            
            console.log(colorsData);

            document.querySelector('.undo.btn').style.display = "flex";

        })
    });

    var undo  = document.querySelector('.undo.btn');
    undo.addEventListener('click', function(){

        var current = colorsData[currentPath.getAttribute('data-name')];
        current.current = current.previous;
        current.previous = "rgb(255,255,255)";
        currentPath.style.fill = current.current;
        console.log(current);
        console.log(colorsData)

        this.style.display = "none";
    })
}

var car = new carDetails();