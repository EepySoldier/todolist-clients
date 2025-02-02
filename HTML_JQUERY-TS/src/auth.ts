import { fetchTodos } from "./todos.js";

type LoginResponse = {
    success: boolean;
    accessToken?: string;
    error?: string;
}

export function handleLogin(e: JQuery.SubmitEvent): void {
    e.preventDefault();

    const username = String($("#username").val()).trim();
    const password = String($("#password").val()).trim();

    $.ajax({
        url: "http://localhost:3000/users/login",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ username, password }),
        success: (result: LoginResponse) => {
            if (result.success) {
                if (result.accessToken) {
                    localStorage.setItem("accessToken", result.accessToken);
                    $("#login").hide();
                    $("#app").show();
                    fetchTodos();
                }
            } else {
                alert(result.error);
            }
        },
        error: (xhr) => {
            alert(xhr.responseJSON?.error || "Error logging in.");
        },
    });
}

export function handleLogout(): void {
    localStorage.removeItem("accessToken");
    $("#login").show();
    $("#app").hide();
    alert("You have been logged out.");
}

export function checkAuthOnLoad(): void {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
        $("#login").hide();
        $("#app").show();
        fetchTodos();
    } else {
        $("#login").show();
        $("#app").hide();
    }
}
