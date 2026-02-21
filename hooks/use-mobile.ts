import * as React from "react"

/**
 * Breakpoint in pixels that defines when the layout should switch to mobile view.
 */
const MOBILE_BREAKPOINT = 768

/**
 * Hook to detect if the current viewport is a mobile device based on width.
 * 
 * @returns {boolean} True if the viewport width is less than the MOBILE_BREAKPOINT.
 */
export function useIsMobile() {
  // undefined initial state for SSR safety
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Create a media query list that tracks the mobile breakpoint
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    /**
     * Update state whenever the media query or window width changes.
     */
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Set up event listener for responsive changes
    mql.addEventListener("change", onChange)
    
    // Perform initial check on mount
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    // Clean up listener to prevent memory leaks
    return () => mql.removeEventListener("change", onChange)
  }, [])

  // Coerce undefined to false if not yet determined
  return !!isMobile
}
