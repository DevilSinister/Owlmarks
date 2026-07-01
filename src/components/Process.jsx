import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { owmarkContent } from '../data/owmarkContent';
import './Process.css';

gsap.registerPlugin(ScrollTrigger);

const Process = () => {
    const sectionRef = useRef(null);
    const headlineRef = useRef(null);
    const lineRef = useRef(null);
    const stepsRef = useRef([]);

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
                        start: "top 75%",
                    }
                }
            );

            // Timeline Line Animation
            gsap.fromTo(lineRef.current,
                { height: "0%" },
                {
                    height: "100%",
                    duration: 1.5,
                    ease: "none",
                    scrollTrigger: {
                        trigger: ".process-timeline",
                        start: "top 60%",
                        end: "bottom 80%",
                        scrub: 1
                    }
                }
            );

            // Steps Animation
            stepsRef.current.forEach((el, index) => {
                gsap.fromTo(el,
                    { x: index % 2 === 0 ? -50 : 50, opacity: 0 },
                    {
                        x: 0,
                        opacity: 1,
                        duration: 0.8,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: el,
                            start: "top 80%",
                        }
                    }
                );
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const { processSection } = owmarkContent;

    return (
        <section className="process-section" ref={sectionRef}>
            <div className="container">

                <div className="process-header" ref={headlineRef}>
                    <h2>{processSection.headlineLine1}</h2>
                    <h2>{processSection.headlineLine2}</h2>
                </div>

                <div className="process-timeline">
                    <div className="timeline-line-bg"></div>
                    <div className="timeline-line-accent" ref={lineRef}></div>

                    <div className="process-steps">
                        {processSection.stepsArray.map((step, index) => (
                            <div
                                key={index}
                                className={`process-step ${index % 2 !== 0 ? 'step-right' : 'step-left'}`}
                                ref={el => stepsRef.current[index] = el}
                            >
                                <div className="step-content">
                                    <span className="step-number">{step.number}</span>
                                    <h3 className="step-title">{step.title}</h3>
                                    <p className="step-desc">{step.description}</p>
                                </div>
                                <div className="step-marker"></div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Process;
