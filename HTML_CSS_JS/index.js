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
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const result = await response.json();

        if (result.success) {
            localStorage.setItem('accessToken', result.accessToken)
            todos = result.todos.map(todo => ({name: todo.name, done: todo.done}));
            renderTodos(todos)
            login.style.display = 'none';
            app.style.display = 'block';
        } else {
            alert("Invalid username or password!");
        }
    } catch (error) {
        console.error("Error during login:", error);
    }
});

function renderTodos(todos) {
    todoListContainer.innerHTML = '';

    todos.forEach((todo) => {
        const todoDiv = document.createElement('div');
        todoDiv.classList.add('todo');

        const todoSpan = document.createElement('span');
        todoSpan.classList.add('todo-name')
        todoSpan.textContent = todo.name;

        const todoCheckbox = document.createElement('input');
        todoCheckbox.type = 'checkbox';
        todoCheckbox.checked = todo.done;

        if (todoCheckbox.checked) {
            todoSpan.style.color = 'gray';
            todoSpan.style.textDecoration = 'line-through';
        }

        todoCheckbox.addEventListener("click", () => {
            todo.done = !todo.done;
            if(todoSpan.style.textDecoration === "line-through") {
                todoSpan.style.color = "white";
                todoSpan.style.textDecoration = "none";
            } else {
                todoSpan.style.color = "gray";
                todoSpan.style.textDecoration = "line-through";
            }
        })

        todoSpan.addEventListener('click', () => {
            const modal = document.getElementById('edit-modal');
            const modalInput = document.getElementById('modal-input');
            const modalSave = document.getElementById('modal-save');
            const modalDelete = document.getElementById('modal-delete');
            const modalCancel = document.getElementById('modal-cancel');

            modalInput.value = todo.name.trim();
            modal.style.display = 'block';

            modalSave.onclick = () => {
                const updatedName = modalInput.value.trim();

                if (!updatedName) {
                    alert("Todo name cannot be empty.");
                    return;
                }

                const isDuplicate = todos.some(existingTodo => existingTodo.name === updatedName);

                if (isDuplicate) {
                    alert("A todo with this name already exists. Please use a different name.");
                    return;
                }

                todos = todos.map(existingTodo => {
                    if (existingTodo.name === todo.name) {
                        return { ...existingTodo, name: updatedName };
                    }
                    return existingTodo;
                });

                renderTodos(todos);
                modal.style.display = 'none';
            };
            modalCancel.onclick = () => {
                modal.style.display = 'none';
            }
            modalDelete.onclick = () => {
                todos = todos.filter(existingTodo => existingTodo.name !== todo.name);

                renderTodos(todos);
                modal.style.display = 'none';
            }
        });

        todoDiv.appendChild(todoSpan);
        todoDiv.appendChild(todoCheckbox);
        todoListContainer.appendChild(todoDiv);
    });
}

addTodoButton.addEventListener('click', () => {
    const todoName = searchbar.value.trim();

    if(todoName === ''){
        alert("Todo name can't be empty");
        return;
    }

    const isDuplicate = todos.some(existingTodo => existingTodo.name === todoName);
    if (isDuplicate) {
        alert("A todo with this name already exists. Please use a different name.");
        searchbar.value = '';
        return;
    }

    todos.push({ name: todoName, done: false });
    renderTodos(todos)
    searchbar.value = '';
})

searchButton.addEventListener('click', () => {
    const value = searchbar.value.trim();
    if (value === '') {
        renderTodos(todos)
    } else {
        const filteredTodos = todos.filter(todo => todo.name.includes(value));
        renderTodos(filteredTodos)
    }
    searchbar.value = '';
})

logoutButton.addEventListener('click', () => {
    try {
        localStorage.removeItem('accessToken');
        login.style.display = 'block';
        app.style.display = 'none';
        alert('You have been logged out.');
    } catch (error) {
        console.error('Error during logout:', error);
    }
})

document.addEventListener('DOMContentLoaded', async () => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
        login.style.display = 'none';
        app.style.display = 'block';
        try {
            const response = await fetch('http://localhost:3000/todos/fetch', {
                method: "GET",
                headers: {
                    'Authorization': `${accessToken}`,
                }
            });

            if (response.ok) {
                const result = await response.json();
                todos = result.todos.map(todo => ({ name: todo.name, done: todo.done}));
                renderTodos(todos);
            } else {
                alert('Session expired. Please log in again.');
                localStorage.removeItem('accessToken');
                login.style.display = 'block';
                app.style.display = 'none';
            }
        } catch (error) {
            console.error("Error fetching todos: ", error);
        }
    } else {
        login.style.display = 'block';
        app.style.display = 'none';
    }
});