//TODO: Redo the login logic when a proper backend is made

const credentials = {
    username: "Jan",
    password: "123"
}

let todosList = ['Default Todo']

const searchbar = document.getElementById('searchbar');

const app = document.getElementById('app');
const login = document.getElementById('login');

document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();

    let username = document.getElementById('username').value.trim().toLowerCase();
    let password = document.getElementById('password').value.trim();

    if(username === credentials.username.toLowerCase() && password === credentials.password){
        login.style.display = 'none';
        app.style.display = 'block';
    }
})


function renderTodos(_todos) {
    const todos = document.getElementById('todos');
    todos.innerHTML = '';

    _todos.forEach((todoName) => {
        const todoDiv = document.createElement('div');
        todoDiv.classList.add('todo');

        const todoSpan = document.createElement('span');
        todoSpan.classList.add('todo-name')
        todoSpan.textContent = todoName;

        const todoCheckbox = document.createElement('input');
        todoCheckbox.type = 'checkbox';

        todoCheckbox.addEventListener("click", () => {
            if(todoSpan.style.textDecoration === "line-through") {
                todoSpan.style.color = "white";
                todoSpan.style.textDecoration = "none";
            } else {
                todoSpan.style.color = "gray";
                todoSpan.style.textDecoration = "line-through";
            }
        })

        todoSpan.addEventListener('click', () => {
            const modal = document.getElementById('editModal');
            const modalInput = document.getElementById('modalInput');
            const modalSave = document.getElementById('modalSave');
            const modalDelete = document.getElementById('modalDelete');
            const modalCancel = document.getElementById('modalCancel');

            modalInput.value = todoName.trim();
            modal.style.display = 'block';

            modalSave.onclick = () => {
                const updatedName = modalInput.value.trim();

                if (updatedName) {
                    todosList = todosList.map(todo => {
                       if(todo === todoName) {
                           return updatedName;
                       }
                       return todo;
                   })

                    renderTodos(todosList);
                }
                modal.style.display = 'none'; // Close modal
            };
            modalCancel.onclick = () => {
                modal.style.display = 'none';
            }
            modalDelete.onclick = () => {
                todosList = todosList.filter(todo => todo !== todoName);

                renderTodos(todosList);
                modal.style.display = 'none';
            }
        });

        todoDiv.appendChild(todoSpan);
        todoDiv.appendChild(todoCheckbox);

        todos.appendChild(todoDiv);
    });
}

renderTodos(todosList)

const todoAdd = document.getElementById('todo-add');

todoAdd.addEventListener('click', () => {
    const title = searchbar.value.toString();

    if(title === ''){
        alert("Todo name can't be empty");
        return;
    }

    todosList = [...todosList, title]
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



