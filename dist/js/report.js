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

function carDetails() {
    var colorsData = {};
    var currentPath;
    var svg = document.querySelectorAll('.car-details__wrapper svg path[data-name]');
    svg.forEach(element => {
        element.addEventListener('click', function () {
            var popups = document.querySelectorAll('.popup-colors');
            popups.forEach(element => {
                element.style.display = "none";                
            });
            var popup = document.querySelector('.popup-colors[data-popup="'+element.getAttribute('data-popup')+'"]')
            popup.style.display = "flex";
            var popupTitle = popup.querySelector('.popup-colors__title')
            popupTitle.textContent = element.getAttribute('data-name');
            currentPath = this;            
        })
    });

    var popupClose = document.querySelectorAll('.popup-colors__close');
    popupClose.forEach(element => {
        element.addEventListener('click', function(){
            element.parentNode.style.display = "none";     
        })          
    });

    var popup = document.querySelectorAll('.popup-colors__item');
    popup.forEach(element => {
        element.addEventListener('click', function () {
            currentPath.style.fill = this.getAttribute('data-color');
            element.parentNode.parentNode.style.display = "none";
        })
    });
}

var car = new carDetails();