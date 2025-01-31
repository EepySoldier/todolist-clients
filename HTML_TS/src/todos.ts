type Todo = {
    name: string;
    done: boolean;
};

let todos: Todo[] = [];

async function fetchTodos() {
    const accessToken = localStorage.getItem('accessToken');
    try {
        const response = await fetch('http://localhost:3000/todos/fetch', {
            method: 'GET',
            headers: {
                'Authorization': `${accessToken}`,
            },
        });
        const result = await response.json();
        if (response.ok) {
            todos = result.todos.map((todo: Todo) => ({ name: todo.name, done: todo.done }));
            renderTodos(todos);
        } else {
            localStorage.removeItem('accessToken');
            (document.getElementById('login') as HTMLElement).style.display = 'block';
            (document.getElementById('app') as HTMLElement).style.display = 'none';
        }
    } catch (error) {
        console.error('Error fetching todos:', error);
    }
}

async function addTodo(todoName: string) {
    if (!todoName) return alert("Todo name can't be empty");

    const accessToken = localStorage.getItem('accessToken');
    try {
        const response = await fetch('http://localhost:3000/todos/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${accessToken}`
            },
            body: JSON.stringify({ name: todoName }),
        });
        const result = await response.json();
        if (response.ok) {
            todos.push({ name: todoName, done: false });
            renderTodos(todos);
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error('Error adding todo:', error);
    }
}

async function toggleTodo(todo: Todo) {
    const accessToken = localStorage.getItem('accessToken');
    try {
        const response = await fetch('http://localhost:3000/todos/toggle', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${accessToken}`,
            },
            body: JSON.stringify({ name: todo.name, done: !todo.done }),
        });

        const result = await response.json();
        if (response.ok) {
            todo.done = !todo.done;
            renderTodos(todos);
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error('Error toggling todo:', error);
    }
}

async function updateTodo(oldName: string, newName: string) {
    const accessToken = localStorage.getItem('accessToken');
    try {
        const response = await fetch('http://localhost:3000/todos/update', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${accessToken}`,
            },
            body: JSON.stringify({ oldName, newName }),
        });

        const result = await response.json();
        if (response.ok) {
            const todoToUpdate = todos.find((todo) => todo.name === oldName);
            if (todoToUpdate) todoToUpdate.name = newName;
            renderTodos(todos);
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error('Error updating todo:', error);
    }
}

async function deleteTodo(todoName: string) {
    const accessToken = localStorage.getItem('accessToken');
    try {
        const response = await fetch('http://localhost:3000/todos/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${accessToken}`
            },
            body: JSON.stringify({ name: todoName }),
        });

        const result = await response.json();
        if (response.ok) {
            todos = todos.filter((todo) => todo.name !== todoName);
            renderTodos(todos);
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error('Error deleting todo:', error);
    }
}