
document.addEventListener('DOMContentLoaded', () => {
    const loginBox = document.getElementById('loginBox');
    const registerBox = document.getElementById('registerBox');
    const showRegisterBtn = document.getElementById('showRegister');
    const showLoginBtn = document.getElementById('showLogin');

    if (showRegisterBtn && showLoginBtn && loginBox && registerBox) {
        showRegisterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            loginBox.classList.add('hidden');
            
            setTimeout(() => {
                registerBox.classList.remove('hidden');
            }, 50);
        });

        showLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            registerBox.classList.add('hidden');
            
            setTimeout(() => {
                loginBox.classList.remove('hidden');
            }, 50);
        });
    }

    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Login implementation coming soon!');
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Registration implementation coming soon!');
        });
    }
});
