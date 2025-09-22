const filters = {
    status: [],
    object: [],
    hr: [],
    date: { start: null, end: null },
    metro: null,
    name: null,
  };

  const tagContainer = document.getElementById("activeTags");
  const cards = document.querySelectorAll(".list_user_item");

  /** ========== ФУНКЦИЯ ФИЛЬТРАЦИИ ========== */
  function applyFilters() {
    cards.forEach(card => {
      let visible = true;

      // Фильтр по статусу
      if (filters.status.length > 0 && !filters.status.includes(card.dataset.status)) {
        visible = false;
      }

      // Фильтр по объекту
      const object = card.querySelector("[data-object]")?.dataset.object;
      if (filters.object.length > 0 && !filters.object.includes(object)) {
        visible = false;
      }

      // Фильтр по HR
      const hr = card.querySelector("[data-hr]")?.dataset.hr;
      if (filters.hr.length > 0 && !filters.hr.includes(hr)) {
        visible = false;
      }

      // Фильтр по диапазону дат
      if (filters.date.start || filters.date.end) {
        const dateStr = card.querySelector(".data")?.dataset.date;
        const cardDate = dateStr ? new Date(dateStr) : null;

        if (cardDate) {
          if (filters.date.start && cardDate < new Date(filters.date.start)) visible = false;
          if (filters.date.end && cardDate > new Date(filters.date.end)) visible = false;
        }
      }

      // Фильтр по метро
      if (filters.metro && card.querySelector("[data-metro]")?.dataset.metro !== filters.metro) {
        visible = false;
      }

      // Фильтр по имени
      if (filters.name) {
        const name = card.querySelector(".name h5")?.innerText.toLowerCase();
        if (!name.includes(filters.name.toLowerCase())) visible = false;
      }

      card.style.display = visible ? "" : "none";
    });
  }

  /** ========== ТЕГИ ФИЛЬТРОВ ========== */
  function addTag(type, value, label) {
    const tag = document.createElement("div");
    tag.classList.add("tag");
    tag.dataset.type = type;
    tag.dataset.value = value;
    tag.innerHTML = `${label} <span>&times;</span>`;

    tag.querySelector("span").addEventListener("click", () => {
      if (type === "date") {
        filters.date = { start: null, end: null };
        document.querySelector("#daterange").value = "";
      } else if (Array.isArray(filters[type])) {
        filters[type] = filters[type].filter(v => v !== value);
      } else {
        filters[type] = null;
      }

      tag.remove();

      document.querySelector(`.option[data-value="${value}"]`)?.classList.remove("active-filter");

      const select = document.querySelector(`select[data-type="${type}"]`);
      if (select) select.value = "Выбрать";

      if (type === "name") document.querySelector("#name input").value = "";

      applyFilters();
    });

    tagContainer.appendChild(tag);
  }

  /** ========== ОБРАБОТКА СТАТУСОВ ========== */
  document.querySelectorAll("#status .option").forEach(option => {
    option.addEventListener("click", () => {
      const type = "status";
      const value = option.dataset.value;
      const label = option.innerText;

      if (filters[type].includes(value)) {
        filters[type] = filters[type].filter(v => v !== value);
        option.classList.remove("active-filter");
        document.querySelector(`.tag[data-value="${value}"]`)?.remove();
      } else {
        filters[type].push(value);
        option.classList.add("active-filter");
        addTag(type, value, label);
      }
      applyFilters();
    });
  });

  /** ========== ОБРАБОТКА SELECT (object, hr) ========== */
  document.querySelectorAll("select").forEach(select => {
    select.dataset.type = select.closest(".tab-content").id;
    select.addEventListener("change", () => {
      const type = select.dataset.type;
      const value = select.selectedOptions[0]?.dataset.value;
      const label = select.selectedOptions[0]?.innerText;

      document.querySelectorAll(`.tag[data-type="${type}"]`).forEach(el => el.remove());
      filters[type] = [];

      if (value) {
        filters[type].push(value);
        addTag(type, value, label);
      }

      applyFilters();
    });
  });

  /** ========== ДАТА (ДИАПАЗОН) ========== */
  document.querySelector("#daterange").addEventListener("change", e => {
    const val = e.target.value.trim();

    document.querySelectorAll(`.tag[data-type="date"]`).forEach(el => el.remove());
    filters.date = { start: null, end: null };

    if (val.includes(" - ")) {
      const [start, end] = val.split(" - ");
      filters.date.start = start;
      filters.date.end = end;
      addTag("date", `${start}-${end}`, `Дата: ${start} → ${end}`);
    } else if (val) {
      filters.date.start = val;
      filters.date.end = val;
      addTag("date", val, `Дата: ${val}`);
    }

    applyFilters();
  });

  /** ========== ПОИСК ПО ИМЕНИ ========== */
  document.querySelector("#name input").addEventListener("input", e => {
    filters.name = e.target.value.trim() || null;

    document.querySelectorAll(`.tag[data-type="name"]`).forEach(el => el.remove());

    if (filters.name) addTag("name", filters.name, `Имя: ${filters.name}`);

    applyFilters();
  });