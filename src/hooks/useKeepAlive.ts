import { useEffect, useRef } from 'react';

/**
 * Custom hook to keep the backend server alive by pinging it every 14 minutes.
 * Render spins down free web services after 15 minutes of inactivity.
 * We ping every 14 minutes to be safe and efficient.
 */
export const useKeepAlive = () => {
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const backendUrl = import.meta.env.VITE_API_BASE_URL;

        if (!backendUrl) {
            return;
        }

        const pingBackend = async () => {
            try {
                await fetch(`${backendUrl}/`, {
                    method: 'GET',
                    mode: 'no-cors', // Avoid CORS issues for simple ping
                });
            } catch (error) {
                // Silent failure - don't disrupt user experience
            }
        };

        // Send initial ping immediately
        pingBackend();

        // Set up interval to ping every 14 minutes (14 * 60 * 1000 = 840,000ms)
        intervalRef.current = setInterval(pingBackend, 14 * 60 * 1000);

        // Cleanup on unmount
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);
};
