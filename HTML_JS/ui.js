function renderTodos(todos) {
    const todoListContainer = document.getElementById('todos');
    todoListContainer.innerHTML = '';

    todos.forEach((todo) => {
        const todoDiv = document.createElement('div');
        todoDiv.classList.add('todo');

        const todoSpan = document.createElement('span');
        todoSpan.classList.add('todoName');
        todoSpan.textContent = todo.name;
        todoSpan.addEventListener('click', () => setupModalButtons(todo))

        const todoCheckbox = document.createElement('input');
        todoCheckbox.type = 'checkbox';
        todoCheckbox.checked = todo.done;
        todoCheckbox.addEventListener('click', () => toggleTodo(todo));

        todoDiv.appendChild(todoSpan);
        todoDiv.appendChild(todoCheckbox);
        todoListContainer.appendChild(todoDiv);
    });
}

function setupModalButtons(todo) {
    const modal = document.getElementById('edit-modal');
    const modalInput = document.getElementById('modal-input');
    const modalSave = document.getElementById('modal-save');
    const modalDelete = document.getElementById('modal-delete');
    const modalCancel = document.getElementById('modal-cancel');

    modalInput.value = todo.name.trim();
    modal.style.display = 'block';

    modalSave.onclick = async () => {
        await updateTodo(todo.name, modalInput.value);
        modal.style.display = 'none';
    };

    modalCancel.onclick = () => {
        modal.style.display = 'none';
    };

    modalDelete.onclick = async () => {
        await deleteTodo(todo.name);
        modal.style.display = 'none';
    };
}

function setupUIEventListeners() {
    document.getElementById('todo-add').addEventListener('click', () => {
        const todoName = document.getElementById('searchbar').value.trim();
        addTodo(todoName);
    });

    document.getElementById('search-button').addEventListener('click', () => {
        const value = document.getElementById('searchbar').value.trim();
        renderTodos(todos.filter((todo) => todo.name.includes(value)));
    });

    document.getElementById('logout-button').addEventListener('click', handleLogout);

    document.getElementById('login-form').addEventListener('submit', async (e) => {
        await handleLogin(e);
    });
}
