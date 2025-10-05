
///LK Add images USer
let cropper;
const fileInput = document.getElementById('formFile');
const image = document.getElementById('imageCropper');
const previewCircle = document.getElementById('previewCircle');
const cropBtn = document.getElementById('cropBtn');

fileInput.addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    image.src = event.target.result;
    image.style.display = 'block';

    // Уничтожаем старый cropper, если он был
    if (cropper) cropper.destroy();

    // Новый cropper
    cropper = new Cropper(image, {
      aspectRatio: 1, // квадрат
      viewMode: 1,
      dragMode: 'move',
      background: false,
      autoCropArea: 1,
      ready() {
        updatePreview();
      },
      crop() {
        updatePreview();
      }
    });
  };
  reader.readAsDataURL(file);
});

function updatePreview() {
  if (!cropper) return;
  const canvas = cropper.getCroppedCanvas({
    width: 150,
    height: 150,
  });
  previewCircle.src = canvas.toDataURL();
}

cropBtn.addEventListener('click', function () {
  if (!cropper) return;
  const canvas = cropper.getCroppedCanvas({
    width: 500, // итоговое разрешение
    height: 500,
  });
  const croppedImage = canvas.toDataURL('image/png');

  // здесь можно отправить croppedImage на сервер (AJAX или fetch)
  console.log("Base64:", croppedImage);
});




  $('#cropBtn').on('click', function () {
    if (!cropper) return;

    // получаем обрезанное фото
    const canvas = cropper.getCroppedCanvas({
      width: 500,
      height: 500,
    });
    const croppedImage = canvas.toDataURL('image/png');

    $.ajax({
      url: 'addUserImg.php',
      type: 'POST',
      data: { image: croppedImage },
      dataType: 'json',
      success: function (response) {
        if (response.status === "success") {
          // обновляем аватар
          $('#imgFoto').attr('src', response.file + '?v=' + Date.now()); 
          // ?v=... → чтобы не тянулось старое фото из кэша

          // закрываем модалку
          $('#staticBackdropImg').modal('hide');
        } else {
          alert("Ошибка: " + response.message);
        }
      },
      error: function (xhr, status, error) {
        console.error(error);
        alert("Ошибка при загрузке фото.");
      }
    });
  });



//Disk
$(document).ready(function () {
  let selectedFile = null;

  // 1. Загрузка списка файлов
  function loadFiles(query = "") {
    $.ajax({
      url: "listFiles.php",
      type: "GET",
      data: { search: query },
      dataType: "json",
      success: function (data) {
        let html = "";
        data.forEach(item => {
          html += `
            <a href="#" class="list-group-item list-group-item-action file-item" 
               data-type="${item.type}" data-name="${item.name}">
              ${item.type === "folder" ? "📁" : "📄"} ${item.name}
            </a>
          `;
        });
        $("#fileList").html(html);
      }
    });
  }

  loadFiles(); // первый запуск

  // 2. Поиск
  $("#searchBox").on("keyup", function () {
    loadFiles($(this).val());
  });

  // 3. Выбор файла
  $(document).on("click", ".file-item", function (e) {
    e.preventDefault();
    $(".file-item").removeClass("active");
    $(this).addClass("active");
    selectedFile = $(this).data("name");

    $("#shareBtn, #deleteBtn").prop("disabled", false);
  });

  // 4. Создание папки
$(document).ready(function () {
  // открываем модалку при нажатии кнопки
  $("#createFolderBtn").click(function () {
    $("#folderNameInput").val(""); // очистка поля
    $("#createFolderModal").modal("show");
  });

  // обработка "Создать"
  $("#saveFolderBtn").click(function () {
    const folderName = $("#folderNameInput").val().trim();
    if (!folderName) return;

    $.post("createFolder.php", { name: folderName }, function () {
      $("#createFolderModal").modal("hide"); // закрыть модалку
      loadFiles(); // обновить список
    });
  });
});


  // 5. Загрузка файла
  $("#uploadFile").change(function () {
    const formData = new FormData();
    formData.append("file", this.files[0]);

    $.ajax({
      url: "uploadFile.php",
      type: "POST",
      data: formData,
      contentType: false,
      processData: false,
      success: function () {
        loadFiles();
      }
    });
  });

  // 6. Удаление
  $("#deleteBtn").click(function () {
    if (!selectedFile) return;
    if (!confirm("Удалить " + selectedFile + "?")) return;

    $.post("deleteFile.php", { name: selectedFile }, function () {
      loadFiles();
      $("#shareBtn, #deleteBtn").prop("disabled", true);
    });
  });

  // 7. Поделиться (пример)
  $("#shareBtn").click(function () {
    alert("Ссылка для доступа к файлу: /uploads/" + selectedFile);
  });
});



///password
feather.replace({ 'aria-hidden': 'true' });
$(".togglePassword").click(function (e) {
      e.preventDefault();
      var type = $(this).parent().parent().find(".password").attr("type");
      console.log(type);
      if(type == "password"){
          $("svg.feather.feather-eye").replaceWith(feather.icons["eye-off"].toSvg());
          $(this).parent().parent().find(".password").attr("type","text");
      }else if(type == "text"){
          $("svg.feather.feather-eye-off").replaceWith(feather.icons["eye"].toSvg());
          $(this).parent().parent().find(".password").attr("type","password");
      }
  });