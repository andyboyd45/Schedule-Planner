const form = document.getElementById('login-form');

form.addEventListener('submit', async function(event) {
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

    try{
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const data = await response.json();
        console.log('Response status:', response.status);
        console.log('Response data:', data);

        if(response.ok){
            window.location.href = '/public/pages/home.html';
        }
        else{
            let errorMessage = document.getElementById('error-message');
            errorMessage.textContent = data.error;
            errorMessage.style.display = 'block';
        }

    }
    catch (error) {
        console.error('Error logging in:', error);
        let errorMessage = document.getElementById('error-message');
        errorMessage.textContent = 'Error on our side occured.  Please try again later.';
        errorMessage.style.display = 'block';        
    }


    
    //Add function to check if username and password match in database
});