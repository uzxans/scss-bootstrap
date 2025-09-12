

flatpickr("#daterange", {
  mode: "range",
  dateFormat: "Y-m-d", // формат даты
  locale: "ru",        // русский язык
  onChange: function(selectedDates, dateStr, instance) {
    // selectedDates = массив выбранных дат
    if (selectedDates.length === 2) {
      // Формируем строку "от - до"
      const from = instance.formatDate(selectedDates[0], "Y-m-d");
      const to = instance.formatDate(selectedDates[1], "Y-m-d");
      const value = `${from} — ${to}`;

      // таб (например, "date")
      const tab = instance.input.closest(".tab-content").id;

      // отправляем в твою универсальную функцию
      handleSelection(value, tab);
    }
  }
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






const filterInput = document.getElementById("filterInput");
const dropdown = document.getElementById("dropdown");
const toggleBtn = document.getElementById("toggleBtn");
const tabs = document.querySelectorAll(".tabs button");
const tabContents = document.querySelectorAll(".tab-content");
const tagsContainer = document.getElementById("tags");

// наши карточки
const employees = [
  { id: 1, name: "Тимур", status: "Работает", object: "Обухова", metro: "Садовая" },
  { id: 2, name: "Мария", status: "Напомнить", object: "Виктория", metro: "Обухова" },
  { id: 3, name: "Алексей", status: "Резерв", object: "Обухова", metro: "Садовая" },
  { id: 4, name: "Ольга", status: "Уволен", object: "Виктория", metro: "Обухова" }
];

// активные фильтры
let activeFilters = { status: [], object: [], metro: [] };

// Открытие при клике на input или кнопку
filterInput.addEventListener("click", (e) => {
  e.stopPropagation();
  dropdown.classList.add("open");
});

toggleBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  dropdown.classList.toggle("open");
});

// Переключение табов
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    tabContents.forEach(c => c.classList.remove("active"));
    document.getElementById(tab.dataset.tab).classList.add("active");
  });
});

// Универсальная функция обработки выбора
function handleSelection(value, tab) {
  if (!activeFilters[tab]) activeFilters[tab] = [];

  if (value === "Все") {
    activeFilters[tab] = [];
    clearTags(tab);
  } else if (!activeFilters[tab].includes(value) && value !== "Выбрать") {
    activeFilters[tab].push(value);
    addTag(value, tab);
  }

  renderBoard();
}

// Вариант 1: если у тебя остаются клики по .option
document.querySelectorAll(".option").forEach(option => {
  option.addEventListener("click", () => {
    const value = option.dataset.value;
    const tab = option.closest(".tab-content").id;
    handleSelection(value, tab);
  });
});

// Вариант 2: универсально для всех <select>
document.querySelectorAll(".tab-content select").forEach(select => {
  select.addEventListener("change", () => {
    const selected = select.options[select.selectedIndex];
    const value = selected.dataset.value || selected.value; // приоритет data-value
    const tab = select.closest(".tab-content").id;
    handleSelection(value, tab);
  });
});

// Вариант 3: для <input>
document.querySelectorAll(".name input").forEach(input => {
  input.addEventListener("change", () => {
    const value = input.value.trim();
    const tab = input.closest(".name").id;
    handleSelection(value, tab);
  });
});


// Добавление тэга
function addTag(value, tab) {
  if ([...tagsContainer.children].some(tag => tag.dataset.value === value)) return;

  const tag = document.createElement("div");
  tag.className = "tag";
  tag.dataset.value = value;
  tag.dataset.tab = tab;
  tag.innerHTML = `${value} <span class="remove">×</span>`;

  tag.querySelector(".remove").addEventListener("click", () => {
    tag.remove();
    activeFilters[tab] = activeFilters[tab].filter(v => v !== value);
    renderBoard();
  });

  tagsContainer.appendChild(tag);
}

// Удаление всех тегов таба
function clearTags(tab) {
  [...tagsContainer.children]
    .filter(tag => tag.dataset.tab === tab)
    .forEach(tag => tag.remove());
}

// Закрытие при клике вне
document.addEventListener("click", (e) => {
  if (!filterInput.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.classList.remove("open");
  }
});

// ====================
// Рендер kanban доски
// ====================
function renderBoard() {
  document.querySelectorAll(".column .cards").forEach(c => c.innerHTML = "");

  employees.forEach(emp => {
    if (!passFilters(emp)) return;

    const col = document.querySelector(`.column[data-status="${emp.status}"] .cards`);
    if (!col) return;

    const card = document.createElement("div");
    card.className = "card";
    card.draggable = true;
    card.innerText = emp.name;
    card.dataset.id = emp.id;

    card.addEventListener("dragstart", e => {
      e.dataTransfer.setData("id", emp.id);
    });

    col.appendChild(card);
  });
}

// проверка фильтров
function passFilters(emp) {
  if (activeFilters.status.length && !activeFilters.status.includes(emp.status)) return false;
  if (activeFilters.object.length && !activeFilters.object.includes(emp.object)) return false;
  if (activeFilters.metro.length && !activeFilters.metro.includes(emp.metro)) return false;
  return true;
}

// Drag & Drop
document.querySelectorAll(".column").forEach(col => {
  col.addEventListener("dragover", e => e.preventDefault());
  col.addEventListener("drop", e => {
    const id = e.dataTransfer.getData("id");
    const emp = employees.find(e => e.id == id);
    emp.status = col.dataset.status;
    renderBoard();
  });
});



function renderBoard() {
  // очищаем карточки
  document.querySelectorAll(".column .cards").forEach(c => c.innerHTML = "");

  // показываем карточки
  employees.forEach(emp => {
    if (!passFilters(emp)) return;
    const col = document.querySelector(`.column[data-status="${emp.status}"] .cards`);
    if (!col) return;

    const card = document.createElement("div");
    card.className = "card";
    card.draggable = true;
    card.innerText = emp.name;
    card.dataset.id = emp.id;

    card.addEventListener("dragstart", e => {
      e.dataTransfer.setData("id", emp.id);
    });

    col.appendChild(card);
  });

  // 🔹 скрывать/показывать колонки по фильтру статуса
  document.querySelectorAll(".column").forEach(col => {
    if (activeFilters.status.length === 0 || activeFilters.status.includes(col.dataset.status)) {
      col.style.display = ""; // показать
    } else {
      col.style.display = "none"; // скрыть
    }
  });
}


// стартовый рендер
renderBoard();


