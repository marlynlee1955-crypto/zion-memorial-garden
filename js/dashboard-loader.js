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
    // Load all dashboard components
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
    
    // Initialize dashboard functionality after components are loaded
    initializeDashboard();
    
    // Initialize edit profile page
    if (typeof initEditProfilePage === 'function') {
        initEditProfilePage();
    }
    
    // Initialize my reservation page
    if (typeof initMyReservationPage === 'function') {
        initMyReservationPage();
    }
    
    // Initialize deceased family page
    if (typeof initDeceasedFamilyPage === 'function') {
        initDeceasedFamilyPage();
    }
}

function initializeDashboard() {
    // =========================================
    // SESSION CHECK - Redirect if not logged in
    // =========================================
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    
    if (!isLoggedIn) {
        alert("Please login first");
        window.location.href = "index.html";
        return;
    }

    // =========================================
    // LOGOUT FUNCTIONALITY
    // =========================================
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

    // =========================================
    // MENU TOGGLE FUNCTIONALITY
    // =========================================
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

    // Profile menu item
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

    // Dashboard menu item
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

    // =========================================
    // PROFILE MODAL FUNCTIONALITY
    // =========================================
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

    // =========================================
    // PROFILE PICTURE FUNCTIONALITY
    // =========================================
    function loadProfilePicture() {
        const savedPicture = localStorage.getItem('userProfilePicture');
        const savedProfile = localStorage.getItem('userProfile');
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

        if (savedProfile) {
            const profile = JSON.parse(savedProfile);
            
            const profileDisplayName = document.getElementById('profileDisplayName');
            const profileUsernameDisplay = document.getElementById('profileUsernameDisplay');
            const profileFullName = document.getElementById('profileFullName');
            const profileUsername = document.getElementById('profileUsername');
            const profileEmail = document.getElementById('profileEmail');
            const profilePhone = document.getElementById('profilePhone');
            
            if (profileDisplayName && profile.fullName) {
                profileDisplayName.textContent = profile.fullName.toUpperCase();
            }
            if (profileUsernameDisplay && profile.username) {
                profileUsernameDisplay.textContent = profile.username;
            }
            if (profileFullName && profile.fullName) {
                profileFullName.textContent = profile.fullName;
            }
            if (profileUsername && profile.username) {
                profileUsername.textContent = profile.username;
            }
            if (profileEmail && profile.email) {
                profileEmail.textContent = profile.email;
            }
            if (profilePhone && profile.phone) {
                profilePhone.textContent = profile.phone;
            }
        }
    }

    function saveProfilePicture(imageDataUrl) {
        localStorage.setItem('userProfilePicture', imageDataUrl);
        loadProfilePicture();
    }

    // =========================================
    // EDIT PROFILE BUTTON (FIXED)
    // =========================================
    document.addEventListener('click', function(e) {
        if (e.target && (
            e.target.id === 'editProfileBtn' || 
            e.target.textContent.trim() === 'Edit Profile' ||
            e.target.closest('#editProfileBtn')
        )) {
            e.preventDefault();

            // Close profile modal if open
            const profileModal = document.querySelector('.profile-modal-overlay');
            if (profileModal) {
                profileModal.classList.remove('active');
            }

            // Show the edit profile page component
            const editProfilePage = document.getElementById('edit-profile-page-component');
            if (editProfilePage) {
                editProfilePage.style.display = 'block';
                editProfilePage.classList.add('active');

                // Call the init function
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

    // Load profile picture on page load
    loadProfilePicture();

    // =========================================
    // RESERVATION MODAL FUNCTIONALITY
    // =========================================
    const reservationModal = document.querySelector('.reservation-modal-overlay');
    const reservationMenuBtn = document.getElementById('reservationMenuBtn');
    const reservationUserBtn = document.getElementById('reservationUserBtn');
    const backFromReservation = document.getElementById('backFromReservation');
    const makeReservationBtn = document.getElementById('makeReservationBtn');
    const reservePlotMenuItem = document.getElementById('reservePlotMenuItem');
    const proceedBtn = document.getElementById('proceedBtn');

    const lawnDescriptions = {
        'condominium': {
            title: 'Condominium:',
            desc: 'A vertical interment facility featuring stacked, above-ground vaults. This section offers a structured and organized memorial space, utilizing a multi-level grid system for efficient space management and easy identification of individual niches'
        },
        'single-teired': {
            title: 'Single Teired:',
            desc: 'Traditional ground burial plots arranged in a single level. This classic option provides a peaceful resting place with individual grave sites, perfect for families seeking a traditional memorial setting'
        },
        'supreme': {
            title: 'Supreme:',
            desc: 'Premium ground burial plots with enhanced features and larger space. These plots offer superior positioning and additional amenities for families who desire an elevated memorial experience'
        },
        'special-supreme': {
            title: 'Special Supreme:',
            desc: 'Our most exclusive ground burial option, featuring the finest locations and maximum space. Special Supreme plots provide unparalleled prestige and comfort for distinguished families'
        },
        'mausoleum': {
            title: 'Mausoleum:',
            desc: 'Above-ground entombment in a permanent structure. Mausoleums offer protection from the elements and provide a dignified, lasting memorial in a climate-controlled environment'
        }
    };

    function openReservationModal() {
        if (reservationModal) {
            reservationModal.classList.add('active');
            
            const reservationUserBtnImg = document.querySelector('#reservationUserBtn img');
            const savedPicture = localStorage.getItem('userProfilePicture');
            if (reservationUserBtnImg && savedPicture) {
                reservationUserBtnImg.src = savedPicture;
            }
        }
    }

    function closeReservationModal() {
        if (reservationModal) {
            reservationModal.classList.remove('active');
            
            const dashboardContent = document.querySelector('.dashboard-content');
            if (dashboardContent) {
                dashboardContent.style.display = 'block';
            }
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

    const myReservationMenuItem = document.getElementById('myReservationMenuItem');
    if (myReservationMenuItem) {
        myReservationMenuItem.addEventListener('click', (e) => {
            e.preventDefault();
            closeReservationModal();
            closeProfileModal();
            
            const myReservationPage = document.getElementById('myReservationPage');
            if (myReservationPage) {
                myReservationPage.classList.add('active');
            }
            
            updateActiveMenuItem('myreservation');
            
            if (sidebarMenu && overlay) {
                sidebarMenu.classList.remove('active');
                overlay.classList.remove('active');
            }
        });
    }

    const deceasedFamilyMenuItem = document.getElementById('deceasedFamilyMenuItem');
    if (deceasedFamilyMenuItem) {
        deceasedFamilyMenuItem.addEventListener('click', (e) => {
            e.preventDefault();
            closeReservationModal();
            closeProfileModal();
            
            const deceasedFamilyPage = document.getElementById('deceasedFamilyPage');
            if (deceasedFamilyPage) {
                deceasedFamilyPage.classList.add('active');
            }
            
            updateActiveMenuItem('deceasedfamily');
            
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

    if (reservationMenuBtn && sidebarMenu && overlay) {
        reservationMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebarMenu.classList.add('active');
            overlay.classList.add('active');
        });
    }

    if (reservationUserBtn) {
        reservationUserBtn.addEventListener('click', () => {
            closeReservationModal();
            openProfileModal();
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
            if (lawnDescriptions[lawnType]) {
                lawnTitle.textContent = lawnDescriptions[lawnType].title;
                lawnDesc.textContent = lawnDescriptions[lawnType].desc;
            }
        });
    });

    if (proceedBtn) {
        proceedBtn.addEventListener('click', () => {
            const selectedPlot = document.getElementById('selectedPlot').textContent;
            if (selectedPlot === 'None') {
                alert('Please select a plot location first');
            } else {
                alert(`Proceeding with reservation for: ${selectedPlot}\nReservation form - Coming soon!`);
            }
        });
    }

    if (backToDashboardBtn) {
        backToDashboardBtn.addEventListener('click', closeProfileModal);
    }

    if (profileMenuBtn && sidebarMenu && overlay) {
        profileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebarMenu.classList.add('active');
            overlay.classList.add('active');
        });
    }

    if (profileUserBtn) {
        profileUserBtn.addEventListener('click', () => {});
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

    // =========================================
    // PLOT INTERACTION
    // =========================================
    const plots = document.querySelectorAll('.plot');
    plots.forEach(plot => {
        plot.addEventListener('click', function() {
            const plotNumber = this.getAttribute('data-plot');
            const isAvailable = this.classList.contains('available');
            
            if (isAvailable) {
                alert(`Plot ${plotNumber} is available. Would you like to make a reservation?`);
            } else {
                alert(`Plot ${plotNumber} is occupied.`);
            }
        });
    });

    const plotClickableAreas = document.querySelectorAll('.plot-clickable-area');
    plotClickableAreas.forEach(area => {
        area.addEventListener('click', function() {
            const plotNumber = this.getAttribute('data-plot');
            window.location.href = `plot-details.html?plot=${plotNumber}`;
        });
    });

    const reservationBtn = document.querySelector('.reservation-btn');
    if (reservationBtn) {
        reservationBtn.addEventListener('click', () => {
            openReservationModal();
        });
    }

    const paymentHistoryLink = document.querySelector('.payment-history');
    if (paymentHistoryLink) {
        paymentHistoryLink.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Opening payment history...');
        });
    }

    plots.forEach(plot => {
        plot.addEventListener('mouseenter', function() {
            const plotNumber = this.getAttribute('data-plot');
            const isAvailable = this.classList.contains('available');
            const status = isAvailable ? 'Available' : 'Occupied';
            console.log(`Plot ${plotNumber}: ${status}`);
        });
    });

    console.log('Dashboard initialized successfully');
    
    // Auto-open reservation modal from URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('openReservation') === 'true') {
        const dashboardContent = document.querySelector('.dashboard-content');
        if (dashboardContent) {
            dashboardContent.style.display = 'none';
        }
        
        setTimeout(() => {
            openReservationModal();
        }, 100);
    }
}

// Load components when DOM is ready
document.addEventListener('DOMContentLoaded', loadAllDashboardComponents);
