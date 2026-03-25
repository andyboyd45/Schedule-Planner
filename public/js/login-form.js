const form = document.getElementById('login-form');

form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const username = document.getElementById('username-input').value.trim();
    const password = document.getElementById('password-input').value;

    console.log('Username:', username);
    console.log('Password:', password);

    if (!username || !password) {
        let errorMessage = document.getElementById('error-message');
        errorMessage.textContent = 'Please fill in all fields';
        errorMessage.style.display = 'block';
        return;
    }
    
    //Add function to check if username and password match in database
});