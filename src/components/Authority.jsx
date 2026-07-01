import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { owmarkContent } from '../data/owmarkContent';
import './Authority.css';

gsap.registerPlugin(ScrollTrigger);

const Authority = () => {
    const sectionRef = useRef(null);
    const headlineRef = useRef(null);
    const metricsRef = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {

            // Headline Animation
            gsap.fromTo(headlineRef.current.children,
                { y: 100, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 70%",
                    }
                }
            );

            // Metrics Animation
            metricsRef.current.forEach((el, index) => {
                gsap.fromTo(el,
                    { y: 50, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 1,
                        delay: index * 0.2,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: "top 60%",
                        }
                    }
                );

                // Count Up Animation (if pure number)
                // Since we have suffixes like "M+" or "#", we might need a custom approach or just animate opacity/slide
                // For simplicity and robustness with strings like "15M+", we'll stick to a slide-up reveal which is very editorial.
                // If strict counting is needed, we'd parse the number. Let's do a text reveal.
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const { authoritySection } = owmarkContent;

    return (
        <section className="authority-section" ref={sectionRef}>
            <div className="container">

                {/* Headline */}
                <div className="authority-headline" ref={headlineRef}>
                    <h2>{authoritySection.headlineLine1}</h2>
                    <h2>{authoritySection.headlineLine2}</h2>
                    <h2>{authoritySection.headlineLine3}</h2>
                </div>

                {/* Metrics Grid */}
                <div className="authority-metrics">
                    {authoritySection.metricsArray.map((metric, index) => (
                        <div
                            key={index}
                            className="metric-block"
                            ref={el => metricsRef.current[index] = el}
                        >
                            <div className="metric-number-wrapper">
                                <span className="metric-number">{metric.number}</span>
                                <span className="metric-underline"></span>
                            </div>
                            <p className="metric-label">{metric.label}</p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Authority;
