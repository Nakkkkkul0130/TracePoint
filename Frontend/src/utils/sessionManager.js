// Session management utility
class SessionManager {
  constructor() {
    this.init();
  }

  init() {
    // Set session active flag (persists during refresh)
    sessionStorage.setItem('sessionActive', 'true');

    // Listen for browser close (not refresh)
    window.addEventListener('beforeunload', (e) => {
      // Only clear session if it's actually browser close
      // Use a small delay to detect if it's a refresh vs close
      setTimeout(() => {
        if (!sessionStorage.getItem('sessionActive')) {
          this.clearUserSession();
        }
      }, 100);
    });

    // Detect page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        // Mark that page is hidden
        sessionStorage.setItem('pageHidden', Date.now().toString());
      } else {
        // Page is visible again - check if too much time passed
        const hiddenTime = sessionStorage.getItem('pageHidden');
        if (hiddenTime) {
          const timeDiff = Date.now() - parseInt(hiddenTime);
          // If hidden for more than 2 hours, logout
          if (timeDiff > 2 * 60 * 60 * 1000) {
            this.clearUserSession();
            window.location.href = '/login';
          }
        }
      }
    });
  }

  clearUserSession() {
    // Clear all user-related data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('isLoggedIn');
  }

  isUserLoggedIn() {
    return localStorage.getItem('token') && localStorage.getItem('userId');
  }
}

// Create and export singleton instance
const sessionManager = new SessionManager();
export default sessionManager;