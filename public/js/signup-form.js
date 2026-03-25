const signup_form = document.getElementById('signup-form');

signup_form.addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent form submission

    // Get form values
    const username = document.getElementById('username-input').value.trim();
    const email = document.getElementById('email-input').value.trim();
    const password = document.getElementById('password-input').value;
    const confirmPassword = document.getElementById('confirm-password-input').value;

    console.log('Username:', username);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Confirm Password:', confirmPassword);

    if (!username || !email || !password || !confirmPassword) {
        let errorMessage = document.getElementById('error-message');
        errorMessage.textContent = 'Please fill in all fields';
        errorMessage.style.display = 'block';
        return;
    }
    else if (password !== confirmPassword) {
        let errorMessage = document.getElementById('error-message');
        errorMessage.textContent = 'Passwords do not match';
        errorMessage.style.display = 'block';
        return;
    }

    //Still need to add function to send data to backend and store in SQL database
    try{
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password
            })
        });

        const data = await response.json();
        console.log('Response status:', response.status);
        console.log('Response data:', data);

        if (response.ok) {
            // Signup successful, redirect to login page
            window.location.href = '/public/pages/login.html';
        }        
        else {
            let errorMessage = document.getElementById('error-message');
            errorMessage.textContent = data.error || 'An error occurred while signing up. Please try again.';
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Error signing up:', error);
            let errorMessage = document.getElementById('error-message');
            errorMessage.textContent = 'An error occurred while signing up. Please try again.';
            errorMessage.style.display = 'block';
    }
});
