import { useEffect, useRef } from 'react';

// Fallback to a dummy URL during local dev; the real URL is set via
// VITE_API_BASE_URL in Vercel environment variables for production.
const BACKEND_URL =
    import.meta.env.VITE_API_BASE_URL || 'https://litenetx-api.onrender.com';

/**
 * Custom hook to keep the Render backend alive by pinging /health every 14 minutes.
 * Render spins down free web services after 15 minutes of inactivity.
 */
export const useKeepAlive = () => {
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const pingBackend = async () => {
            try {
                await fetch(`${BACKEND_URL}/health`, {
                    method: 'GET',
                    
                    // CORS is fine because /health is a simple GET that the backend allows.
                });
            } catch {
                // Silent failure — never disrupt the user experience.
            }
        };

        // Ping immediately on app load
        pingBackend();

        // Then ping every 14 minutes (safely under Render's 15-min sleep threshold)
        intervalRef.current = setInterval(pingBackend, 14 * 60 * 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);
};
