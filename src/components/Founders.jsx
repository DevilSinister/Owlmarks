import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { owmarkContent } from '../data/owmarkContent';
import './Founders.css';

gsap.registerPlugin(ScrollTrigger);

const Founders = () => {
    const navigate = useNavigate();
    const sectionRef = useRef(null);
    const headlineRef = useRef(null);
    const panelsRef = useRef([]);
    const [activeIndex, setActiveIndex] = useState(0); // For Desktop Accordion
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.matchMedia("(max-width: 768px)").matches);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

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
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const { foundersSection } = owmarkContent;

    return (
        <section className="founders-section" ref={sectionRef}>
            <div className="container">

                <div className="founders-header" ref={headlineRef}>
                    <h2>{foundersSection.headlineLine1}</h2>
                    <h2>{foundersSection.headlineLine2}</h2>
                </div>

                <div className={`founders-layout ${isMobile ? 'mobile-stack' : 'desktop-accordion'}`}>
                    {foundersSection.founders.map((founder, index) => (
                        <div
                            key={founder.id}
                            className={`founder-card ${activeIndex === index && !isMobile ? 'active' : ''}`}
                            ref={el => panelsRef.current[index] = el}
                            onMouseEnter={() => !isMobile && setActiveIndex(index)}
                            onClick={() => navigate(`/founder/${founder.slug}`)}
                            style={isMobile ? { top: `${10 + index * 5}vh` } : {}}
                        >
                            <div className="founder-img-wrapper">
                                <div
                                    className="founder-img"
                                    style={{
                                        backgroundImage: `url(${founder.image})`,
                                        contentVisibility: 'auto'
                                    }}
                                    role="img"
                                    aria-label={founder.name}
                                ></div>
                            </div>

                            <div className="founder-content">
                                <div className="founder-titles">
                                    <h3 className="founder-name">{founder.name}</h3>
                                    <h4 className="founder-role">{founder.role}</h4>
                                </div>
                                <div className="founder-bio-wrapper">
                                    <p className="founder-bio">{founder.bio}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Founders;
