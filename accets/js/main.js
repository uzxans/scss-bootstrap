//darkMode
document.addEventListener("DOMContentLoaded", function () {
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const themeIcon = document.getElementById("themeIcon");
  const body = document.body;

  // Загружаем сохранённую тему
  const savedTheme = localStorage.getItem("theme") || "light";
  body.classList.add(savedTheme + "-theme");

  // Устанавливаем иконку в зависимости от темы
  function updateIcon(theme) {
    if (theme === "dark") {
      themeIcon.classList.remove("sun-icon");
      themeIcon.classList.add("moon-icon");
    } else {
      themeIcon.classList.remove("moon-icon");
      themeIcon.classList.add("sun-icon");
    }
  }
  updateIcon(savedTheme);

  // Переключение темы по клику
  themeToggleBtn.addEventListener("click", () => {
    let newTheme;
    if (body.classList.contains("light-theme")) {
      body.classList.replace("light-theme", "dark-theme");
      newTheme = "dark";
    } else {
      body.classList.replace("dark-theme", "light-theme");
      newTheme = "light";
    }
    localStorage.setItem("theme", newTheme);
    updateIcon(newTheme);
  });
});


document.addEventListener('DOMContentLoaded', () => {
  // Function to check screen size and remove activeSidebar if needed
  const checkScreenSize = () => {
    const desktopSidebar = document.querySelector('.sidebar');
    if (window.innerWidth < 1023 && desktopSidebar.classList.contains('activeSidebar')) {
      desktopSidebar.classList.remove('activeSidebar');
      localStorage.setItem('desktopSidebarActive', 'false');
    }
  };

  // Load sidebar states from localStorage
  const desktopSidebar = document.querySelector('.sidebar');
  const isDesktopActive = localStorage.getItem('desktopSidebarActive') === 'true';
  if (isDesktopActive) {
    desktopSidebar.classList.add('activeSidebar');
  }

  const mobileSidebar = document.querySelector('.sidebar');
  const isMobileActive = localStorage.getItem('mobileSidebarActive') === 'true';
  if (isMobileActive) {
    mobileSidebar.classList.add('sidebar_activ_mob');
  }

  // Check screen size on initial load
  checkScreenSize();

  // Desktop sidebar toggle
  document.addEventListener('click', (e) => {
    if (e.target.closest('.btn_menu')) {
      const sidebar = e.target.closest('.sidebar');
      sidebar.classList.toggle('activeSidebar');
      // Save state to localStorage
      localStorage.setItem('desktopSidebarActive', sidebar.classList.contains('activeSidebar'));
    }
  });

  // Mobile sidebar toggle
  document.addEventListener('click', (e) => {
    if (e.target.closest('.btn_menu_mob')) {
      const sidebar = e.target.closest('.sidebar');
      sidebar.classList.toggle('sidebar_activ_mob');
      // Save state to localStorage
      localStorage.setItem('mobileSidebarActive', sidebar.classList.contains('sidebar_activ_mob'));
    }
  });

  // Listen for window resize events
  window.addEventListener('resize', checkScreenSize);
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


// Проверка поддержки sticky
const testEl = document.createElement('div');
testEl.style.position = 'sticky';
console.log('Sticky support:', testEl.style.position === 'sticky');

// Проверка высоты контейнеров
console.log('Column height:', document.querySelector('.board .column').offsetHeight);
console.log('Board height:', document.querySelector('.board').offsetHeight);


