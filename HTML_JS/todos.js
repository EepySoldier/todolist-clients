let todos = [];

async function fetchTodos() {
    const accessToken = localStorage.getItem('accessToken');
    try {
        const response = await fetch('http://localhost:3000/todos/fetch', {
            method: 'GET',
            headers: { 'Authorization': `${accessToken}` },
        });

        const result = await response.json();
        if (response.ok) {
            todos = result.todos;
            renderTodos(todos);
        } else {
            localStorage.removeItem('accessToken');
            document.getElementById('login').style.display = 'block';
            document.getElementById('app').style.display = 'none';
        }
    } catch (error) {
        console.error('Error fetching todos:', error);
    }
}

async function addTodo(todoName) {
    if (!todoName) return alert("Todo name can't be empty");

    const accessToken = localStorage.getItem('accessToken');
    try {
        const response = await fetch('http://localhost:3000/todos/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',
                'Authorization': `${accessToken}`
            },
            body: JSON.stringify({ name: todoName }),
        });

        const result = await response.json();
        if (response.ok) {
            todos.push({ name: todoName, done: false });
            renderTodos(todos);
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error('Error adding todo:', error);
    }
}

async function toggleTodo(todo) {
    const accessToken = localStorage.getItem('accessToken');
    try {
        const response = await fetch('http://localhost:3000/todos/toggle', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${accessToken}`
            },
            body: JSON.stringify({ name: todo.name, done: !todo.done }),
        });

        const result = await response.json();
        if (response.ok) {
            todo.done = !todo.done;
            renderTodos(todos);
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error('Error toggling todo:', error);
    }
}

async function updateTodo(oldName, newName) {
    const accessToken = localStorage.getItem('accessToken');
    try {
        const response = await fetch('http://localhost:3000/todos/update', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${accessToken}`
            },
            body: JSON.stringify({ oldName, newName }),
        });

        const result = await response.json();
        if (response.ok) {
            const todoToUpdate = todos.find((todo) => todo.name === oldName);
            if (todoToUpdate) todoToUpdate.name = newName;
            renderTodos(todos);
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error('Error updating todo:', error);
    }
}

async function deleteTodo(todoName) {
    const accessToken = localStorage.getItem('accessToken');
    try {
        const response = await fetch(`http://localhost:3000/todos/delete?name=${encodeURIComponent(todoName)}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();
        if (response.ok) {
            todos = todos.filter((todo) => todo.name !== todoName);
            renderTodos(todos);
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error('Error deleting todo:', error);
    }
}