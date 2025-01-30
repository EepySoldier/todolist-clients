const searchbar = document.getElementById('searchbar');
const app = document.getElementById('app');
const login = document.getElementById('login');
const todoListContainer = document.getElementById('todos');
const addTodoButton = document.getElementById('todo-add');
const searchButton = document.getElementById('search-button');
const logoutButton = document.getElementById('logout-button');

let todos = [];

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    usernameInput.value = '';
    passwordInput.value = '';

    try {
        const response = await fetch('http://localhost:3000/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username, password }),
        });

        const result = await response.json();

        if (result.success) {
            localStorage.setItem('accessToken', result.accessToken);
            todos = result.todos.map((todo) => ({ name: todo.name, done: todo.done }));
            renderTodos(todos);
            login.style.display = 'none';
            app.style.display = 'block';
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error('Error during login:', error);
    }
});

function renderTodos(todos) {
    todoListContainer.innerHTML = '';

    todos.forEach((todo) => {
        const todoDiv = document.createElement('div');
        todoDiv.classList.add('todo');

        const todoSpan = document.createElement('span');
        todoSpan.classList.add('todoName');
        todoSpan.textContent = todo.name;

        const todoCheckbox = document.createElement('input');
        todoCheckbox.type = 'checkbox';
        todoCheckbox.checked = todo.done;

        if (todoCheckbox.checked) {
            todoSpan.style.color = 'gray';
            todoSpan.style.textDecoration = 'line-through';
        }

        todoCheckbox.addEventListener('click', async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const response = await fetch('http://localhost:3000/todos/toggle', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${accessToken}`,
                    },
                    body: JSON.stringify({ name: todo.name, done: !todo.done }),
                });
                const result = await response.json();
                if (response.ok) {
                    todo.done = !todo.done;
                    if (todo.done) {
                        todoSpan.style.color = 'gray';
                        todoSpan.style.textDecoration = 'line-through';
                    } else {
                        todoSpan.style.color = 'white';
                        todoSpan.style.textDecoration = 'none';
                    }
                    alert(result.message);
                } else {
                    alert(result.error);
                }
            } catch (error) {
                console.error('Error toggling todo:', error);
            }
        });

        todoSpan.addEventListener('click', () => {
            const modal = document.getElementById('edit-modal');
            const modalInput = document.getElementById('modal-input');
            const modalSave = document.getElementById('modal-save');
            const modalDelete = document.getElementById('modal-delete');
            const modalCancel = document.getElementById('modal-cancel');

            modalInput.value = todo.name.trim();
            modal.style.display = 'block';

            modalSave.onclick = async () => {
                const updatedName = modalInput.value.trim();
                if (!updatedName) {
                    alert('Todo name cannot be empty.');
                    return;
                }

                const isDuplicate = todos.some((existingTodo) => existingTodo.name === updatedName);

                if (isDuplicate) {
                    alert('A todo with this name already exists. Please use a different name.');
                    return;
                }

                try {
                    const accessToken = localStorage.getItem('accessToken');
                    const response = await fetch('http://localhost:3000/todos/update', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `${accessToken}`,
                        },
                        body: JSON.stringify({ oldName: todo.name, newName: updatedName }),
                    });
                    const result = await response.json();
                    if (response.ok) {
                        const todoToUpdate = todos.find(existingTodo => existingTodo.name === todo.name);
                        if (todoToUpdate) {
                            todoToUpdate.name = updatedName;
                        }
                        renderTodos(todos);
                        modal.style.display = 'none';
                        alert(result.message);
                    } else {
                        alert(result.error);
                    }
                } catch (error) {
                    console.error('Error updating todo:', error);
                }
            };

            modalCancel.onclick = () => {
                modal.style.display = 'none';
            };

            modalDelete.onclick = async () => {

                try {
                    const accessToken = localStorage.getItem('accessToken');
                    const response = await fetch('http://localhost:3000/todos/delete', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `${accessToken}`,
                        },
                        body: JSON.stringify({ name: todo.name }),
                    });
                    const result = await response.json();
                    if (response.ok) {
                        todos = todos.filter((existingTodo) => existingTodo.name !== todo.name);
                        renderTodos(todos);
                        modal.style.display = 'none';
                        alert(result.message);
                    } else {
                        alert(result.error);
                    }
                } catch (error) {
                    console.error(error);
                }
            };
        });

        todoDiv.appendChild(todoSpan);
        todoDiv.appendChild(todoCheckbox);
        todoListContainer.appendChild(todoDiv);
    });
}

addTodoButton.addEventListener('click', async () => {
    const todoName = searchbar.value.trim();

    if (todoName === '') {
        alert("Todo name can't be empty");
        return;
    }

    const isDuplicate = todos.some((existingTodo) => existingTodo.name === todoName);
    if (isDuplicate) {
        alert('A todo with this name already exists. Please use a different name.');
        searchbar.value = '';
        return;
    }

    try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await fetch('http://localhost:3000/todos/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${accessToken}`,
            },
            body: JSON.stringify({ name: todoName }),
        });
        const result = await response.json();
        if (response.ok) {
            todos.push({ name: todoName, done: false });
            renderTodos(todos);
            searchbar.value = '';
            alert(result.message);
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error(error);
    }
});

searchButton.addEventListener('click', () => {
    const value = searchbar.value.trim();
    if (value === '') {
        renderTodos(todos);
    } else {
        const filteredTodos = todos.filter((todo) => todo.name.includes(value));
        renderTodos(filteredTodos);
    }
    searchbar.value = '';
});

logoutButton.addEventListener('click', () => {
    try {
        localStorage.removeItem('accessToken');
        login.style.display = 'block';
        app.style.display = 'none';
        alert('You have been logged out.');
    } catch (error) {
        console.error('Error during logout:', error);
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
        login.style.display = 'none';
        app.style.display = 'block';
        try {
            const response = await fetch('http://localhost:3000/todos/fetch', {
                method: 'GET',
                headers: {
                    'Authorization': `${accessToken}`,
                },
            });
            const result = await response.json();
            if (response.ok) {
                todos = result.todos.map((todo) => ({ name: todo.name, done: todo.done }));
                renderTodos(todos);
            } else {
                localStorage.removeItem('accessToken');
                login.style.display = 'block';
                app.style.display = 'none';
            }
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    } else {
        login.style.display = 'block';
        app.style.display = 'none';
    }
});