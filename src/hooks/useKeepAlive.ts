import { useEffect, useRef } from 'react';

// Local fallback URL
const BACKEND_URL =
    import.meta.env.VITE_API_BASE_URL || 'https://litenetx-api.onrender.com';

/** Keep backend warm. */
export const useKeepAlive = () => {
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const pingBackend = async () => {
            try {
                await fetch(`${BACKEND_URL}/health`, {
                    method: 'GET',
                    
                    // Health GET is safe
                });
            } catch {
                // Fail quietly here
            }
        };

        // Ping on load
        pingBackend();

        // Ping every 14 minutes
        intervalRef.current = setInterval(pingBackend, 14 * 60 * 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);
};
