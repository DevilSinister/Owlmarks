import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { owmarkContent } from '../data/owmarkContent';
import { usePageTransition } from '../hooks/usePageTransition';
import './Umbrella.css';

gsap.registerPlugin(ScrollTrigger);

const Umbrella = () => {
    const sectionRef = useRef(null);
    const headlineRef = useRef(null);
    const pillarsRef = useRef([]);
    const navigateTo = usePageTransition();

    useEffect(() => {
        const ctx = gsap.context(() => {

            // Headline Aniamtion
            gsap.fromTo(headlineRef.current.children,
                { y: 100, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    stagger: 0.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 75%",
                    }
                }
            );

            // Pillars Animation
            gsap.fromTo(pillarsRef.current,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.2,
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

    const { umbrellaSection } = owmarkContent;

    return (
        <section className="umbrella-section" ref={sectionRef}>
            <div className="container">

                {/* Headline */}
                <div className="umbrella-headline" ref={headlineRef}>
                    <h2 className="headline-line">{umbrellaSection.mainHeadlineLine1}</h2>
                    <h2 className="headline-line indent-1">{umbrellaSection.mainHeadlineLine2}</h2>
                    <h2 className="headline-line indent-2">{umbrellaSection.mainHeadlineLine3}</h2>
                </div>

                {/* Pillars Grid */}
                <div className="umbrella-pillars">
                    {umbrellaSection.pillarsArray.map((pillar, index) => (
                        <div
                            key={pillar.id}
                            className="pillar-card"
                            ref={el => pillarsRef.current[index] = el}
                            onClick={() => {
                                if (pillar.id === 'p1') navigateTo('/talent-v2');
                                if (pillar.id === 'p2') navigateTo('/brands-v2');
                                if (pillar.id === 'p3') navigateTo('/hospitality-v2');
                            }}
                            style={{ cursor: 'pointer' }}
                        >
                            {/* Background Image - Optimized with CSS content-visibility if supported, or rely on browser */}
                            <div
                                className="pillar-bg"
                                style={{
                                    backgroundImage: `url(${pillar.image})`,
                                    contentVisibility: 'auto'
                                }}
                            ></div>

                            {/* Overlay */}
                            <div className="pillar-overlay"></div>

                            {/* Accent Line */}
                            <div className="pillar-accent"></div>

                            {/* Content */}
                            <div className="pillar-content">
                                <h3 className="pillar-title">{pillar.title}</h3>
                                <p className="pillar-desc">{pillar.shortDescription}</p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Umbrella;
