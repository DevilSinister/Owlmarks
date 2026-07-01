import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { owmarkContent } from '../data/owmarkContent';
import './HospitalityV2.css';

gsap.registerPlugin(ScrollTrigger);

const HospitalityV2 = () => {
    const pageRef = useRef(null);
    const { hospitalityV2 } = owmarkContent;

    if (!hospitalityV2) return <div style={{ color: 'white', padding: '100px' }}>Error: Hospitality Content Missing</div>;

    useEffect(() => {
        const ctx = gsap.context(() => {

            // Hero Animations
            const tl = gsap.timeline();
            tl.fromTo('.hv2-hero-title div',
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out' }
            )
                .fromTo('.hv2-btn',
                    { scale: 0.8, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' },
                    "-=0.5"
                );

            // Inconsistency Points
            gsap.fromTo('.hv2-pain-item',
                { y: 30, opacity: 0 },
                {
                    scrollTrigger: { trigger: '.hv2-pain', start: 'top 75%' },
                    y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power2.out'
                }
            );

            // Growth Engine Steps
            gsap.fromTo('.hv2-step-row',
                { x: -50, opacity: 0 },
                {
                    scrollTrigger: { trigger: '.hv2-engine', start: 'top 70%' },
                    x: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out'
                }
            );

            // Metrics
            gsap.fromTo('.hv2-metric-block',
                { scale: 0.5, opacity: 0 },
                {
                    scrollTrigger: { trigger: '.hv2-trans', start: 'top 75%' },
                    scale: 1, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'back.out(1.7)'
                }
            );

            // ROI Bar Grow
            gsap.fromTo('.hv2-viz',
                { width: '0%' },
                {
                    scrollTrigger: { trigger: '.hv2-roi', start: 'top 80%' },
                    width: '100%', duration: 1.5, ease: 'power3.inOut'
                }
            );

        }, pageRef);

        return () => ctx.revert();
    }, []);

    // Helper to split headline
    const SplitHead = ({ text, isAccent }) => {
        if (!text) return null;
        return <div className={isAccent ? 'hv2-hero-accent' : ''}>{text}</div>;
    };

    return (
        <div className="hospitality-v2-container" ref={pageRef}>

            {/* Abstract Shapes */}
            <div className="hv2-shape-1"></div>
            <div className="hv2-shape-2"></div>

            {/* HERO */}
            <section className="hv2-hero">
                <div className="hv2-hero-bg">
                    <img src={hospitalityV2.hero.fallbackImg} className="hv2-bg-img" alt="Restaurant Ambiance" />
                    <div className="hv2-hero-overlay"></div>
                </div>
                <div className="hv2-hero-content">
                    <div className="hv2-hero-title">
                        <SplitHead text={hospitalityV2.hero.line1} />
                        <SplitHead text={hospitalityV2.hero.line2} />
                        <SplitHead text={hospitalityV2.hero.line3} isAccent={true} />
                        <SplitHead text={hospitalityV2.hero.line4} />
                    </div>
                    <Link to="/apply" className="hv2-btn">
                        {hospitalityV2.hero.ctaText}
                    </Link>
                </div>
            </section>

            {/* INCONSISTENCY */}
            <section className="hv2-pain">
                <span className="hv2-pain-head">{hospitalityV2.inconsistency.title}</span>
                <div className="hv2-pain-grid">
                    {hospitalityV2.inconsistency.points.map((pt, i) => (
                        <div key={i} className="hv2-pain-item">{pt}</div>
                    ))}
                </div>
            </section>

            {/* GROWTH ENGINE */}
            <section className="hv2-engine">
                <div className="container">
                    <h2 className="hv2-engine-head">{hospitalityV2.growthEngine.title}</h2>
                    <div className="hv2-steps-col">
                        {hospitalityV2.growthEngine.steps.map((step, i) => (
                            <div key={i} className="hv2-step-row">
                                <span className="hv2-step-num">{step.number}</span>
                                <span className="hv2-step-txt">{step.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TRANSFORMATION */}
            <section className="hv2-trans">
                <h2 className="hv2-trans-head">{hospitalityV2.transformation.title}</h2>
                <div className="hv2-metrics-row">
                    {hospitalityV2.transformation.metrics.map((m, i) => (
                        <div key={i} className="hv2-metric-block">
                            <span className="hv2-metric-val">{m.value}</span>
                            <span className="hv2-metric-lbl">{m.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ROI LOGIC */}
            <section className="hv2-roi">
                <span className="hv2-pain-head" style={{ marginBottom: '2rem' }}>{hospitalityV2.roiLogic.title}</span>
                <h2 className="hv2-roi-head">{hospitalityV2.roiLogic.headline}</h2>
                <p className="hv2-roi-text">{hospitalityV2.roiLogic.description}</p>

                <div className="hv2-viz">
                    <div className="hv2-bar-spend">INVESTMENT</div>
                    <div className="hv2-bar-return">4X RETURN</div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="hv2-final">
                <h2 className="hv2-final-head">{hospitalityV2.finalCTA.headline}</h2>
                <Link to="/apply" className="hv2-btn">
                    {hospitalityV2.finalCTA.buttonText}
                </Link>
            </section>

        </div>
    );
};

export default HospitalityV2;
