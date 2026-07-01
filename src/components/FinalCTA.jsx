import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { owmarkContent } from '../data/owmarkContent';
import { usePageTransition } from '../hooks/usePageTransition';
import './FinalCTA.css';

gsap.registerPlugin(ScrollTrigger);

const FinalCTA = () => {
    const sectionRef = useRef(null);
    const headlineRef = useRef(null);
    const btnRef = useRef(null);
    const navigateTo = usePageTransition();

    useEffect(() => {
        const ctx = gsap.context(() => {

            // Headline Entrance
            gsap.fromTo(headlineRef.current,
                { y: 100, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 60%",
                    }
                }
            );

            // Button Entrance
            gsap.fromTo(btnRef.current,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    delay: 0.3,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 60%",
                    }
                }
            );

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const handleApplyClick = () => {
        navigateTo('/apply');
    };

    const { finalCTA } = owmarkContent;

    return (
        <section className="final-cta-section" ref={sectionRef}>
            <div className="container cta-container">
                <h2 className="cta-headline" ref={headlineRef}>
                    {finalCTA.finalHeadline}
                </h2>

                <button
                    className="cta-button"
                    ref={btnRef}
                    onClick={handleApplyClick}
                >
                    {finalCTA.finalButtonText}
                </button>
            </div>
        </section>
    );
};

export default FinalCTA;
