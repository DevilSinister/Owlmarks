import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { owmarkContent } from '../data/owmarkContent';
import './TalentV2.css';

gsap.registerPlugin(ScrollTrigger);

const TalentV2 = () => {
    const pageRef = useRef(null);
    const { talentV2 } = owmarkContent;

    if (!talentV2) return <div style={{ color: 'white', padding: '100px' }}>Error: Talent Content Missing</div>;

    useEffect(() => {
        const ctx = gsap.context(() => {

            // Hero Animation
            const tl = gsap.timeline();
            tl.fromTo('.tv2-hero-title div',
                { y: 100, opacity: 0 },
                { y: 0, opacity: 1, duration: 1.2, stagger: 0.1, ease: 'power3.out' }
            )
                .fromTo('.tv2-hero-cta-wrapper',
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.8 },
                    "-=0.5"
                );

            // Plateau List Animation
            gsap.from('.tv2-plateau-item', {
                scrollTrigger: {
                    trigger: '.tv2-plateau',
                    start: 'top 60%',
                },
                x: -50,
                opacity: 0, /* Start hidden and rely on CSS opacity for hover state after */
                duration: 0.8,
                stagger: 0.1,
                ease: 'power2.out',
                onComplete: () => {
                    // Reset opacity to allow CSS hover effects
                    gsap.set('.tv2-plateau-item', { clearProps: 'opacity' });
                    // Re-apply base class opacity via CSS, GSAP overrides inline styles
                }
            });

            // Ascension Model Animation
            gsap.utils.toArray('.tv2-step').forEach((step, i) => {
                gsap.from(step, {
                    scrollTrigger: {
                        trigger: step,
                        start: 'top 85%',
                    },
                    y: 30,
                    opacity: 0,
                    duration: 0.6,
                    delay: i * 0.1
                });
            });

            // Proof Metrics Animation
            gsap.utils.toArray('.tv2-metric-val').forEach((metric) => {
                gsap.from(metric, {
                    scrollTrigger: {
                        trigger: metric,
                        start: 'top 80%',
                    },
                    scale: 0.5,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'back.out(1.7)'
                });
            });

        }, pageRef);

        return () => ctx.revert();
    }, []);

    return (
        <div className="talent-v2-container" ref={pageRef}>

            {/* Abstract Shapes (Mobile/Desktop) */}
            <div className="tv2-shape-1"></div>
            <div className="tv2-shape-2"></div>

            {/* HERO */}
            <section className="tv2-hero">
                <div className="tv2-hero-bg">
                    {/* Placeholder for video */}
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }}
                    >
                        <source src="/assets/hero-bg.mp4" type="video/mp4" />
                    </video>
                </div>
                <div className="tv2-hero-title">
                    <div>{talentV2.hero.line1}</div>
                    <div className="tv2-outline">{talentV2.hero.line2}</div>
                    <div style={{ marginTop: '2vh' }}>{talentV2.hero.line3}</div>
                    <div className="tv2-outline">{talentV2.hero.line4}</div>
                </div>
                <div className="tv2-hero-cta-wrapper">
                    <Link to="/apply" className="tv2-hero-btn">
                        {talentV2.hero.ctaText}
                    </Link>
                    <div className="tv2-hero-sub">{talentV2.hero.subText}</div>
                </div>
            </section>

            {/* PLATEAU TRAP */}
            <section className="tv2-plateau">
                <h2 className="tv2-plateau-headline">{talentV2.plateau.headline}</h2>
                <div className="tv2-plateau-list">
                    {talentV2.plateau.points.map((point, i) => (
                        <div key={i} className="tv2-plateau-item">{point}</div>
                    ))}
                </div>
            </section>

            {/* ASCENSION MODEL */}
            <section className="tv2-ascension">
                <span className="tv2-section-label">{talentV2.ascensionModel.title}</span>
                <div className="tv2-steps">
                    {talentV2.ascensionModel.steps.map((step, i) => (
                        <div key={i} className="tv2-step">
                            <span className="tv2-step-num">{step.number}</span>
                            <span className="tv2-step-title">{step.title}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* PROOF OF SCALE */}
            <section className="tv2-proof">
                {talentV2.proofOfScale.metrics.map((metric, i) => (
                    <div key={i} className="tv2-metric">
                        <span className="tv2-metric-val">{metric.value}</span>
                        <span className="tv2-metric-label">{metric.label}</span>
                    </div>
                ))}
            </section>

            {/* SELECTIVITY */}
            <section className="tv2-selectivity">
                <h2 className="tv2-sel-headline">
                    <div>{talentV2.selectivity.headlineLine1}</div>
                    <div className="tv2-outline">{talentV2.selectivity.headlineLine2}</div>
                    <div>{talentV2.selectivity.headlineLine3}</div>
                </h2>
                <div className="tv2-traits">
                    {talentV2.selectivity.traits.map((trait, i) => (
                        <span key={i} className="tv2-trait">{trait}</span>
                    ))}
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="tv2-final">
                <h2 className="tv2-final-head">{talentV2.finalCTA.headline}</h2>
                <Link to="/apply" className="tv2-hero-btn">
                    {talentV2.finalCTA.buttonText}
                </Link>
            </section>
        </div>
    );
};

export default TalentV2;
