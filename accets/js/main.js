


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
    // убираем класс у обоих контейнеров
    listUser.classList.remove("mobTable");
    board.classList.remove("mobTable");

    if (option5.checked) {
      board.classList.add("mobTable");
      localStorage.setItem("viewMode", "board");
    } else if (option6.checked) {
      listUser.classList.add("mobTable");
      localStorage.setItem("viewMode", "list");
    }
  }

  // слушатели переключения
  option5.addEventListener("change", toggleMobTable);
  option6.addEventListener("change", toggleMobTable);

  // при загрузке страницы смотрим сохранённое значение
  window.addEventListener("DOMContentLoaded", () => {
    const saved = localStorage.getItem("viewMode");

    if (saved === "board") {
      option5.checked = true;
    } else if (saved === "list") {
      option6.checked = true;
    } else {
      // если ничего нет, по умолчанию board
      option5.checked = true;
    }

    toggleMobTable();
  });

///END Переключатель карточки 




// ====================
// Переменные DOM
// ====================
const filterInput = document.getElementById("filterInput");
const dropdown = document.getElementById("dropdown");
const toggleBtn = document.getElementById("toggleBtn");
const tabs = document.querySelectorAll(".tabs button");
const tabContents = document.querySelectorAll(".tab-content");
const tagsContainer = document.getElementById("tags");

// Активные фильтры
let activeFilters = {
  status: [],
  object: [],
  metro: [],
  hr: [],
  name: [],
  phone: [],
  date: []
};

// Ссылка на flatpickr-инстанс
let datePicker = null;

// ====================
// Функция нормализации даты
// Принимает только "YYYY-MM-DD"
// Возвращает объект Date или null
// ====================
function normalizeDate(str) {
  if (!str || !/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    return null;
  }
  
  const [y, m, d] = str.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  if (isNaN(date.getTime())) {
    return null;
  }
  return date;
}

// ====================
// flatpickr для даты (range)
// ====================
datePicker = flatpickr("#daterange", {
  mode: "range",
  dateFormat: "Y-m-d",
  locale: "ru",
  onChange: function (selectedDates, dateStr, instance) {
    if (selectedDates.length === 2) {
      const from = instance.formatDate(selectedDates[0], "Y-m-d");
      const to = instance.formatDate(selectedDates[1], "Y-m-d");
      const value = `${from} — ${to}`;
      const tab = instance.input.closest(".tab-content").id;

      // Сохраняем фильтр перед добавлением тега
      activeFilters.date = [{ from, to }];
      addTag(value, tab);
      renderBoard();
    } else {
    }
  }
});

// ====================
// Открытие/закрытие фильтра
// ====================
filterInput.addEventListener("click", (e) => {
  e.stopPropagation();
  dropdown.classList.add("open");
  
});
toggleBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  dropdown.classList.toggle("open");

});
document.addEventListener("click", (e) => {
  const closeBtn = document.querySelector(".closeFilter");
  if (
    (!filterInput.contains(e.target) && !dropdown.contains(e.target)) ||
    (closeBtn && closeBtn.contains(e.target))
  ) {
    dropdown.classList.remove("open");
  }
});

// ====================
// Табы
// ====================
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    tabContents.forEach(c => c.classList.remove("active"));
    document.getElementById(tab.dataset.tab).classList.add("active");
   
  });
});

// ====================
// Управление фильтрами (общие обработчики)
// ====================
document.querySelectorAll(".option").forEach(option => {
  option.addEventListener("click", () => {
    const value = option.dataset.value;
    const tab = option.closest(".tab-content").id;
    const text = option.textContent.trim();
    handleSelection(value, tab, text); // добавляем text как третий параметр
  });
});

function handleSelection(value, tab, text) {
  if (tab === "date") return;

  if (!activeFilters[tab]) activeFilters[tab] = [];

  if (value === "Все" || value === "Выбрать" || !value) {
    activeFilters[tab] = [];
    clearTags(tab);
  } else if (!activeFilters[tab].includes(value)) {
    activeFilters[tab].push(value);
    addTag(value, tab, text); // теперь text используется только если передан
  }

  renderBoard();
}


// select -> change
document.querySelectorAll(".tab-content select").forEach(select => {
  select.addEventListener("change", () => {
    const selected = select.options[select.selectedIndex];
    const value = selected.dataset.value || selected.value;
    const tab = select.closest(".tab-content").id;
    
    handleSelection(value, tab);
  });
});

// input в табах (кроме flatpickr)
document.querySelectorAll(".tab-content input:not(.flatpickr-input)").forEach(input => {
  input.addEventListener("change", () => {
    const value = input.value.trim();
    const tab = input.closest(".tab-content").id;
    handleSelection(value, tab);
  });
});

