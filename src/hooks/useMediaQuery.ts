import { useState, useEffect } from "react";

/**
 * Custom hook that tracks the state of a CSS media query.
 * @param query The media query string to check (e.g., "(min-width: 768px)")
 * @returns boolean indicating if the query currently matches
 */
export function useMediaQuery(query: string): boolean {
  // Initialize with false to avoid SSR hydration mismatches
    const [matches, setMatches] = useState<boolean>(false);

    useEffect(() => {
        const media: MediaQueryList = window.matchMedia(query);

        // Update state immediately on mount
        if (media.matches !== matches) {
        setMatches(media.matches);
        }

        // Listener to detect viewport changes
        const listener = (event: MediaQueryListEvent): void => {
        setMatches(event.matches);
        };

        // Modern API for adding listeners
        media.addEventListener("change", listener);

        // Clean up listener on unmount
        return () => media.removeEventListener("change", listener);
    }, [query, matches]);

    return matches;
};
