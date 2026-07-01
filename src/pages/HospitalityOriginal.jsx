import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { owmarkContent } from '../data/owmarkContent';
import './PageStyles.css';

const HospitalityOriginal = () => {
    const pageRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.cs-page-card', {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out'
            });
        }, pageRef);
        return () => ctx.revert();
    }, []);

    const { dedicatedPageContent } = owmarkContent;
    // Filter for hospitality related projects (Resort, Dining, Boutique)
    const hospitalityProjects = dedicatedPageContent.fullCaseStudies.filter(p =>
        p.title.includes('Resort') ||
        p.title.includes('Dining') ||
        p.title.includes('Boutique')
    );

    return (
        <div className="sub-page-container" ref={pageRef}>
            <header className="cs-page-header">
                <h1 className="cs-page-title">
                    Hospi<span className="text-stroke">tality</span>
                </h1>
            </header>

            <div className="container" style={{ marginBottom: '4rem', maxWidth: '800px', textAlign: 'center' }}>
                <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>
                    We specialize in transforming venues into destinations.
                    From luxury resorts to high-energy dining, we craft digital narratives that fill rooms and tables.
                </p>
            </div>

            <div className="cs-page-grid">
                {hospitalityProjects.map((project) => (
                    <article className="cs-page-card" key={project.id}>
                        <div className="cs-page-img-wrapper">
                            <div
                                className="cs-page-img"
                                style={{ backgroundImage: `url(${project.image})` }}
                            ></div>
                            <div className="cs-page-overlay">
                                <span className="cs-page-metric">{project.metricHeadline}</span>
                            </div>
                        </div>
                        <div className="cs-page-info">
                            <h2 className="cs-page-project-title">{project.title}</h2>
                            <p className="cs-page-project-desc">{project.description}</p>
                            <div className="cs-page-tags">
                                {project.statList.map((stat, i) => (
                                    <span key={i} className="cs-page-tag">{stat}</span>
                                ))}
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
};

export default HospitalityOriginal;
