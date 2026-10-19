// =========================================
// EDIT PROFILE PAGE FUNCTIONALITY
// =========================================

function initEditProfilePage() {
    const editProfilePage = document.getElementById('editProfilePage');
    const editProfileMenuBtn = document.getElementById('editProfileMenuBtn');
    const editProfileUserBtn = document.getElementById('editProfileUserBtn');
    const editProfileCancelBtn = document.getElementById('editProfileCancelBtn');
    const editProfileForm = document.getElementById('editProfilePageForm');
    const editProfileChangePicBtn = document.getElementById('editProfileChangePicBtn');
    const editProfilePictureInput = document.getElementById('editProfilePictureInput');
    const editProfilePicturePreview = document.getElementById('editProfilePicturePreview');

    // Menu button - toggle sidebar dropdown
    if (editProfileMenuBtn) {
        editProfileMenuBtn.addEventListener('click', () => {
            const sidebar = document.querySelector('.sidebar-menu');
            const overlay = document.getElementById('overlay');
            if (sidebar) {
                sidebar.classList.toggle('active');
            }
            if (overlay) {
                overlay.classList.toggle('active');
            }
        });
    }

    // User button - close edit profile and open profile modal
    if (editProfileUserBtn) {
        editProfileUserBtn.addEventListener('click', () => {
            editProfilePage.classList.remove('active');
            const profileModal = document.querySelector('.profile-modal-overlay');
            if (profileModal) {
                profileModal.classList.add('active');
            }
        });
    }

    // Handle sidebar menu clicks when on edit profile page
    setupSidebarNavigation();

    // Cancel button
    if (editProfileCancelBtn) {
        editProfileCancelBtn.addEventListener('click', () => {
            editProfilePage.classList.remove('active');
            const profileModal = document.querySelector('.profile-modal-overlay');
            if (profileModal) {
                profileModal.classList.add('active');
            }
        });
    }

    // Change profile picture
    if (editProfileChangePicBtn && editProfilePictureInput) {
        editProfileChangePicBtn.addEventListener('click', () => {
            editProfilePictureInput.click();
        });

        editProfilePictureInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                // Check if file is an image
                if (!file.type.startsWith('image/')) {
                    alert('Please select an image file');
                    return;
                }

                // Check file size (max 2MB)
                if (file.size > 2 * 1024 * 1024) {
                    alert('Image size should be less than 2MB');
                    return;
                }

                const reader = new FileReader();
                reader.onload = (event) => {
                    editProfilePicturePreview.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Handle form submission
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const fullName = document.getElementById('editProfileFullName').value;
            const email = document.getElementById('editProfileEmail').value;
            const username = document.getElementById('editProfileUsername').value;
            const phone = document.getElementById('editProfilePhone').value;

            // Save to localStorage
            const profileData = {
                fullName,
                email,
                username,
                phone
            };
            localStorage.setItem('userProfile', JSON.stringify(profileData));

            // Save profile picture if changed
            if (editProfilePicturePreview.src && !editProfilePicturePreview.src.includes('image 6.png')) {
                localStorage.setItem('profilePicture', editProfilePicturePreview.src);
            }

            alert('Profile updated successfully!');
            editProfilePage.classList.remove('active');

            // Reload the page to show updated info
            location.reload();
        });
    }

    // Load existing profile data
    loadEditProfileData();
}

function setupSidebarNavigation() {
    const editProfilePage = document.getElementById('editProfilePage');
    const sidebar = document.querySelector('.sidebar-menu');
    const overlay = document.getElementById('overlay');

    // Profile menu item
    const profileMenuItem = document.getElementById('profileMenuItem');
    if (profileMenuItem) {
        profileMenuItem.addEventListener('click', (e) => {
            e.preventDefault();
            // Close edit profile page
            editProfilePage.classList.remove('active');
            // Open profile modal
            const profileModal = document.querySelector('.profile-modal-overlay');
            if (profileModal) {
                profileModal.classList.add('active');
            }
            // Close sidebar
            if (sidebar) sidebar.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
        });
    }

    // Dashboard menu item
    const dashboardMenuItem = document.getElementById('dashboardMenuItem');
    if (dashboardMenuItem) {
        dashboardMenuItem.addEventListener('click', (e) => {
            e.preventDefault();
            // Close edit profile page
            editProfilePage.classList.remove('active');
            // Close sidebar
            if (sidebar) sidebar.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
        });
    }

    // Reserve a plot menu item
    const reservePlotMenuItem = document.getElementById('reservePlotMenuItem');
    if (reservePlotMenuItem) {
        reservePlotMenuItem.addEventListener('click', (e) => {
            e.preventDefault();
            // Close edit profile page
            editProfilePage.classList.remove('active');
            // Open reservation modal
            const reservationModal = document.querySelector('.reservation-modal-overlay');
            if (reservationModal) {
                reservationModal.classList.add('active');
            }
            // Close sidebar
            if (sidebar) sidebar.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
        });
    }

    // Sign out button
    const signoutBtn = document.querySelector('.signout-btn');
    if (signoutBtn) {
        signoutBtn.addEventListener('click', () => {
            if (confirm("Are you sure you want to sign out?")) {
                sessionStorage.clear();
                localStorage.removeItem("rememberedEmail");
                localStorage.removeItem("rememberedPassword");
                window.location.href = "index.html";
            }
        });
    }
}

function loadEditProfileData() {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        
        const fullNameInput = document.getElementById('editProfileFullName');
        const emailInput = document.getElementById('editProfileEmail');
        const usernameInput = document.getElementById('editProfileUsername');
        const phoneInput = document.getElementById('editProfilePhone');

        if (fullNameInput) fullNameInput.value = profile.fullName || '';
        if (emailInput) emailInput.value = profile.email || '';
        if (usernameInput) usernameInput.value = profile.username || '';
        if (phoneInput) phoneInput.value = profile.phone || '';
    }

    // Load profile picture
    const savedPicture = localStorage.getItem('profilePicture');
    const editProfilePicturePreview = document.getElementById('editProfilePicturePreview');
    if (savedPicture && editProfilePicturePreview) {
        editProfilePicturePreview.src = savedPicture;
    }
}

// Export for use in dashboard-loader.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initEditProfilePage };
}
