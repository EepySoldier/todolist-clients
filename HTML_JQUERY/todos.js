let todos = [];

function fetchTodos() {
    const accessToken = localStorage.getItem('accessToken');
    $.ajax({
        url: 'http://localhost:3000/todos/fetch',
        method: 'GET',
        headers: { 'Authorization': accessToken },
        dataType: 'json',
        success: function(result) {
            todos = result.todos;
            renderTodos(todos);
        },
        error: function(xhr) {
            localStorage.removeItem('accessToken');
            $('#login').show();
            $('#app').hide();
            console.error('Error fetching todos:', xhr.responseText);
        }
    });
}

function addTodo(todoName) {
    if (!todoName) return alert("Todo name can't be empty");

    const accessToken = localStorage.getItem('accessToken');
    $.ajax({
        url: 'http://localhost:3000/todos/add',
        method: 'POST',
        headers: { 'Authorization': accessToken },
        contentType: 'application/json',
        data: JSON.stringify({ name: todoName }),
        dataType: 'json',
        success: function(result) {
            todos.push({ name: todoName, done: false });
            renderTodos(todos);
        },
        error: function(xhr) {
            alert(xhr.responseJSON?.error || 'Error adding todo');
        }
    });
}

function toggleTodo(todo) {
    const accessToken = localStorage.getItem('accessToken');
    $.ajax({
        url: 'http://localhost:3000/todos/toggle',
        method: 'PATCH',
        headers: { 'Authorization': accessToken },
        contentType: 'application/json',
        data: JSON.stringify({ name: todo.name, done: !todo.done }),
        dataType: 'json',
        success: function(result) {
            todo.done = !todo.done;
            renderTodos(todos);
        },
        error: function(xhr) {
            alert(xhr.responseJSON?.error || 'Error toggling todo');
        }
    });
}

function updateTodo(oldName, newName) {
    const accessToken = localStorage.getItem('accessToken');
    $.ajax({
        url: 'http://localhost:3000/todos/update',
        method: 'PATCH',
        headers: { 'Authorization': accessToken },
        contentType: 'application/json',
        data: JSON.stringify({ oldName, newName }),
        dataType: 'json',
        success: function(result) {
            const todoToUpdate = todos.find(todo => todo.name === oldName);
            if (todoToUpdate) todoToUpdate.name = newName;
            renderTodos(todos);
        },
        error: function(xhr) {
            alert(xhr.responseJSON?.error || 'Error updating todo');
        }
    });
}

function deleteTodo(todoName) {
    const accessToken = localStorage.getItem('accessToken');
    $.ajax({
        url: `http://localhost:3000/todos/delete?name=${encodeURIComponent(todoName)}`,
        method: 'DELETE',
        headers: { 'Authorization': accessToken },
        dataType: 'json',
        success: function(result) {
            todos = todos.filter(todo => todo.name !== todoName);
            renderTodos(todos);
        },
        error: function(xhr) {
            alert(xhr.responseJSON?.error || 'Error deleting todo');
        }
    });
}
