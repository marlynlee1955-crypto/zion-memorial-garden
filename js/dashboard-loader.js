// =========================================
// DASHBOARD COMPONENT LOADER
// Loads dashboard HTML components dynamically
// =========================================

async function loadDashboardComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) {
            throw new Error(`Failed to load ${componentPath}`);
        }
        const html = await response.text();
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = html;
        }
    } catch (error) {
        console.error('Error loading dashboard component:', error);
    }
}

async function loadAllDashboardComponents() {
    await Promise.all([
        loadDashboardComponent('sidebar-component', 'components/dashboard-sidebar.html'),
        loadDashboardComponent('header-component', 'components/dashboard-header.html'),
        loadDashboardComponent('content-component', 'components/dashboard-content.html'),
        loadDashboardComponent('profile-modal-component', 'components/profile-modal.html'),
        loadDashboardComponent('reservation-modal-component', 'components/reservation-modal.html'),
        loadDashboardComponent('edit-profile-page-component', 'components/edit-profile-page.html'),
        loadDashboardComponent('my-reservation-page-component', 'components/my-reservation-content.html'),
        loadDashboardComponent('deceased-family-page-component', 'components/deceased-family-content.html')
    ]);
    
    console.log('All dashboard components loaded successfully');
    
    initializeDashboard();
    
    if (typeof initEditProfilePage === 'function') {
        initEditProfilePage();
    }
    
    if (typeof initMyReservationPage === 'function') {
        initMyReservationPage();
    }
    
    if (typeof initDeceasedFamilyPage === 'function') {
        initDeceasedFamilyPage();
    }
}

