import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { FaTimes, FaExternalLinkAlt, FaChartLine, FaInstagram, FaTwitter, FaLinkedin, FaYoutube, FaTiktok } from 'react-icons/fa';
import './CaseStudyModal.css';

// Helper for Social Icons
const getSocialIcon = (platform) => {
    if (!platform) return <FaExternalLinkAlt />;
    const p = platform.toLowerCase();
    if (p.includes('instagram')) return <FaInstagram />;
    if (p.includes('twitter') || p.includes('x')) return <FaTwitter />;
    if (p.includes('linkedin')) return <FaLinkedin />;
    if (p.includes('youtube')) return <FaYoutube />;
    if (p.includes('tiktok')) return <FaTiktok />;
    return <FaExternalLinkAlt />;
};

// ... inside component
const CaseStudyModal = ({ project, onClose }) => {
    const modalRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        const ctx = gsap.context(() => {
            // Modal Backdrop Fade In
            gsap.fromTo(modalRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.4, ease: "power2.out" }
            );

            // Content Slide Up & Fade
            gsap.fromTo(contentRef.current,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, delay: 0.1, ease: "power3.out" }
            );

            // Stagger Metrics
            gsap.fromTo(".cs-modal-metric-card",
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, delay: 0.4, ease: "power2.out" }
            );

            // Stagger Visuals
            gsap.fromTo(".cs-modal-visual-item",
                { scale: 0.95, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.6, ease: "power2.out" }
            );

        }, modalRef);

        return () => {
            document.body.style.overflow = 'unset';
            ctx.revert();
        };
    }, [project]);

    const handleClose = () => {
        gsap.to(modalRef.current, {
            opacity: 0,
            duration: 0.3,
            onComplete: onClose
        });
    };

    if (!project) return null;
    const metricsOrder = [
        { label: "Followers", value: project.metrics?.followers },
        { label: "Avg Views", value: project.metrics?.avgViews },
        { label: "Engagement", value: project.metrics?.engagement || project.metrics?.engagementRate },
        { label: "Reach", value: project.metrics?.reach },
        { label: "Demographic", value: project.metrics?.demographic },
        { label: "Conversions", value: project.metrics?.conversions || project.metrics?.conversion },
        { label: "Impressions", value: project.metrics?.impressions },
        { label: "CTR", value: project.metrics?.ctr },
        { label: "ROAS", value: project.metrics?.roas }
    ].filter(m => m.value);

    return (
        <div className="cs-modal-overlay" ref={modalRef} onClick={handleClose}>
            <div className="cs-modal-container" onClick={(e) => e.stopPropagation()}>

                {/* CLOSE BUTTON */}
                <button className="cs-modal-close" onClick={handleClose}>
                    <FaTimes />
                </button>

                <div className="cs-modal-content" ref={contentRef}>

                    {/* SECTION A: IDENTITY */}
                    <div className="cs-modal-header">
                        <div className="cs-modal-identity">
                            <div className="cs-modal-logo-placeholder" style={{ overflow: 'hidden' }}>
                                {project.logo ? (
                                    <img src={project.logo} alt={project.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    project.name ? project.name.substring(0, 2).toUpperCase() : "CS"
                                )}
                            </div>
                            <div className="cs-modal-title-block">
                                <h2 className="cs-modal-client-name">{project.name}</h2>
                                <span className="cs-modal-relationship">{project.relationship}</span>
                            </div>
                        </div>
                        <div className="cs-modal-meta">
                            <p className="cs-modal-location">{project.location}</p>
                            <p className="cs-modal-duration">{project.campaignDuration}</p>

                            {/* WEBSITE LINK */}
                            {project.website && (
                                <a href={project.website} target="_blank" rel="noopener noreferrer" className="cs-modal-link">
                                    Visit Site <FaExternalLinkAlt size={10} style={{ marginLeft: 5 }} />
                                </a>
                            )}

                            {/* SOCIALS (New Section) */}
                            {project.socials && (
                                <div className="cs-modal-socials" style={{ marginTop: '0.5rem', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                    {project.socials.map((social, i) => (
                                        <a key={i} href={social.url} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', fontSize: '1.2rem', opacity: 0.8, transition: 'opacity 0.2s' }}>
                                            {getSocialIcon(social.platform)}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="cs-modal-divider"></div>

                    <div className="cs-modal-grid-layout">

                        {/* LEFT COLUMN: DESCRIPTION & ROLE */}
                        <div className="cs-modal-left-col">
                            <h3 className="cs-modal-subtitle">The Challenge</h3>
                            <p className="cs-modal-desc">{project.description}</p>

                            <h3 className="cs-modal-subtitle" style={{ marginTop: '2rem' }}>Our Role</h3>
                            <div className="cs-modal-services">
                                {project.servicesProvided && project.servicesProvided.map((service, i) => (
                                    <span key={i} className="cs-modal-pill">{service}</span>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT COLUMN: METRICS (2x3 GRID) */}
                        <div className="cs-modal-right-col">
                            <div className="cs-modal-metrics-grid">
                                {metricsOrder.map((metric, i) => (
                                    <div key={i} className="cs-modal-metric-card">
                                        <span className="cs-metric-value">{metric.value}</span>
                                        <span className="cs-metric-label">{metric.label}</span>
                                        <div className="cs-metric-line"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* SECTION D: VISUAL PROOF */}
                    {project.visuals && project.visuals.length > 0 && (
                        <div className="cs-modal-visuals-section">
                            <h3 className="cs-modal-subtitle">Visual Proof</h3>
                            <div className="cs-modal-visuals-grid">
                                {project.visuals.map((img, i) => (
                                    <div key={i} className="cs-modal-visual-item" style={{ backgroundImage: `url(${img})` }}></div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SECTION E: OUTCOME */}
                    <div className="cs-modal-outcome">
                        <FaChartLine className="cs-outcome-icon" />
                        <p className="cs-outcome-text">"{project.outcome}"</p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CaseStudyModal;
