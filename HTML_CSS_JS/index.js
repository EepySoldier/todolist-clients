let todosList = [["Default todo", false]];
let id = null;

const searchbar = document.getElementById('searchbar');

const app = document.getElementById('app');
const login = document.getElementById('login');

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    let username = document.getElementById('username').value.trim().toLowerCase();
    let password = document.getElementById('password').value.trim();

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
            todosList = result.todos.map(todo => [todo.name, todo.done]);
            id = result.uid;
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

                if (updatedName) {
                    todosList = todosList.map(Todo => {
                       if(Todo[0] === todo[0]) {
                           return [updatedName, Todo[1]];
                       }
                       return Todo;
                   })

                    renderTodos(todosList);
                }
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
    const title = searchbar.value.toString();

    if(title === ''){
        alert("Todo name can't be empty");
        return;
    }

    todosList = [...todosList, [title, false]]
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
        const response = await fetch('http://localhost:3000/todos/save', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({todos: todosList, UID: id})
        });

        if (response.ok) {
            alert("Todos saved successfully");
        } else {
            alert("Something went wrong");
        }
    } catch (error) {
        console.error("Error saving todos: ", error);
    }
})