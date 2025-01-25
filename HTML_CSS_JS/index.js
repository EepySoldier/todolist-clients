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

    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    if(username === credentials.username && password === credentials.password){
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

