import axios from "axios";

const runCompilerCode = async (reqBody) => {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        try {
                const response = await axios.post(`${backendUrl}/run/onlinecompiler`, reqBody);
                return response.data;
        } catch (error) {
                console.error("API call error:", error.message);
                throw error;
        }
};

const runPracticeCode = async (reqBody) => {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        try {
                const response = await axios.post(`${backendUrl}/run/practiceproblems`, reqBody);

                return response.data;
        } catch (error) {
                console.error("API call error:", error.message);
                throw error;
        }
};

const getJobStatus = async (jobId) => {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        try {
                const response = await axios.get(`${backendUrl}/job/${jobId}`);
                return response.data;
        } catch (error) {
                console.error("Status check error:", error.message);
                throw error;
        }
};

export { runCompilerCode, runPracticeCode, getJobStatus };
