// =========================================
// REGISTRATION FUNCTIONALITY (Supabase)
// =========================================

function initRegister() {
    const registerModal = document.getElementById("registerModal");
    const registerBtn = document.getElementById("registerBtn");
    const registerClose = document.querySelector(".register-close");
    const switchToLogin = document.getElementById("switchToLogin");

    // Open Register
    if (registerBtn) {
        registerBtn.onclick = (e) => {
            e.preventDefault();
            registerModal.style.display = "flex";
            const loginModal = document.getElementById("loginModal");
            if (loginModal) loginModal.style.display = "none";
        };
    }

    // Close register
    if (registerClose) {
        registerClose.onclick = () => registerModal.style.display = "none";
    }

    // Switch to login
    if (switchToLogin) {
        switchToLogin.onclick = (e) => {
            e.preventDefault();
            registerModal.style.display = "none";
            
            const loginModal = document.getElementById("loginModal");
            if (loginModal) {
                loginModal.style.display = "block";
            }
        };
    }

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
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) {
                value = value.slice(0, 11);
            }
            e.target.value = value;
        });

        phoneInput.addEventListener('keypress', (e) => {
            if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab') {
                e.preventDefault();
                alert("Numbers only! Please enter digits 0-9");
            }
        });
    }

    // Handle registration form submission with Supabase
    const registerForm = document.getElementById("newRegisterForm");
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const fullName = document.getElementById("regFullName").value.trim();
            const username = document.getElementById("regUsername").value.trim();
            const email = document.getElementById("regEmail").value.trim();
            const phone = document.getElementById("regPhone").value.trim();
            const password = document.getElementById("regPassword").value;
            const confirmPassword = document.getElementById("regConfirmPassword").value;

            // Validate phone number
            if (phone && !/^\d{11}$/.test(phone)) {
                alert("Phone number must be exactly 11 digits!");
                return;
            }

            // Validate passwords match
            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                return;
            }

            if (password.length < 6) {
                alert("Password must be at least 6 characters!");
                return;
            }

            try {
                // 1. Create account in Supabase Auth
                const { data, error } = await supabase.auth.signUp({
                    email: email,
                    password: password
                });

                if (error) {
                    alert("Registration failed: " + error.message);
                    return;
                }

                // 2. Save extra profile info to the profiles table
                if (data.user) {
                    const { error: profileError } = await supabase
                        .from('profiles')
                        .insert([
                            {
                                id: data.user.id,
                                full_name: fullName,
                                username: username,
                                email: email,
                                phone: phone || null
                            }
                        ]);

                    if (profileError) {
                        console.error("Profile error:", profileError);
                        alert("Account created but profile saving failed. You can still login.");
                    }
                }

                alert("Registration successful! Please check your email to confirm your account, then login.");
                registerModal.style.display = "none";

            } catch (err) {
                console.error(err);
                alert("Something went wrong. Please try again.");
            }
        });
    }

    // Toggle password visibility for both password fields
    const toggleIcons = document.querySelectorAll('.toggle-password');
    toggleIcons.forEach(icon => {
        icon.addEventListener('click', function() {
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
