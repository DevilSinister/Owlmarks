import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { owmarkContent } from '../data/owmarkContent';
import { FaInstagram, FaTiktok, FaYoutube, FaTwitter, FaLinkedin, FaLink } from 'react-icons/fa';
import CaseStudyModal from '../components/CaseStudyModal';
import './PageStyles.css';

const getSocialIcon = (platform) => {
    if (!platform) return <FaLink />;
    const p = platform.toLowerCase();
    if (p.includes('instagram')) return <FaInstagram />;
    if (p.includes('tiktok')) return <FaTiktok />;
    if (p.includes('youtube')) return <FaYoutube />;
    if (p.includes('twitter') || p.includes('x')) return <FaTwitter />;
    if (p.includes('linkedin')) return <FaLinkedin />;
    return <FaLink />;
};

const CaseStudiesPage = () => {
    const containerRef = useRef(null);
    const [activeTab, setActiveTab] = useState('archive'); // 'archive' or 'roster'

    useEffect(() => {
        // Simple fade in for content switch
        const ctx = gsap.context(() => {
            gsap.fromTo(".cs-page-grid",
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
            );
        }, containerRef);
        return () => ctx.revert();
    }, [activeTab]);

    const { dedicatedPageContent } = owmarkContent;
    const [selectedProject, setSelectedProject] = useState(null);

    // Filter project-like case studies
    const archiveProjects = dedicatedPageContent.fullCaseStudies.filter(p => !p.id.startsWith('tln'));
    // Since we also had 'roster' mixed in originally? 
    // Wait, in previous file `activeTab === 'archive'` mapped `dedicatedPageContent.fullCaseStudies`. 
    // And `activeTab === 'roster'` mapped `dedicatedPageContent.fullTalentRoster`. 
    // We will keep the tab switcher but update the display for 'archive' tab to new Design.

    return (
        <div className="sub-page-container" ref={containerRef}>

            {/* MODAL */}
            {selectedProject && (
                <CaseStudyModal
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                />
            )}

            <div className="cs-page-header">
                <div className="cs-switcher">
                    <button
                        className={`cs-switch-btn ${activeTab === 'archive' ? 'active' : ''}`}
                        onClick={() => setActiveTab('archive')}
                    >
                        THE ARCHIVE
                    </button>
                    <span className="cs-switch-divider">/</span>
                    <button
                        className={`cs-switch-btn ${activeTab === 'roster' ? 'active' : ''}`}
                        onClick={() => setActiveTab('roster')}
                    >
                        THE ROSTER
                    </button>
                </div>
            </div>

            {/* CONTENT GRID */}
            <div className={`cs-page-grid ${activeTab === 'archive' ? 'cs-archive-grid' : (activeTab === 'roster' ? 'cs-roster-grid' : '')}`}>

                {/* ARCHIVE TAB (NEW DESIGN) */}
                {activeTab === 'archive' && archiveProjects.map((project) => (
                    <div
                        key={project.id}
                        className="cs-page-card cs-archive-card-v2"
                        onClick={() => setSelectedProject(project)}
                    >
                        <div className="cs-card-inner">
                            {/* Background Image with Overlay */}
                            <div className="cs-card-bg" style={{ backgroundImage: `url(${project.image})` }}></div>
                            <div className="cs-card-overlay"></div>

                            {/* Top Content */}
                            <div className="cs-card-top">
                                <div className="cs-card-identity">
                                    <span className="cs-card-category">{project.category}</span>
                                    <h3 className="cs-card-name">{project.name}</h3>
                                </div>
                                <span className="cs-card-relationship">{project.relationship}</span>
                            </div>

                            {/* Bottom Content: Single Power Metric */}
                            <div className="cs-card-bottom">
                                <div className="cs-card-metric-block">
                                    <span className="cs-card-metric-value">{project.metricHeadline}</span>
                                    <span className="cs-card-metric-label">Key Outcome</span>
                                </div>
                                <div className="cs-card-arrow">
                                    <FaLink />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* ROSTER TAB (NEW DESIGN - MATCHING ARCHIVE) */}
                {activeTab === 'roster' && dedicatedPageContent.fullTalentRoster.map((talent) => (
                    <div
                        key={talent.id}
                        className="cs-page-card cs-archive-card-v2 cs-roster-style"
                        onClick={() => setSelectedProject(talent)}
                    >
                        <div className="cs-card-bg" style={{ backgroundImage: `url(${talent.image})` }}></div>
                        <div className="cs-card-overlay"></div>

                        <div className="cs-card-inner">
                            <div className="cs-card-top">
                                <span className="cs-card-category">{talent.category || talent.niche || "TALENT"}</span>
                                <span className="cs-card-relationship">{talent.relationship || "EXCLUSIVE"}</span>
                                <h3 className="cs-card-name">{talent.name}</h3>
                            </div>

                            <div className="cs-card-bottom">
                                <div className="cs-card-metric-block">
                                    <span className="cs-card-metric-value">{talent.metricHeadline || talent.stats || "GROWTH"}</span>
                                    <span className="cs-card-metric-label">Key Metric</span>
                                </div>
                                <div className="cs-card-arrow">→</div>
                            </div>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
};

export default CaseStudiesPage;
