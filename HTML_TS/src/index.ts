import { Todo, updateTodo, fetchTodos, toggleTodo, deleteTodo, addTodo, todos } from "./todos";
import { checkAuthOnLoad, handleLogin, handleLogout } from "./auth";
import { setupUIEventListeners, setupModalButtons, renderTodos } from "./ui";

document.addEventListener('DOMContentLoaded', async () => {
    checkAuthOnLoad();
    setupUIEventListeners();
});