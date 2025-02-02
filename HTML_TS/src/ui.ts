import { Todo, toggleTodo, addTodo, deleteTodo, updateTodo, todos} from "./todos.js";
import { handleLogin, handleLogout } from "./auth.js";

export function renderTodos(todos: Todo[]) {
    const todoListContainer = document.getElementById('todos') as HTMLElement;
    todoListContainer.innerHTML = '';

    todos.forEach((todo) => {
        const todoDiv = document.createElement('div');
        todoDiv.classList.add('todo');

        const todoSpan = document.createElement('span');
        todoSpan.classList.add('todoName');
        todoSpan.textContent = todo.name;
        todoSpan.addEventListener('click', () => setupModalButtons(todo));

        const todoCheckbox = document.createElement('input');
        todoCheckbox.type = 'checkbox';
        todoCheckbox.checked = todo.done;
        todoCheckbox.addEventListener('click', () => toggleTodo(todo));

        todoDiv.appendChild(todoSpan);
        todoDiv.appendChild(todoCheckbox);
        todoListContainer.appendChild(todoDiv);
    });
}

export function setupModalButtons(todo: Todo) {
    const modal = document.getElementById('edit-modal') as HTMLElement;
    const modalInput = document.getElementById('modal-input') as HTMLInputElement;
    const modalSave = document.getElementById('modal-save') as HTMLElement;
    const modalDelete = document.getElementById('modal-delete') as HTMLElement;
    const modalCancel = document.getElementById('modal-cancel') as HTMLElement;

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

export function setupUIEventListeners() {
    (document.getElementById('todo-add') as HTMLElement).addEventListener('click', () => {
        const todoName = (document.getElementById('searchbar') as HTMLInputElement).value.trim();
        addTodo(todoName);
        (document.getElementById('searchbar') as HTMLInputElement).value = '';
    });

    (document.getElementById('search-button') as HTMLElement).addEventListener('click', () => {
       const value = (document.getElementById('searchbar') as HTMLInputElement).value.trim();
       renderTodos(todos.filter((todo: Todo) => todo.name.includes(value)));
    });

    (document.getElementById('logout-button') as HTMLElement).addEventListener('click', handleLogout);

    (document.getElementById('login-form') as HTMLFormElement).addEventListener('submit', async (e) => {
        await handleLogin(e);
    });
}