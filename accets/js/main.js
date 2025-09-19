


// const startDate = document.getElementById('start-date');
// const endDate = document.getElementById('end-date');

// startDate.addEventListener('change', function() {
//   endDate.min = this.value;
// });



document.addEventListener('click', (e) => {
  if (e.target.closest('.btn_menu')) {
    const sidebar = e.target.closest('.sidebar');
    sidebar.classList.toggle('activeSidebar');
  }
});


document.addEventListener('click', (e) => {
  if (e.target.closest('.btn_menu_mob')) {
    const sidebar = e.target.closest('.sidebar');
    sidebar.classList.toggle('sidebar_activ_mob');
  }
});




///Переключатель карточки 
const option5 = document.getElementById("option5");
const option6 = document.getElementById("option6");
const listUser = document.querySelector(".board");
const board = document.querySelector(".list_user");

function toggleMobTable() {
    listUser.classList.remove("mobTable");
    board.classList.remove("mobTable");

    if (window.innerWidth <= 480) {
        // Принудительно показываем список на мобильных
        listUser.classList.add("mobTable");
    } else if (option5.checked) {
        board.classList.add("mobTable");
        localStorage.setItem("viewMode", "board");
    } else if (option6.checked) {
        listUser.classList.add("mobTable");
        localStorage.setItem("viewMode", "list");
    }
}

function handleViewMode() {
    if (window.innerWidth <= 768) {
        // На мобильных скрываем переключатели или делаем их неактивными
        option5.disabled = true;
        option6.disabled = true;
        option6.checked = true;
    } else {
        // На десктопах восстанавливаем функциональность
        option5.disabled = false;
        option6.disabled = false;
        
        const saved = localStorage.getItem("viewMode");
        if (saved === "board") {
            option5.checked = true;
        } else if (saved === "list") {
            option6.checked = true;
        } else {
            option5.checked = true;
        }
    }
    toggleMobTable();
}

// Инициализация
window.addEventListener("DOMContentLoaded", handleViewMode);
window.addEventListener("resize", handleViewMode);

// Слушатели только для десктопов
option5.addEventListener("change", function() {
    if (window.innerWidth > 768) toggleMobTable();
});
option6.addEventListener("change", function() {
    if (window.innerWidth > 768) toggleMobTable();
});
///END Переключатель карточки 