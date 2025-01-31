import { fetchTodos } from "./todos";
export async function handleLogin(e) {
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
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        const result = await response.json();
        if (result.success) {
            localStorage.setItem('accessToken', result.accessToken);
            document.getElementById('login').style.display = 'none';
            document.getElementById('app').style.display = 'block';
            fetchTodos();
        }
        else {
            alert(result.error);
        }
    }
    catch (error) {
        console.error('Error during login:', error);
    }
}
export function handleLogout() {
    localStorage.removeItem('accessToken');
    document.getElementById('login').style.display = 'block';
    document.getElementById('app').style.display = 'none';
    alert('You have been logged out.');
}
export function checkAuthOnLoad() {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        document.getElementById('login').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        fetchTodos();
    }
    else {
        document.getElementById('login').style.display = 'block';
        document.getElementById('app').style.display = 'none';
    }
}
