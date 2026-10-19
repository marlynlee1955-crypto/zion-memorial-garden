// =========================================
// LOGIN FUNCTIONALITY
// =========================================

function initLogin() {
    const loginModal = document.getElementById("loginModal");
    const loginBtn = document.getElementById("loginBtn");
    const loginClose = document.querySelector(".login-close");
    const showRegisterLink = document.getElementById("showRegisterLink");

    // Position the login dropdown
    function positionModal(modal, button) {
        const rect = button.getBoundingClientRect();
        modal.style.top = (rect.bottom + window.scrollY + 10) + "px";
        modal.style.left = (rect.right + window.scrollX - 320) + "px";
    }

    // Open Login from main header button
    if (loginBtn) {
        loginBtn.onclick = (e) => {
            e.stopPropagation();
            positionModal(loginModal, loginBtn);
            loginModal.style.display = "block";
            const registerModal = document.getElementById("registerModal");
            if (registerModal) registerModal.style.display = "none";
        };
    }

    // Open Login from popup page buttons
    const popupLoginBtns = document.querySelectorAll('.popup-login-btn');
    popupLoginBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            positionModal(loginModal, btn);
            loginModal.style.display = "block";
            const registerModal = document.getElementById("registerModal");
            if (registerModal) registerModal.style.display = "none";
        });
    });

    // Close login
    if (loginClose) {
        loginClose.onclick = () => loginModal.style.display = "none";
    }

    // Switch to register
    if (showRegisterLink) {
        showRegisterLink.onclick = (e) => {
            e.preventDefault();
            loginModal.style.display = "none";
            const registerModal = document.getElementById("registerModal");
            if (registerModal) registerModal.style.display = "flex";
        };
    }

    // Close when clicking outside
    window.addEventListener('click', (event) => {
        if (loginModal.style.display === "block" && 
            !loginModal.contains(event.target) && 
            event.target !== loginBtn) {
            loginModal.style.display = "none";
        }
    });

    // Handle login form submission
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById("loginEmail").value;
            const password = document.getElementById("loginPassword").value;
            const rememberMe = document.getElementById("rememberMe").checked;
            
            // Simple validation
            if (!email || !password) {
                alert("Please fill in all fields");
                return;
            }
            
            // Handle Remember Me functionality
            if (rememberMe) {
                // Store email and password in localStorage
                localStorage.setItem("rememberedEmail", email);
                localStorage.setItem("rememberedPassword", password);
                console.log("Email and password saved for next login");
            } else {
                // Clear remembered credentials
                localStorage.removeItem("rememberedEmail");
                localStorage.removeItem("rememberedPassword");
            }
            
            // Add your login logic here
            console.log("Login attempt:", { email, password, rememberMe });
            
            // Store user session (in real app, this would come from backend)
            sessionStorage.setItem("isLoggedIn", "true");
            sessionStorage.setItem("userEmail", email);
            
            // Redirect to dashboard immediately without alert
            window.location.href = "dashboard.html";
        });
    }

    // Load remembered credentials on page load
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    const rememberedPassword = localStorage.getItem("rememberedPassword");
    
    if (rememberedEmail && rememberedPassword) {
        const emailInput = document.getElementById("loginEmail");
        const passwordInput = document.getElementById("loginPassword");
        const rememberCheckbox = document.getElementById("rememberMe");
        
        if (emailInput) emailInput.value = rememberedEmail;
        if (passwordInput) passwordInput.value = rememberedPassword;
        if (rememberCheckbox) rememberCheckbox.checked = true;
    }

    // Toggle password visibility for login
    const loginEyeIcon = document.querySelector(".login-eye-icon");
    if (loginEyeIcon) {
        loginEyeIcon.addEventListener('click', function() {
            const passwordInput = document.getElementById("loginPassword");
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
            } else {
                passwordInput.type = 'password';
            }
        });
    }
}

// Export for use in main.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initLogin };
}
