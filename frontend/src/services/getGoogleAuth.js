import axios from "axios";

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
