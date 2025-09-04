

flatpickr("#daterange", {
  mode: "range", // выбор диапазона
  dateFormat: "d.m.Y", // формат даты
  locale: "ru" // русская локаль (подключает русский календарь)
});


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


