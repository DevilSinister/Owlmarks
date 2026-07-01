import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { owmarkContent } from '../data/owmarkContent';
import './Apply.css';

gsap.registerPlugin(ScrollTrigger);

const Apply = () => {
    const pageRef = useRef(null);
    const { applyPage } = owmarkContent;

    useEffect(() => {
        const ctx = gsap.context(() => {

            // Hero
            const tl = gsap.timeline();
            tl.fromTo('.ap-hero-title',
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
            )
                .fromTo('.ap-hero-sub',
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1, delay: -0.8 }
                )
                .fromTo('.ap-hero-desc',
                    { opacity: 0 },
                    { opacity: 1, duration: 1, delay: -0.6 }
                )
                .fromTo('.ap-btn-group',
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.8, delay: -0.6 }
                );

            // Cards
            gsap.from('.ap-card', {
                scrollTrigger: { trigger: '.ap-qual', start: 'top 70%' },
                y: 50, opacity: 0, duration: 0.8, stagger: 0.2, ease: 'power2.out'
            });

            // Disqualification
            gsap.from('.ap-disqual-item', {
                scrollTrigger: { trigger: '.ap-disqual', start: 'top 75%' },
                x: -20, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out'
            });

            // Process
            gsap.from('.ap-step', {
                scrollTrigger: { trigger: '.ap-process', start: 'top 70%' },
                x: -30, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out'
            });

        }, pageRef);

        return () => ctx.revert();
    }, []);

    const scrollToQual = () => {
        const element = document.getElementById('qualification');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="apply-page-container" ref={pageRef}>

            {/* HERO */}
            <section className="ap-hero">
                <h1 className="ap-hero-title">{applyPage.hero.title}</h1>
                <h2 className="ap-hero-sub">{applyPage.hero.subtitle}</h2>
                <p className="ap-hero-desc">{applyPage.hero.description}</p>
                <div className="ap-btn-group">
                    <a href={applyPage.hero.whatsappLink} target="_blank" rel="noopener noreferrer" className="ap-btn-primary">
                        {applyPage.hero.primaryBtn}
                    </a>
                    <button onClick={scrollToQual} className="ap-btn-secondary">
                        {applyPage.hero.secondaryBtn}
                    </button>
                </div>
            </section>

            {/* QUALIFICATION */}
            <section id="qualification" className="ap-qual">
                <h2 className="ap-section-head">{applyPage.qualification.title}</h2>
                <div className="ap-qual-grid">
                    {applyPage.qualification.cards.map((card, i) => (
                        <div key={i} className="ap-card">
                            <h3 className="ap-card-title">{card.title}</h3>
                            <p className="ap-card-text">{card.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* DISQUALIFICATION */}
            <section className="ap-disqual">
                <h2 className="ap-section-head" style={{ color: '#666', marginBottom: '3rem' }}>{applyPage.disqualification.title}</h2>
                <div className="ap-disqual-list">
                    {applyPage.disqualification.points.map((pt, i) => (
                        <div key={i} className="ap-disqual-item">{pt}</div>
                    ))}
                </div>
            </section>

            {/* PROCESS */}
            <section className="ap-process">
                <h2 className="ap-section-head">{applyPage.process.title}</h2>
                <div className="ap-step-list">
                    {applyPage.process.steps.map((step, i) => (
                        <div key={i} className="ap-step">
                            <span className="ap-step-num">0{i + 1}</span>
                            <span className="ap-step-txt">{step}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="ap-final">
                <h2 className="ap-section-head" style={{ marginBottom: '2rem' }}>{applyPage.finalCTA.title}</h2>
                <p className="ap-final-desc">{applyPage.finalCTA.description}</p>
                <a href={applyPage.hero.whatsappLink} target="_blank" rel="noopener noreferrer" className="ap-btn-primary">
                    {applyPage.finalCTA.buttonText}
                </a>
            </section>

        </div>
    );
};

export default Apply;
