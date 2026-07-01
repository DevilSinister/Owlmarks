import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useLocation } from 'react-router-dom';
import './Cursor.css';

const Cursor = () => {
    const cursorRef = useRef(null);
    const cursorTextRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);
    const location = useLocation();

    // Mouse position trackers
    const xTo = useRef(null);
    const yTo = useRef(null);

    // Filter out mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.matchMedia("(max-width: 991px)").matches);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (isMobile || !cursorRef.current) return;

        // GSAP QuickTo for high performance
        xTo.current = gsap.quickTo(cursorRef.current, "x", { duration: 0.2, ease: "power3", overwrite: "auto" });
        yTo.current = gsap.quickTo(cursorRef.current, "y", { duration: 0.2, ease: "power3", overwrite: "auto" });

        const onMouseMove = (e) => {
            xTo.current(e.clientX);
            yTo.current(e.clientY);
        };

        window.addEventListener("mousemove", onMouseMove);

        return () => window.removeEventListener("mousemove", onMouseMove);
    }, [isMobile, location]); // Re-init on location change to be safe

    // Hover Listeners
    useEffect(() => {
        if (isMobile) return;

        const onMouseEnterLink = () => {
            gsap.to(cursorRef.current, { scale: 3, backgroundColor: "transparent", borderColor: "#fff", duration: 0.3 });
        };

        const onMouseLeaveLink = () => {
            gsap.to(cursorRef.current, { scale: 1, backgroundColor: "transparent", borderColor: "#fff", duration: 0.3 });
        };

        const onMouseEnterBtn = () => {
            gsap.to(cursorRef.current, { scale: 1.5, backgroundColor: "#FF4A1C", borderColor: "#FF4A1C", duration: 0.3 });
        };

        const onMouseLeaveBtn = () => {
            gsap.to(cursorRef.current, { scale: 1, backgroundColor: "transparent", borderColor: "#fff", duration: 0.3 });
        };

        const onMouseEnterImg = () => {
            gsap.to(cursorRef.current, { scale: 4, backgroundColor: "rgba(255,255,255,0.2)", backdropFilter: "blur(2px)", borderColor: "transparent", duration: 0.3 });
            if (cursorTextRef.current) cursorTextRef.current.style.opacity = 1;
        };

        const onMouseLeaveImg = () => {
            gsap.to(cursorRef.current, { scale: 1, backgroundColor: "transparent", backdropFilter: "none", borderColor: "#fff", duration: 0.3 });
            if (cursorTextRef.current) cursorTextRef.current.style.opacity = 0;
        };

        // Selectors
        const links = document.querySelectorAll('a, .pillar-card');
        const buttons = document.querySelectorAll('button, .cta-button');
        const images = document.querySelectorAll('.founder-img-wrapper, .case-study-image, .talent-image');

        links.forEach(el => {
            el.addEventListener('mouseenter', onMouseEnterLink);
            el.addEventListener('mouseleave', onMouseLeaveLink);
        });

        buttons.forEach(el => {
            el.addEventListener('mouseenter', onMouseEnterBtn);
            el.addEventListener('mouseleave', onMouseLeaveBtn);
        });

        images.forEach(el => {
            el.addEventListener('mouseenter', onMouseEnterImg);
            el.addEventListener('mouseleave', onMouseLeaveImg);
        });

        return () => {
            links.forEach(el => {
                el.removeEventListener('mouseenter', onMouseEnterLink);
                el.removeEventListener('mouseleave', onMouseLeaveLink);
            });
            buttons.forEach(el => {
                el.removeEventListener('mouseenter', onMouseEnterBtn);
                el.removeEventListener('mouseleave', onMouseLeaveBtn);
            });
            images.forEach(el => {
                el.removeEventListener('mouseenter', onMouseEnterImg);
                el.removeEventListener('mouseleave', onMouseLeaveImg);
            });
        };
    }, [isMobile, location]); // Re-bind on route change

    if (isMobile) return null;

    return (
        <div className="custom-cursor" ref={cursorRef}>
            <span className="cursor-text" ref={cursorTextRef}>VIEW</span>
        </div>
    );
};

export default Cursor;
