import axios from "axios";

/**
 * Initiates the Google OAuth flow by fetching the auth URL from the backend
 * and redirecting the user to Google's consent screen.
 */
export const getGoogleAuth = async () => {
    try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
        const response = await axios.get(`${backendUrl}/googleauth/auth`);
        
        if (response.data && response.data.finalURL) {
            window.location.href = response.data.finalURL;
        } else {
            console.error("Failed to get Google Auth URL from backend");
        }
    } catch (error) {
        console.error("Error initiating Google Auth:", error);
    }
};

// handlegoogleRedirect is removed as the backend now handles the token exchange 
// and redirects directly to the frontend with the user data.
