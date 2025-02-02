import { Todo, toggleTodo, updateTodo, addTodo, deleteTodo, todos } from "./todos.js";
import { handleLogin, handleLogout } from "./auth.js";


export function renderTodos(todos: Todo[]): void {
    const todoListContainer = $("#todos");
    todoListContainer.empty();

    todos.forEach((todo) => {
        const todoDiv = $("<div>").addClass("todo");

        const todoSpan = $("<span>")
            .addClass("todoName")
            .text(todo.name)
            .on("click", () => setupModalButtons(todo));

        const todoCheckbox = $("<input>")
            .attr("type", "checkbox")
            .prop("checked", todo.done)
            .on("click", () => toggleTodo(todo));

        todoDiv.append(todoSpan).append(todoCheckbox);
        todoListContainer.append(todoDiv);
    });
}

export function setupModalButtons(todo: Todo): void {
    const modal = $("#edit-modal");
    const modalInput = $("#modal-input") as JQuery<HTMLInputElement>;
    const modalSave = $("#modal-save");
    const modalDelete = $("#modal-delete");
    const modalCancel = $("#modal-cancel");

    modalInput.val(todo.name.trim());
    modal.show();

    modalSave.off("click").on("click", async () => {
        await updateTodo(todo.name, modalInput.val() || "");
        modal.hide();
    });

    modalCancel.off("click").on("click", () => {
        modal.hide();
    });

    modalDelete.off("click").on("click", async () => {
        await deleteTodo(todo.name);
        modal.hide();
    });
}

export function setupUIEventListeners(): void {
    $("#todo-add").on("click", () => {
        const todoName = ($("#searchbar").val() as string).trim();
        if (todoName) {
            addTodo(todoName);
            $("#searchbar").val("");
        }
    });

    $("#search-button").on("click", () => {
        const value = ($("#searchbar").val() as string).trim();
        renderTodos(todos.filter((todo) => todo.name.includes(value)));
    });

    $("#logout-button").on("click", handleLogout);

    $("#login-form").on("submit", async (e) => {
        e.preventDefault();
        await handleLogin(e);
    });
}