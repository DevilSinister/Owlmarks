import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { owmarkContent } from '../data/owmarkContent';
import './CaseStudies.css';

gsap.registerPlugin(ScrollTrigger);

const CaseStudies = () => {
    const sectionRef = useRef(null);
    const headlineRef = useRef(null);
    const casesRef = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {

            // 1. Headline Animation (Fade + Slide Up)
            gsap.fromTo(headlineRef.current,
                { y: 100, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 75%",
                    }
                }
            );

            // 2. Case Studies Animation (Staggered + Parallax)
            casesRef.current.forEach((el, index) => {
                const image = el.querySelector('.cs-image-wrapper');
                const content = el.querySelector('.cs-content');

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: el,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                });

                tl.fromTo(content,
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
                )
                    .fromTo(image,
                        { scale: 1.1, opacity: 0 },
                        { scale: 1, opacity: 1, duration: 1.2, ease: "power2.out" },
                        "-=0.8"
                    );
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const { caseStudiesSection } = owmarkContent;

    return (
        <section className="cs-section" ref={sectionRef}>
            <div className="container">

                {/* HEADLINE */}
                <div className="cs-header-wrapper">
                    <h2 className="cs-main-headline" ref={headlineRef}>
                        {caseStudiesSection.headlineLine1}
                        <br />
                        <span className="cs-headline-outline">{caseStudiesSection.headlineLine2}</span>
                    </h2>
                </div>

                {/* CASE LIST */}
                <div className="cs-list">
                    {caseStudiesSection.caseStudies.map((item, index) => (
                        <div
                            key={item.id}
                            ref={el => casesRef.current[index] = el}
                            className={`cs-row ${index % 2 !== 0 ? 'cs-row-reverse' : ''}`}
                            style={{ top: `${index * 30}px` }} // Subtle Stacking Offset
                        >

                            {/* CONTENT BLOCK */}
                            <div className="cs-content">
                                <h3 className="cs-metric-statement">{item.metricHeadline}</h3>
                                <h4 className="cs-case-title">{item.title}</h4>
                                <p className="cs-case-desc">{item.description}</p>

                                <ul className="cs-stats-loop">
                                    {item.statList.map((stat, i) => (
                                        <li key={i} className="cs-loop-item">
                                            <span className="cs-bullet">/</span> {stat}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* IMAGE BLOCK */}
                            <div className="cs-image-block">
                                <div className="cs-image-wrapper">
                                    <div
                                        className="cs-image"
                                        style={{ backgroundImage: `url(${item.image})` }}
                                    ></div>
                                    <div className="cs-accent-line"></div>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default CaseStudies;
