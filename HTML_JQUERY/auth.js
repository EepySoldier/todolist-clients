function handleLogin(e) {
    e.preventDefault();

    const username = $('#username').val().trim();
    const password = $('#password').val().trim();

    $.ajax({
        url: 'http://localhost:3000/users/login',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ username, password }),
        success: function(result) {
            if (result.success) {
                localStorage.setItem('accessToken', result.accessToken);
                $('#login').hide();
                $('#app').show();
                fetchTodos();
            } else {
                alert(result.error);
            }
        },
        error: function(xhr) {
            alert(xhr.responseJSON?.error || 'Error loggin in.');
        }
    });
}

function handleLogout() {
    localStorage.removeItem('accessToken');
    $('#login').show();
    $('#app').hide();
    alert('You have been logged out.');
}

function checkAuthOnLoad() {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        $('#login').hide();
        $('#app').show();
        fetchTodos();
    } else {
        $('#login').show();
        $('#app').hide();
    }
}