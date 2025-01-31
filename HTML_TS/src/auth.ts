async function handleLogin(e: SubmitEvent) {
    e.preventDefault();

    const usernameInput = document.getElementById('username') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;

    const username: string = usernameInput.value.trim();
    const password: string = passwordInput.value.trim();

    usernameInput.value = '';
    passwordInput.value = '';

    try {
        const response = await fetch('http://localhost:3000/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username, password }),
        });

        const result = await response.json();

        if (result.success) {
            localStorage.setItem('accessToken', result.accessToken);
            (document.getElementById('login') as HTMLElement).style.display = 'none';
            (document.getElementById('app') as HTMLElement).style.display = 'block';
            fetchTodos();
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error('Error during login:', error);
    }
}

function handleLogout() {
    localStorage.removeItem('accessToken');
    (document.getElementById('login') as HTMLElement).style.display = 'block';
    (document.getElementById('app') as HTMLElement).style.display = 'none';
    alert('You have been logged out.');
}

function checkAuthOnLoad() {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        (document.getElementById('login') as HTMLElement).style.display = 'none';
        (document.getElementById('app') as HTMLElement).style.display = 'block';
        fetchTodos();
    } else {
        (document.getElementById('login') as HTMLElement).style.display = 'block';
        (document.getElementById('app') as HTMLElement).style.display = 'none';
    }
}