// ====================
// Теги (add / remove / clear)
// ====================
function addTag(value, tab, text) {
  if ([...tagsContainer.children].some(tag => 
    tag.dataset.value === value &&
    tag.dataset.tab === tab &&
    tag.dataset.text === text
)) {
    return;
}

  
  const tag = document.createElement("div");
  console.log(tag);
  tag.className = "tag";
  tag.dataset.value = value;
  tag.dataset.tab = tab;
  tag.dataset.text = text;
  tag.innerHTML = `${text || value} <span class="remove">×</span>`;


  tag.querySelector(".remove").addEventListener("click", () => {
    tag.remove();

    if (tab === "date") {
      activeFilters.date = [];
      if (datePicker) datePicker.clear();
    } else {
      activeFilters[tab] = (activeFilters[tab] || []).filter(v => v !== value);

    }

    renderBoard();
  });

  tagsContainer.appendChild(tag);
}

function clearTags(tab) {
  [...tagsContainer.children]
    .filter(tag => tag.dataset.tab === tab)
    .forEach(tag => {
      tag.remove();
      
    });

  if (tab === "date") activeFilters.date = [];
  else activeFilters[tab] = [];
 
}

// ====================
// Рендер (фильтрация карточек)
// ====================
function renderBoard() {
 
  document.querySelectorAll(".card").forEach(card => {
    const cardId = card.dataset.id || 'unknown';
   
    const status = card.dataset.status || '';
    const name = card.querySelector("[data-name]")?.dataset.name || "";
    const phone = card.querySelector("[data-phone]")?.dataset.phone || "";
    const object = card.querySelector("[data-object]")?.dataset.object || "";
    const hr = card.querySelector("[data-hr]")?.dataset.hr || "";
    const metro = card.querySelector("[data-metro]")?.dataset.metro || "";
    const date = card.querySelector("[data-date]")?.dataset.date || "";

    let visible = true;

    if (activeFilters.status.length && !activeFilters.status.includes(status)) {
      visible = false;
    }
    if (activeFilters.name.length && !activeFilters.name.some(n => name.toLowerCase().includes(n.toLowerCase()))) {
      visible = false;
    }
    if (activeFilters.phone.length && !activeFilters.phone.some(p => phone.includes(p))) {
       visible = false;
    }
    if (activeFilters.object.length && !activeFilters.object.includes(object)) {
       visible = false;
    }
    if (activeFilters.hr.length && !activeFilters.hr.includes(hr)) {
      visible = false;
    }
    if (activeFilters.metro.length && !activeFilters.metro.includes(metro)) {
       visible = false;
    }

    // Проверка даты по диапазону
    if (activeFilters.date.length) {
      const { from, to } = activeFilters.date[0] || {};

      const cardDate = normalizeDate(date);
      const fromDate = normalizeDate(from);
      const toDate = normalizeDate(to);

      if (!cardDate || !fromDate || !toDate) {
      
        visible = false;
      } else {
        const isInRange = cardDate >= fromDate && cardDate <= toDate;
         if (!isInRange) {
          visible = false;
        }
      }
    } 
    card.style.display = visible ? "" : "none";
  });

  // Скрывать колонки без карточек
  document.querySelectorAll(".column").forEach(col => {
    const colStatus = col.dataset.status || 'unknown';
    const hasVisible = [...col.querySelectorAll(".card")].some(c => c.style.display !== "none");
    col.style.display = hasVisible ? "" : "none";
  });

}

// ====================
// Drag & Drop
// ====================
document.querySelectorAll(".card").forEach(card => {
  card.draggable = true;
  card.addEventListener("dragstart", e => {
    if (!card.dataset.id) card.dataset.id = Math.random().toString(36).substr(2, 9);
    e.dataTransfer.setData("id", card.dataset.id);
  });
});
document.querySelectorAll(".column").forEach(col => {
  col.addEventListener("dragover", e => {
    e.preventDefault();
  });
  col.addEventListener("drop", e => {
    const id = e.dataTransfer.getData("id");
    const card = document.querySelector(`.card[data-id="${id}"]`);
    if (card) {
      card.dataset.status = col.dataset.status;
      col.querySelector(".cards").appendChild(card);
      renderBoard();
    } else {
    }
  });
});

// Стартовый рендер
renderBoard();




///Scroll

document.addEventListener('DOMContentLoaded', function() {
  const board = document.querySelector('.board');
  const leftBtn = document.querySelector('.left-btn');
  const rightBtn = document.querySelector('.right-btn');
  
  // Функция для проверки видимости кнопок
  function checkScroll() {
    leftBtn.style.opacity = board.scrollLeft > 0 ? '1' : '0';
    rightBtn.style.opacity = board.scrollLeft < board.scrollWidth - board.clientWidth ? '1' : '0';
  }
  
  // Обработчики для кнопок
  leftBtn.addEventListener('click', () => {
    board.scrollBy({ left: -332, behavior: 'smooth' });
  });
  
  rightBtn.addEventListener('click', () => {
    board.scrollBy({ left: 332, behavior: 'smooth' });
  });
  
  // Проверяем скролл при загрузке и прокрутке
  board.addEventListener('scroll', checkScroll);
  window.addEventListener('resize', checkScroll);
  checkScroll(); // начальная проверка
});