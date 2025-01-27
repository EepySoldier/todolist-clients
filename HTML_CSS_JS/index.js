let todosList = [];

const searchbar = document.getElementById('searchbar');

const app = document.getElementById('app');
const login = document.getElementById('login');

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    let username = document.getElementById('username').value.trim().toLowerCase();
    let password = document.getElementById('password').value.trim();

    document.getElementById('username').value = '';
    document.getElementById('password').value = '';

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
            todosList = result.todos.map(todo => [todo.name, todo.done]);
            renderTodos(todosList)
            login.style.display = 'none';
            app.style.display = 'block';
        } else {
            alert("Invalid username or password!");
        }
    } catch (error) {
        console.error("Error during login:", error);
    }
});

function renderTodos(_todos) {
    const todos = document.getElementById('todos');
    todos.innerHTML = '';

    //Todo[0] - name, Todo[1] - done
    _todos.forEach((todo) => {
        const todoDiv = document.createElement('div');
        todoDiv.classList.add('todo');

        const todoSpan = document.createElement('span');
        todoSpan.classList.add('todo-name')
        todoSpan.textContent = todo[0];

        const todoCheckbox = document.createElement('input');
        todoCheckbox.type = 'checkbox';
        todoCheckbox.checked = todo[1]

        if (todoCheckbox.checked) {
            todoSpan.style.color = 'gray';
            todoSpan.style.textDecoration = 'line-through';
        }

        todoCheckbox.addEventListener("click", () => {
            todo[1] = !todo[1]
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

            modalInput.value = todo[0].trim();
            modal.style.display = 'block';

            modalSave.onclick = () => {
                const updatedName = modalInput.value.trim();

                if (!updatedName) {
                    alert("Todo name cannot be empty.");
                    return;
                }

                const isDuplicate = todosList.some(Todo => Todo[0] === updatedName);

                if (isDuplicate) {
                    alert("A todo with this name already exists. Please use a different name.");
                    return;
                }

                todosList = todosList.map(Todo => {
                    if (Todo[0] === todo[0]) {
                        return [updatedName, Todo[1]];
                    }
                    return Todo;
                });

                renderTodos(todosList);
                modal.style.display = 'none';
            };
            modalCancel.onclick = () => {
                modal.style.display = 'none';
            }
            modalDelete.onclick = () => {
                todosList = todosList.filter(Todo => Todo[0] !== todo[0]);

                renderTodos(todosList);
                modal.style.display = 'none';
            }
        });

        todoDiv.appendChild(todoSpan);
        todoDiv.appendChild(todoCheckbox);

        todos.appendChild(todoDiv);
    });
}

const todoAdd = document.getElementById('todo-add');
todoAdd.addEventListener('click', () => {
    const todoName = searchbar.value.toString();

    if(todoName === ''){
        alert("Todo name can't be empty");
        return;
    }

    const isDuplicate = todosList.some(Todo => Todo[0] === todoName);
    if (isDuplicate) {
        alert("A todo with this name already exists. Please use a different name.");
        searchbar.value = '';
        return;
    }

    todosList = [...todosList, [todoName, false]]
    renderTodos(todosList)
    searchbar.value = '';
})

const searchButton = document.getElementById('search-button');
searchButton.addEventListener('click', () => {
    const value = searchbar.value.toString();
    if(value === ''){
        renderTodos(todosList)
    } else {
        const newTodos = todosList.filter(todo => {
            return todo.includes(value)
        })
        renderTodos(newTodos)
    }
    searchbar.value = '';
})

const saveButton = document.getElementById('save-button');
saveButton.addEventListener('click', async () => {
    try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await fetch('http://localhost:3000/todos/save', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({todos: todosList})
        });

        if (response.ok) {
            alert("Todos saved successfully");
        } else {
            alert("Token expired, log in again.");
            login.style.display = 'block';
            app.style.display = 'none';
        }
    } catch (error) {
        console.error("Error saving todos: ", error);
    }
})

const logoutButton = document.getElementById('logout-button');
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
                    'Authorization': `Bearer ${accessToken}`,
                }
            });

            if (response.ok) {
                const result = await response.json();
                todosList = result.todos.map(todo => [todo.name, todo.done]);
                renderTodos(todosList);
                login.style.display = 'none';
                app.style.display = 'block';
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