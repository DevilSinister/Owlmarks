import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { owmarkContent } from '../data/owmarkContent';
import './BrandsV2.css';

gsap.registerPlugin(ScrollTrigger);

const BrandsV2 = () => {
    const pageRef = useRef(null);
    const { brandsV2, dedicatedPageContent } = owmarkContent;

    if (!brandsV2) return <div style={{ color: 'black', padding: '100px' }}>Error: Brands Content Missing</div>;

    useEffect(() => {
        const ctx = gsap.context(() => {

            // Hero
            const tl = gsap.timeline();
            tl.fromTo('.bv2-hero-title div',
                { x: -50, opacity: 0 },
                { x: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out' }
            )
                .fromTo('.bv2-btn',
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.8 },
                    "-=0.5"
                );

            // Market Reality
            gsap.from('.bv2-reality-head div', {
                scrollTrigger: { trigger: '.bv2-reality', start: 'top 70%' },
                y: 50, opacity: 0, duration: 1, stagger: 0.2, ease: 'power3.out'
            });

            // Architecture List
            gsap.from('.bv2-system-row', {
                scrollTrigger: { trigger: '.bv2-arch', start: 'top 70%' },
                x: -30, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out'
            });

            // Case Studies
            gsap.from('.bv2-case-row', {
                scrollTrigger: { trigger: '.bv2-impact', start: 'top 70%' },
                y: 50, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out'
            });

        }, pageRef);

        return () => ctx.revert();
    }, []);

    // Helper to split headline
    const SplitHead = ({ text }) => {
        if (!text) return null;
        return <div>{text}</div>;
    };

    return (
        <div className="brands-v2-container" ref={pageRef}>

            {/* Abstract Shapes */}
            <div className="bv2-shape-1"></div>
            <div className="bv2-shape-2"></div>

            {/* HERO */}
            <section className="bv2-hero">
                <div className="bv2-hero-texture"></div>
                <div className="bv2-hero-title">
                    <div className="bv2-hero-group">
                        <SplitHead text={brandsV2.hero.line1} />
                        <SplitHead text={brandsV2.hero.line2} />
                        <SplitHead text={brandsV2.hero.line3} />
                    </div>
                    <div className="bv2-hero-group" style={{ marginBottom: '4rem' }}>
                        <SplitHead text={brandsV2.hero.line4} />
                        <SplitHead text={brandsV2.hero.line5} />
                        <div style={{ color: 'var(--color-accent)' }}>{brandsV2.hero.line6}</div>
                    </div>
                </div>
                <Link to="/apply" className="bv2-btn">
                    {brandsV2.hero.ctaText}
                </Link>
            </section>

            {/* MARKET REALITY */}
            <section className="bv2-reality">
                <h2 className="bv2-reality-head">
                    <div>{brandsV2.marketReality.headlineLine1}</div>
                    <div>{brandsV2.marketReality.headlineLine2}</div>
                </h2>
                <p className="bv2-reality-desc">{brandsV2.marketReality.description}</p>
            </section>

            {/* STRATEGIC ARCHITECTURE */}
            <section className="bv2-arch">
                <span className="bv2-arch-title">{brandsV2.strategicArchitecture.title}</span>
                <div className="bv2-system-grid">
                    {brandsV2.strategicArchitecture.systems.map((sys, i) => (
                        <div key={i} className="bv2-system-row">{sys}</div>
                    ))}
                </div>
            </section>

            {/* CASE IMPACT (Reusing data, new format) */}
            <section className="bv2-impact">
                <span className="bv2-arch-title" style={{ marginBottom: '3rem' }}>{brandsV2.caseImpact.title}</span>
                <div className="bv2-impact-grid">
                    {dedicatedPageContent.fullCaseStudies.slice(0, 3).map((study) => (
                        <div key={study.id} className="bv2-case-row">
                            <div>
                                <div className="bv2-case-metric">{study.metricHeadline}</div>
                                <h3 className="bv2-case-title">{study.title}</h3>
                                <p className="bv2-case-desc">{study.description}</p>
                            </div>
                            <div className="bv2-case-meta">
                                {study.statList[0]} • {study.statList[1]}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* UMBRELLA ADVANTAGE */}
            <section className="bv2-umbrella">
                <h2 className="bv2-umb-head">
                    <div>{brandsV2.umbrellaAdvantage.headlineLine1}</div>
                    <div style={{ color: '#555' }}>{brandsV2.umbrellaAdvantage.headlineLine2}</div>
                    <div style={{ fontSize: '0.5em', margin: '1rem 0' }}>{brandsV2.umbrellaAdvantage.headlineLine3}</div>
                    <div style={{ color: 'var(--color-accent)' }}>{brandsV2.umbrellaAdvantage.headlineLine4}</div>
                </h2>
                <p className="bv2-umb-desc">{brandsV2.umbrellaAdvantage.description}</p>
            </section>

            {/* FINAL CTA */}
            <section className="bv2-final">
                <h2 className="bv2-final-head">{brandsV2.finalCTA.headline}</h2>
                <Link to="/apply" className="bv2-final-btn">
                    {brandsV2.finalCTA.buttonText}
                </Link>
            </section>

        </div>
    );
};

export default BrandsV2;
