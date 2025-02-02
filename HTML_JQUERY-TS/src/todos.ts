import { renderTodos } from "./ui.js";

export type Todo = {
    name: string;
    done: boolean;
}

export let todos: Todo[] = [];

export function fetchTodos(): void {
    const accessToken = localStorage.getItem("accessToken");

    $.ajax({
        url: "http://localhost:3000/todos/fetch",
        method: "GET",
        headers: { Authorization: accessToken },
        dataType: "json",
        success: (result: { todos: Todo[] }) => {
            todos = result.todos;
            renderTodos(todos);
        },
        error: (xhr) => {
            localStorage.removeItem("accessToken");
            $("#login").show();
            $("#app").hide();
            console.error("Error fetching todos:", xhr.responseText);
        },
    });
}

export function addTodo(todoName: string): void {
    if (!todoName) return alert("Todo name can't be empty");

    const accessToken = localStorage.getItem("accessToken");

    $.ajax({
        url: "http://localhost:3000/todos/add",
        method: "POST",
        headers: { Authorization: accessToken },
        contentType: "application/json",
        data: JSON.stringify({ name: todoName }),
        dataType: "json",
        success: () => {
            todos.push({ name: todoName, done: false });
            renderTodos(todos);
        },
        error: (xhr) => {
            alert(xhr.responseJSON?.error || "Error adding todo");
        },
    });
}

export function toggleTodo(todo: Todo): void {
    const accessToken = localStorage.getItem("accessToken");

    $.ajax({
        url: "http://localhost:3000/todos/toggle",
        method: "PATCH",
        headers: { Authorization: accessToken },
        contentType: "application/json",
        data: JSON.stringify({ name: todo.name, done: !todo.done }),
        dataType: "json",
        success: () => {
            todo.done = !todo.done;
            renderTodos(todos);
        },
        error: (xhr) => {
            alert(xhr.responseJSON?.error || "Error toggling todo");
        },
    });
}

export function updateTodo(oldName: string, newName: string): void {
    const accessToken = localStorage.getItem("accessToken");

    $.ajax({
        url: "http://localhost:3000/todos/update",
        method: "PATCH",
        headers: { Authorization: accessToken },
        contentType: "application/json",
        data: JSON.stringify({ oldName, newName }),
        dataType: "json",
        success: () => {
            const todoToUpdate = todos.find((todo) => todo.name === oldName);
            if (todoToUpdate) todoToUpdate.name = newName;
            renderTodos(todos);
        },
        error: (xhr) => {
            alert(xhr.responseJSON?.error || "Error updating todo");
        },
    });
}

export function deleteTodo(todoName: string): void {
    const accessToken = localStorage.getItem("accessToken");

    $.ajax({
        url: `http://localhost:3000/todos/delete?name=${encodeURIComponent(todoName)}`,
        method: "DELETE",
        headers: { Authorization: accessToken },
        dataType: "json",
        success: () => {
            todos = todos.filter((todo) => todo.name !== todoName);
            renderTodos(todos);
        },
        error: (xhr) => {
            alert(xhr.responseJSON?.error || "Error deleting todo");
        },
    });
}