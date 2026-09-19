// 待辦清單資料的儲存鍵值
const STORAGE_KEY = 'todo-list-items';
const THEME_STORAGE_KEY = 'todo-theme-preference';

// 取得頁面中的 DOM 節點
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const remainingCount = document.getElementById('remaining-count');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('.theme-icon');
const themeText = themeToggle.querySelector('.theme-text');
const filterButtons = document.querySelectorAll('.filter-btn');

let activeFilter = 'all';

// 從 localStorage 讀取資料，若資料不存在則回傳空陣列
function loadTodos() {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : [];
  } catch (error) {
    console.error('讀取代辦資料失敗:', error);
    return [];
  }
}

// 將資料存回 localStorage
function saveTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// 取得預設主題：若使用者有存過偏好，直接使用；否則依照作業系統設定
function getPreferredTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// 設定 html/body 的資料屬性，並更新按鈕顯示文字
function applyTheme(theme) {
  document.body.setAttribute('data-theme', theme);

  const isDarkMode = theme === 'dark';
  themeIcon.textContent = isDarkMode ? '☀️' : '🌙';
  themeText.textContent = isDarkMode ? '淺色模式' : '深色模式';
  themeToggle.setAttribute('aria-label', isDarkMode ? '切換至淺色模式' : '切換至深色模式');
}

// 切換深色模式並持久化
function toggleTheme() {
  const currentTheme = document.body.getAttribute('data-theme') || 'light';
  const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

  localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  applyTheme(nextTheme);
}

// 讀取目前待辦清單資料
let todos = loadTodos();

// 依照目前篩選條件回傳資料
function getFilteredTodos() {
  switch (activeFilter) {
    case 'active':
      return todos.filter((todo) => !todo.done);
    case 'completed':
      return todos.filter((todo) => todo.done);
    default:
      return todos;
  }
}

// 重新渲染清單與統計資訊
function renderTodos() {
  todoList.innerHTML = '';

  const remaining = todos.filter((todo) => !todo.done).length;
  remainingCount.textContent = `未完成: ${remaining} 項`;

  const filteredTodos = getFilteredTodos();

  // 若整體沒有待辦事項，顯示總體提示文字
  if (todos.length === 0) {
    todoList.classList.add('hidden');
    emptyState.textContent = '還沒有任何待辦事項,新增一個吧!';
    emptyState.classList.remove('hidden');
    return;
  }

  // 若篩選後沒有符合條件的待辦事項，顯示對應提示
  if (filteredTodos.length === 0) {
    todoList.classList.add('hidden');
    emptyState.classList.remove('hidden');

    if (activeFilter === 'active') {
      emptyState.textContent = '目前沒有未完成的待辦事項。這些項目只是被篩選條件過濾掉，沒有被刪除。';
    } else if (activeFilter === 'completed') {
      emptyState.textContent = '目前沒有已完成的待辦事項。這些項目只是被篩選條件過濾掉，沒有被刪除。';
    } else {
      emptyState.textContent = '沒有符合條件的待辦事項。';
    }
    return;
  }

  todoList.classList.remove('hidden');
  emptyState.classList.add('hidden');

  // 建立每一筆待辦項目
  filteredTodos.forEach((todo) => {
    const item = document.createElement('li');
    item.className = `todo-item ${todo.done ? 'completed' : ''}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.done;
    checkbox.setAttribute('aria-label', `完成待辦: ${todo.text}`);
    checkbox.addEventListener('change', () => {
      toggleTodo(todo.id);
    });

    const text = document.createElement('span');
    text.className = 'todo-text';
    text.textContent = todo.text;

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'delete-btn';
    deleteButton.textContent = '刪除';
    deleteButton.setAttribute('aria-label', `刪除待辦: ${todo.text}`);
    deleteButton.addEventListener('click', () => {
      deleteTodo(todo.id);
    });

    item.appendChild(checkbox);
    item.appendChild(text);
    item.appendChild(deleteButton);
    todoList.appendChild(item);
  });
}

// 新增待辦事項
function addTodo() {
  const content = todoInput.value.trim();

  // 若內容為空白，直接忽略，不新增任何項目
  if (!content) {
    todoInput.focus();
    return;
  }

  todos.unshift({
    id: Date.now() + Math.random(),
    text: content,
    done: false,
  });

  saveTodos(todos);
  todoInput.value = '';
  todoInput.focus();
  renderTodos();
}

// 切換待辦事項完成狀態
function toggleTodo(id) {
  todos = todos.map((todo) => {
    if (todo.id === id) {
      return { ...todo, done: !todo.done };
    }
    return todo;
  });

  saveTodos(todos);
  renderTodos();
}

// 刪除待辦事項
function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos(todos);
  renderTodos();
}

// 變更目前篩選條件
function changeFilter(filterName) {
  activeFilter = filterName;

  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === activeFilter;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  renderTodos();
}

// 表單送出時新增待辦事項
todoForm.addEventListener('submit', (event) => {
  event.preventDefault();
  addTodo();
});

// 深色模式切換按鈕事件
themeToggle.addEventListener('click', toggleTheme);

// 篩選按鈕事件
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    changeFilter(button.dataset.filter);
  });
});

// 如果作業系統主題變更，且使用者尚未手動設定偏好，就同步更新
const systemThemeMatcher = window.matchMedia('(prefers-color-scheme: dark)');
systemThemeMatcher.addEventListener('change', (event) => {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

  if (!savedTheme) {
    applyTheme(event.matches ? 'dark' : 'light');
  }
});

// 初始載入時先套用主題與渲染畫面
applyTheme(getPreferredTheme());
renderTodos();
