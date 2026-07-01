import React, { useEffect, useRef, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { owmarkContent } from '../data/owmarkContent';
import { FaInstagram, FaTwitter, FaLinkedin, FaGlobe, FaLink } from 'react-icons/fa';
import CaseStudyModal from '../components/CaseStudyModal';
import './PageStyles.css'; // Reusing page styles

gsap.registerPlugin(ScrollTrigger);

const getSocialIcon = (platform) => {
    if (!platform) return <FaLink />;
    const p = platform.toLowerCase();
    if (p.includes('instagram')) return <FaInstagram />;
    if (p.includes('twitter') || p.includes('x')) return <FaTwitter />;
    if (p.includes('linkedin')) return <FaLinkedin />;
    if (p.includes('website') || p.includes('globe')) return <FaGlobe />;
    return <FaLink />;
};

const FounderProfile = () => {
    const { slug } = useParams();
    const containerRef = useRef(null);
    const [selectedProject, setSelectedProject] = useState(null);

    // Find Founder Data
    const founder = owmarkContent.foundersSection.founders.find(f => f.slug === slug);

    // Find Related Projects
    const projects = founder && founder.projects
        ? owmarkContent.dedicatedPageContent.fullCaseStudies.filter(cs => founder.projects.includes(cs.id))
        : [];

    useEffect(() => {
        if (!founder) return;

        const ctx = gsap.context(() => {
            // Entrance
            gsap.from(".fd-hero-text", { y: 50, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.1 });
            gsap.from(".fd-hero-img", { scale: 1.1, opacity: 0, duration: 1.2, ease: "power2.out", delay: 0.2 });
            gsap.from(".fd-stat-item", { y: 20, opacity: 0, duration: 0.8, delay: 0.5, stagger: 0.1 });
            gsap.from(".fd-project-card", { y: 50, opacity: 0, duration: 0.8, delay: 0.8, stagger: 0.1, scrollTrigger: { trigger: ".fd-projects-section", start: "top 80%" } });
        }, containerRef);

        return () => ctx.revert();
    }, [founder]);

    if (!founder) return <div style={{ color: 'white', padding: '100px' }}>Founder Not Found</div>;

    return (
        <div className="sub-page-container" ref={containerRef}>

            {/* MODAL */}
            {selectedProject && (
                <CaseStudyModal
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                />
            )}

            {/* --- HERO SECTION --- */}
            <div className="fd-hero-section">
                <div className="fd-hero-content">
                    <span className="fd-hero-role fd-hero-text">{founder.role}</span>
                    <h1 className="fd-hero-name fd-hero-text">{founder.name.toUpperCase()}</h1>
                    <p className="fd-hero-bio fd-hero-text">{founder.fullBio}</p>

                    <div className="fd-socials-row fd-hero-text">
                        {founder.socials.map((social, i) => (
                            <a key={i} href={social.url} target="_blank" rel="noopener noreferrer" className="fd-social-link">
                                {getSocialIcon(social.platform)}
                            </a>
                        ))}
                    </div>

                    <div className="fd-stats-grid">
                        {Object.entries(founder.stats).map(([key, value], i) => (
                            <div key={i} className="fd-stat-item">
                                <span className="fd-stat-value">{value}</span>
                                <span className="fd-stat-label">{key}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="fd-hero-image-wrapper">
                    <div className="fd-hero-img" style={{ backgroundImage: `url(${founder.image})` }}></div>
                    <div className="fd-img-overlay"></div>
                </div>
            </div>

            {/* --- WORK SECTION --- */}
            {projects.length > 0 && (
                <div className="fd-projects-section">
                    <div className="cs-page-header" style={{ height: 'auto', padding: '10vh 0 5vh', borderBottom: 'none' }}>
                        <h2 className="cs-page-title" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}>
                            SELECTED <span className="text-stroke">WORKS.</span>
                        </h2>
                    </div>

                    {/* Added cs-archive-grid for mobile 2-col layout */}
                    <div className="cs-page-grid cs-archive-grid">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="cs-page-card cs-archive-card-v2 fd-project-card"
                                onClick={() => setSelectedProject(project)}
                            >
                                <div className="cs-card-bg" style={{ backgroundImage: `url(${project.image})` }}></div>
                                <div className="cs-card-overlay"></div>

                                <div className="cs-card-inner">
                                    <div className="cs-card-top">
                                        <span className="cs-card-category">{project.category || "BRANDING"}</span>
                                        {/* Relationship badge in new mobile-friendly position */}
                                        <span className="cs-card-relationship">{project.relationship || "PARTNERSHIP"}</span>
                                        <h3 className="cs-card-name">{project.name || project.title}</h3>
                                    </div>

                                    <div className="cs-card-bottom">
                                        <div className="cs-card-metric-block">
                                            <span className="cs-card-metric-value">{project.metricHeadline}</span>
                                        </div>
                                        <div className="cs-card-arrow">→</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div style={{ height: '10vh' }}></div>
        </div>
    );
};

export default FounderProfile;
