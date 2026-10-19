// =========================================
// REGISTRATION FUNCTIONALITY
// =========================================

function initRegister() {
    const registerModal = document.getElementById("registerModal");
    const registerBtn = document.getElementById("registerBtn");
    const registerClose = document.querySelector(".register-close");
    const switchToLogin = document.getElementById("switchToLogin");

    // Open Register
    registerBtn.onclick = (e) => {
        e.preventDefault();
        registerModal.style.display = "flex";
        const loginModal = document.getElementById("loginModal");
        if (loginModal) loginModal.style.display = "none";
    };

    // Close register
    registerClose.onclick = () => registerModal.style.display = "none";

    // Switch to login
    switchToLogin.onclick = (e) => {
        e.preventDefault();
        registerModal.style.display = "none";
        
        // Open login modal directly
        const loginModal = document.getElementById("loginModal");
        if (loginModal) {
            loginModal.style.display = "block";
        }
    };

    // Close when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === registerModal) {
            registerModal.style.display = "none";
        }
    });

    // Phone number validation - only numbers, max 11 digits
    const phoneInput = document.getElementById("regPhone");
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            // Remove any non-digit characters
            let value = e.target.value.replace(/\D/g, '');
            
            // Limit to 11 digits
            if (value.length > 11) {
                value = value.slice(0, 11);
            }
            
            e.target.value = value;
        });

        phoneInput.addEventListener('keypress', (e) => {
            // Only allow numbers
            if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab') {
                e.preventDefault();
                alert("Numbers only! Please enter digits 0-9");
            }
        });
    }

    // Handle registration form submission
    const registerForm = document.getElementById("newRegisterForm");
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = {
                fullName: document.getElementById("regFullName").value,
                username: document.getElementById("regUsername").value,
                email: document.getElementById("regEmail").value,
                phone: document.getElementById("regPhone").value,
                password: document.getElementById("regPassword").value,
                confirmPassword: document.getElementById("regConfirmPassword").value
            };

            // Validate phone number
            if (formData.phone && !/^\d{11}$/.test(formData.phone)) {
                alert("Phone number must be exactly 11 digits!");
                return;
            }

            // Validate passwords match
            if (formData.password !== formData.confirmPassword) {
                alert("Passwords do not match!");
                return;
            }

            // Add your registration logic here
            console.log("Registration attempt:", formData);
            alert("Registration successful - connect to your backend");
        });
    }

    // Toggle password visibility for both password fields
    const toggleIcons = document.querySelectorAll('.toggle-password');
    toggleIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            // Find the input field in the same input-wrapper
            const inputWrapper = this.closest('.input-wrapper');
            const input = inputWrapper.querySelector('input[type="password"], input[type="text"]');
            
            if (input) {
                if (input.type === 'password') {
                    input.type = 'text';
                } else {
                    input.type = 'password';
                }
            }
        });
    });
}

// Export for use in main.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initRegister };
}
