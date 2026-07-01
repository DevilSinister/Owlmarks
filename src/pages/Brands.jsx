import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { owmarkContent } from '../data/owmarkContent';
import './PageStyles.css';

const Brands = () => {
    const gridRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.cs-page-card', {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out'
            });
        }, gridRef);
        return () => ctx.revert();
    }, []);

    const { dedicatedPageContent } = owmarkContent;
    const projects = dedicatedPageContent.fullCaseStudies;

    return (
        <div className="sub-page-container" ref={gridRef}>
            <header className="cs-page-header">
                <h1 className="cs-page-title">
                    Our <span className="text-stroke">Work</span>
                </h1>
            </header>

            <div className="cs-page-grid">
                {projects.map((project) => (
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

export default Brands;
