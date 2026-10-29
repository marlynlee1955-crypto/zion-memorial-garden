// =========================================
// DASHBOARD COMPONENT LOADER
// =========================================

async function loadDashboardComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) throw new Error(`Failed to load ${componentPath}`);
        const html = await response.text();
        const element = document.getElementById(elementId);
        if (element) element.innerHTML = html;
    } catch (error) {
        console.error('Error loading component:', error);
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
}

function initializeDashboard() {
    // Session check
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
                window.location.href = "index.html";
            }
        });
    }

    // Sidebar elements
    const menuBtn = document.querySelector('.menu-btn');
    const sidebarMenu = document.getElementById('sidebarMenu');
    const overlay = document.getElementById('overlay');
    const closeBtn = document.getElementById('closeBtn');
    const userBtn = document.querySelector('.user-btn');

    // Open sidebar
    if (menuBtn && sidebarMenu && overlay) {
        menuBtn.addEventListener('click', () => {
            sidebarMenu.classList.add('active');
            overlay.classList.add('active');
        });
    }

    // Close sidebar
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

    // Profile Modal
    const profileModal = document.querySelector('.profile-modal-overlay');
    const profileCloseBtn = document.querySelector('.profile-close-btn');
    const backToDashboardBtn = document.getElementById('backToDashboard');

    function openProfileModal() {
        if (profileModal) {
            profileModal.classList.add('active');
            loadProfileFromDatabase();
        }
    }

    function closeProfileModal() {
        if (profileModal) {
            profileModal.classList.remove('active');
        }
    }

    if (userBtn) {
        userBtn.addEventListener('click', openProfileModal);
    }

    if (profileCloseBtn) {
        profileCloseBtn.addEventListener('click', closeProfileModal);
    }

    if (backToDashboardBtn) {
        backToDashboardBtn.addEventListener('click', closeProfileModal);
    }

    // Sidebar Profile menu
    const profileMenuItem = document.getElementById('profileMenuItem');
    if (profileMenuItem) {
        profileMenuItem.addEventListener('click', (e) => {
            e.preventDefault();
            openProfileModal();
            if (sidebarMenu && overlay) {
                sidebarMenu.classList.remove('active');
                overlay.classList.remove('active');
            }
        });
    }

    // =========================================
    // LOAD PROFILE FROM SUPABASE
    // =========================================
    async function loadProfileFromDatabase() {
        try {
            const { data: { user } } = await supabaseClient.auth.getUser();
            if (!user) return;

            const { data: profile, error } = await supabaseClient
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error) {
                console.error("Error loading profile:", error);
                return;
            }

            if (profile) {
                const fullNameEl = document.getElementById('profileFullName');
                if (fullNameEl) fullNameEl.textContent = profile.full_name || "-";

                const usernameEl = document.getElementById('profileUsername');
                if (usernameEl) usernameEl.textContent = profile.username || "-";

                const emailEl = document.getElementById('profileEmail');
                if (emailEl) emailEl.textContent = profile.email || user.email || "-";

                const phoneEl = document.getElementById('profilePhone');
                if (phoneEl) phoneEl.textContent = profile.phone || "-";

                const profilePicture = document.getElementById('profilePicture');
                if (profilePicture) {
                    profilePicture.src = profile.avatar_url || "https://via.placeholder.com/150/FFFFFF/CCCCCC?text=No+Photo";
                }

                const userBtnImg = document.querySelector('.user-btn img');
                if (userBtnImg && profile.avatar_url) {
                    userBtnImg.src = profile.avatar_url;
                }

                console.log("Profile loaded from database");
            }
        } catch (err) {
            console.error(err);
        }
    }

    // =========================================
    // EDIT PROFILE BUTTON
    // =========================================
    document.addEventListener('click', function(e) {
        // Open Edit Profile
        if (e.target && (
            e.target.id === 'editProfileBtn' || 
            e.target.textContent.trim() === 'Edit Profile' ||
            e.target.closest('#editProfileBtn')
        )) {
            e.preventDefault();

            if (profileModal) {
                profileModal.classList.add('active');
            }

            const editProfilePage = document.getElementById('edit-profile-page-component');
            if (editProfilePage) {
                editProfilePage.style.display = 'flex';
                editProfilePage.classList.add('active');

                if (typeof initEditProfilePage === 'function') {
                    initEditProfilePage();
                }
            }
        }

        // Close Edit Profile
        if (e.target && (e.target.id === 'closeEditProfileBtn' || e.target.classList.contains('close-edit-profile'))) {
            const editProfilePage = document.getElementById('edit-profile-page-component');
            if (editProfilePage) {
                editProfilePage.style.display = 'none';
                editProfilePage.classList.remove('active');
            }
            loadProfileFromDatabase();
        }
    });

    // =========================================
    // SIDEBAR MENU ITEMS
    // =========================================

    // Reserve a plot
    const reservePlotMenuItem = document.getElementById('reservePlotMenuItem');
    if (reservePlotMenuItem) {
        reservePlotMenuItem.addEventListener('click', (e) => {
            e.preventDefault();
            const reservationModal = document.querySelector('.reservation-modal-overlay');
            if (reservationModal) {
                reservationModal.classList.add('active');
            }
            if (sidebarMenu && overlay) {
                sidebarMenu.classList.remove('active');
                overlay.classList.remove('active');
            }
        });
    }

    // My Reservation
    const myReservationMenuItem = document.getElementById('myReservationMenuItem');
    if (myReservationMenuItem) {
        myReservationMenuItem.addEventListener('click', (e) => {
            e.preventDefault();
            const myReservationPage = document.getElementById('my-reservation-page-component');
            if (myReservationPage) {
                myReservationPage.style.display = 'block';
                myReservationPage.classList.add('active');
            }
            if (sidebarMenu && overlay) {
                sidebarMenu.classList.remove('active');
                overlay.classList.remove('active');
            }
        });
    }

    // Deceased Family
    const deceasedFamilyMenuItem = document.getElementById('deceasedFamilyMenuItem');
    if (deceasedFamilyMenuItem) {
        deceasedFamilyMenuItem.addEventListener('click', (e) => {
            e.preventDefault();
            const deceasedPage = document.getElementById('deceased-family-page-component');
            if (deceasedPage) {
                deceasedPage.style.display = 'block';
                deceasedPage.classList.add('active');
            }
            if (sidebarMenu && overlay) {
                sidebarMenu.classList.remove('active');
                overlay.classList.remove('active');
            }
        });
    }

    // Menu button inside Profile page
    const profileMenuBtn = document.getElementById('profileMenuBtn');
    if (profileMenuBtn && sidebarMenu && overlay) {
        profileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebarMenu.classList.add('active');
            overlay.classList.add('active');
        });
    }

    // Make a Reservation button on dashboard
    const makeReservationBtn = document.getElementById('makeReservationBtn');
    if (makeReservationBtn) {
        makeReservationBtn.addEventListener('click', () => {
            const reservationModal = document.querySelector('.reservation-modal-overlay');
            if (reservationModal) {
                reservationModal.classList.add('active');
            }
        });
    }

    console.log('Dashboard initialized successfully');
}

// Start
document.addEventListener('DOMContentLoaded', loadAllDashboardComponents);
