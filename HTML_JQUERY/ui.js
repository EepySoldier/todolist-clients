function renderTodos(todos) {
    const todoListContainer = $('#todos');
    todoListContainer.empty();

    todos.forEach((todo) => {
        const todoDiv = $('<div>').addClass('todo');

        const todoSpan = $('<span>').addClass('todoName').text(todo.name)
            .on('click', () => setupModalButtons(todo));

        const todoCheckbox = $('<input>').attr('type', 'checkbox').prop('checked', todo.done)
            .on('click', () => toggleTodo(todo));

        todoDiv.append(todoSpan).append(todoCheckbox);
        todoListContainer.append(todoDiv);
    });
}

function setupModalButtons(todo) {
    const modal = $('#edit-modal');
    const modalInput = $('#modal-input');
    const modalSave = $('#modal-save');
    const modalDelete = $('#modal-delete');
    const modalCancel = $('#modal-cancel');

    modalInput.val(todo.name.trim());
    modal.show();

    modalSave.off('click').on('click', async () => {
        await updateTodo(todo.name, modalInput.val());
        modal.hide();
    });

    modalCancel.off('click').on('click', () => {
        modal.hide();
    });

    modalDelete.off('click').on('click', async () => {
        await deleteTodo(todo.name);
        modal.hide();
    });
}

function setupUIEventListeners() {
    $('#todo-add').on('click', () => {
        const todoName = $('#searchbar').val().trim();
        addTodo(todoName);
        $('#searchbar').val('');
    });

    $('#search-button').on('click', () => {
        const value = $('#searchbar').val().trim();
        renderTodos(todos.filter((todo) => todo.name.includes(value)));
    });

    $('#logout-button').on('click', handleLogout);

    $('#login-form').on('submit', async (e) => {
        await handleLogin(e);
    });
}