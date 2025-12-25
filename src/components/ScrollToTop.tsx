import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Scroll to top instantly when route changes
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth" // Use "instant" for immediate scroll, or "smooth" for animation
        });

        // Alternative for better browser compatibility
        // document.documentElement.scrollTo({
        //     top: 0,
        //     left: 0,
        //     behavior: "instant"
        // });
    }, [pathname]); // Runs every time the route changes

    return null; // This component doesn't render anything
};

export default ScrollToTop;
