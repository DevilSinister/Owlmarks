import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

export const usePageTransition = () => {
    const navigate = useNavigate();

    const navigateTo = (path) => {
        const overlay = document.querySelector('.page-transition-overlay');

        if (overlay) {
            gsap.to(overlay, {
                opacity: 1,
                pointerEvents: "all",
                duration: 0.6,
                ease: "power2.inOut",
                onComplete: () => {
                    navigate(path);
                    window.scrollTo(0, 0);
                    // Overlay fade out is handled by the destination page or a global effect
                    // For simplicity, we can fade it out here after a tiny delay if the component doesn't unmount
                    // But in React Router, the App component stays mounted.
                    // Better approach: The App component listens to location changes.
                }
            });
        } else {
            navigate(path);
            window.scrollTo(0, 0);
        }
    };

    return navigateTo;
};
