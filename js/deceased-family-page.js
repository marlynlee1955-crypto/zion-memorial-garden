// =========================================
// DECEASED FAMILY PAGE FUNCTIONALITY
// =========================================

function initDeceasedFamilyPage() {
    const deceasedFamilyPage = document.getElementById('deceasedFamilyPage');
    const deceasedFamilyMenuBtn = document.getElementById('deceasedFamilyMenuBtn');
    const deceasedFamilyUserBtn = document.getElementById('deceasedFamilyUserBtn');
    const makeDeceasedFamilyReservationBtn = document.getElementById('makeDeceasedFamilyReservationBtn');

    // Menu button - toggle sidebar dropdown
    if (deceasedFamilyMenuBtn) {
        deceasedFamilyMenuBtn.addEventListener('click', () => {
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

    // User button - close deceased family and open profile modal
    if (deceasedFamilyUserBtn) {
        deceasedFamilyUserBtn.addEventListener('click', () => {
            deceasedFamilyPage.classList.remove('active');
            const profileModal = document.querySelector('.profile-modal-overlay');
            if (profileModal) {
                profileModal.classList.add('active');
            }
        });
    }

    // Make reservation button - open reservation modal
    if (makeDeceasedFamilyReservationBtn) {
        makeDeceasedFamilyReservationBtn.addEventListener('click', () => {
            deceasedFamilyPage.classList.remove('active');
            const reservationModal = document.querySelector('.reservation-modal-overlay');
            if (reservationModal) {
                reservationModal.classList.add('active');
            }
        });
    }

    // Handle sidebar menu clicks when on deceased family page
    setupDeceasedFamilySidebarNavigation();
}

function setupDeceasedFamilySidebarNavigation() {
    const deceasedFamilyPage = document.getElementById('deceasedFamilyPage');
    const sidebar = document.querySelector('.sidebar-menu');
    const overlay = document.getElementById('overlay');

    // Profile menu item
    const profileMenuItem = document.getElementById('profileMenuItem');
    if (profileMenuItem) {
        profileMenuItem.addEventListener('click', (e) => {
            e.preventDefault();
            // Close deceased family page
            deceasedFamilyPage.classList.remove('active');
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
            // Close deceased family page
            deceasedFamilyPage.classList.remove('active');
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
            // Close deceased family page
            deceasedFamilyPage.classList.remove('active');
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

    // My Reservation menu item
    const myReservationMenuItem = document.getElementById('myReservationMenuItem');
    if (myReservationMenuItem) {
        myReservationMenuItem.addEventListener('click', (e) => {
            e.preventDefault();
            // Close deceased family page
            deceasedFamilyPage.classList.remove('active');
            // Open my reservation page
            const myReservationPage = document.getElementById('myReservationPage');
            if (myReservationPage) {
                myReservationPage.classList.add('active');
            }
            // Close sidebar
            if (sidebar) sidebar.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
        });
    }
}

// Export for use in dashboard-loader.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initDeceasedFamilyPage };
}