function initializeDashboard() {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    
    if (!isLoggedIn) {
        alert("Please login first");
        window.location.href = "index.html";
        return;
    }

    // Logout
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

    // Menu Toggle
    const menuBtn = document.querySelector('.menu-btn');
    const userBtn = document.querySelector('.user-btn');
    const sidebarMenu = document.getElementById('sidebarMenu');
    const overlay = document.getElementById('overlay');
    const closeBtn = document.getElementById('closeBtn');

    if (menuBtn && sidebarMenu && overlay) {
        menuBtn.addEventListener('click', () => {
            sidebarMenu.classList.add('active');
            overlay.classList.add('active');
        });
    }

    if (closeBtn && sidebarMenu && overlay) {
        closeBtn.addEventListener('click', () => {
            sidebarMenu.classList.remove('active');
            overlay.classList.remove('active');
        });
    }

    if (overlay && sidebarMenu) {
        overlay.addEventListener('click', () => {
            sidebarMenu.classList.remove('active');
            overlay.classList.remove('active');
        });
    }

    if (userBtn) {
        userBtn.addEventListener('click', () => {
            openProfileModal();
        });
    }

    const profileMenuItem = document.getElementById('profileMenuItem');
    if (profileMenuItem) {
        profileMenuItem.addEventListener('click', (e) => {
            e.preventDefault();
            closeReservationModal();
            openProfileModal();
            updateActiveMenuItem('profile');
            
            if (sidebarMenu && overlay) {
                sidebarMenu.classList.remove('active');
                overlay.classList.remove('active');
            }
        });
    }

    const dashboardMenuItem = document.getElementById('dashboardMenuItem');
    if (dashboardMenuItem) {
        dashboardMenuItem.addEventListener('click', (e) => {
            e.preventDefault();
            closeReservationModal();
            closeProfileModal();
            updateActiveMenuItem('dashboard');
            
            if (sidebarMenu && overlay) {
                sidebarMenu.classList.remove('active');
                overlay.classList.remove('active');
            }
        });
    }

    function updateActiveMenuItem(page) {
        const allMenuItems = document.querySelectorAll('.menu-item');
        allMenuItems.forEach(item => item.classList.remove('active'));
        
        if (page === 'profile' && profileMenuItem) {
            profileMenuItem.classList.add('active');
        } else if (page === 'dashboard' && dashboardMenuItem) {
            dashboardMenuItem.classList.add('active');
        } else if (page === 'reservation') {
            const reservePlotMenuItem = document.getElementById('reservePlotMenuItem');
            if (reservePlotMenuItem) {
                reservePlotMenuItem.classList.add('active');
            }
        }
    }

    // Profile Modal
    const profileModal = document.querySelector('.profile-modal-overlay');
    const profileCloseBtn = document.querySelector('.profile-close-btn');
    const backToDashboardBtn = document.getElementById('backToDashboard');
    const profileMenuBtn = document.getElementById('profileMenuBtn');
    const profileUserBtn = document.getElementById('profileUserBtn');

    function openProfileModal() {
        if (profileModal) {
            const userEmail = sessionStorage.getItem("userEmail") || "user@example.com";
            const emailField = document.getElementById('profileEmail');
            if (emailField) emailField.textContent = userEmail;
            
            loadProfilePicture();
            profileModal.classList.add('active');
            updateActiveMenuItem('profile');
        }
    }

    function closeProfileModal() {
        if (profileModal) {
            profileModal.classList.remove('active');
            updateActiveMenuItem('dashboard');
        }
    }

    function loadProfilePicture() {
        const savedPicture = localStorage.getItem('userProfilePicture');
        const defaultPicture = 'assets/images/icons/image 6.png';
        
        const profilePicture = document.getElementById('profilePicture');
        if (profilePicture) {
            profilePicture.src = savedPicture || defaultPicture;
        }
        
        const profileUserBtnImg = document.querySelector('#profileUserBtn img');
        if (profileUserBtnImg) {
            profileUserBtnImg.src = savedPicture || defaultPicture;
        }
        
        const userBtnImg = document.querySelector('.user-btn img');
        if (userBtnImg) {
            userBtnImg.src = savedPicture || defaultPicture;
        }
    }

    // =========================================
    // EDIT PROFILE BUTTON (FIXED - keeps Profile page as background)
    // =========================================
    document.addEventListener('click', function(e) {
        if (e.target && (
            e.target.id === 'editProfileBtn' || 
            e.target.textContent.trim() === 'Edit Profile' ||
            e.target.closest('#editProfileBtn')
        )) {
            e.preventDefault();

            // Keep the Profile page visible in the background
            const profileModal = document.querySelector('.profile-modal-overlay');
            if (profileModal) {
                profileModal.classList.add('active');
            }

            // Show the edit profile popup on top
            const editProfilePage = document.getElementById('edit-profile-page-component');
            if (editProfilePage) {
                editProfilePage.style.display = 'flex';
                editProfilePage.classList.add('active');

                if (typeof initEditProfilePage === 'function') {
                    initEditProfilePage();
                }
            }
        }

        // Close Edit Profile button
        if (e.target && (e.target.id === 'closeEditProfileBtn' || e.target.classList.contains('close-edit-profile'))) {
            const editProfilePage = document.getElementById('edit-profile-page-component');
            if (editProfilePage) {
                editProfilePage.style.display = 'none';
                editProfilePage.classList.remove('active');
            }
        }
    });

    loadProfilePicture();

    // Reservation Modal
    const reservationModal = document.querySelector('.reservation-modal-overlay');
    const makeReservationBtn = document.getElementById('makeReservationBtn');
    const reservePlotMenuItem = document.getElementById('reservePlotMenuItem');
    const backFromReservation = document.getElementById('backFromReservation');
    const proceedBtn = document.getElementById('proceedBtn');

    const lawnDescriptions = {
        'condominium': {
            title: 'Condominium:',
            desc: 'A vertical interment facility featuring stacked, above-ground vaults.'
        },
        'single-teired': {
            title: 'Single Teired:',
            desc: 'Traditional ground burial plots arranged in a single level.'
        },
        'supreme': {
            title: 'Supreme:',
            desc: 'Premium ground burial plots with enhanced features.'
        },
        'special-supreme': {
            title: 'Special Supreme:',
            desc: 'Our most exclusive ground burial option.'
        },
        'mausoleum': {
            title: 'Mausoleum:',
            desc: 'Above-ground entombment in a permanent structure.'
        }
    };

    function openReservationModal() {
        if (reservationModal) {
            reservationModal.classList.add('active');
        }
    }

    function closeReservationModal() {
        if (reservationModal) {
            reservationModal.classList.remove('active');
        }
    }

    if (reservePlotMenuItem) {
        reservePlotMenuItem.addEventListener('click', (e) => {
            e.preventDefault();
            openReservationModal();
            updateActiveMenuItem('reservation');
            
            if (sidebarMenu && overlay) {
                sidebarMenu.classList.remove('active');
                overlay.classList.remove('active');
            }
        });
    }

    if (makeReservationBtn) {
        makeReservationBtn.addEventListener('click', () => {
            openReservationModal();
        });
    }

    if (backFromReservation) {
        backFromReservation.addEventListener('click', () => {
            closeReservationModal();
            updateActiveMenuItem('dashboard');
        });
    }

    const lawnTabs = document.querySelectorAll('.lawn-tab');
    const lawnTitle = document.getElementById('lawnTitle');
    const lawnDesc = document.getElementById('lawnDesc');

    lawnTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            lawnTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const lawnType = tab.getAttribute('data-lawn');
            if (lawnDescriptions[lawnType] && lawnTitle && lawnDesc) {
                lawnTitle.textContent = lawnDescriptions[lawnType].title;
                lawnDesc.textContent = lawnDescriptions[lawnType].desc;
            }
        });
    });

    if (proceedBtn) {
        proceedBtn.addEventListener('click', () => {
            const selectedPlot = document.getElementById('selectedPlot');
            if (selectedPlot && selectedPlot.textContent === 'None') {
                alert('Please select a plot location first');
            } else {
                alert('Proceeding with reservation...');
            }
        });
    }

    if (backToDashboardBtn) {
        backToDashboardBtn.addEventListener('click', closeProfileModal);
    }

    if (profileCloseBtn) {
        profileCloseBtn.addEventListener('click', closeProfileModal);
    }

    const passwordBtn = document.querySelector('.password-btn');
    if (passwordBtn) {
        passwordBtn.addEventListener('click', () => {
            alert('Change Password functionality - Coming soon!');
        });
    }

    console.log('Dashboard initialized successfully');
}

// Load components when DOM is ready
document.addEventListener('DOMContentLoaded', loadAllDashboardComponents);
