// 待辦清單資料的儲存鍵值
const STORAGE_KEY = 'todo-list-items';

// 取得頁面中的 DOM 節點
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const remainingCount = document.getElementById('remaining-count');

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

// 讀取目前待辦清單資料
let todos = loadTodos();

// 重新渲染清單與統計資訊
function renderTodos() {
  todoList.innerHTML = '';

  const remaining = todos.filter((todo) => !todo.done).length;
  remainingCount.textContent = `未完成: ${remaining} 項`;

  // 若沒有待辦事項，顯示提示文字並隱藏列表
  if (todos.length === 0) {
    todoList.classList.add('hidden');
    emptyState.classList.remove('hidden');
    return;
  }

  todoList.classList.remove('hidden');
  emptyState.classList.add('hidden');

  // 建立每一筆待辦項目
  todos.forEach((todo) => {
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

// 表單送出時新增待辦事項
todoForm.addEventListener('submit', (event) => {
  event.preventDefault();
  addTodo();
});

// 初始載入時先渲染畫面
renderTodos();
