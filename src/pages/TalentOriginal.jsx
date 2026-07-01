import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { owmarkContent } from '../data/owmarkContent';
import { FaInstagram, FaTiktok, FaYoutube, FaLink } from 'react-icons/fa6';
import './PageStyles.css';

const TalentOriginal = () => {
    const listRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.cs-roster-card', {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out'
            });
        }, listRef);
        return () => ctx.revert();
    }, []);

    const { dedicatedPageContent } = owmarkContent;
    const roster = dedicatedPageContent.fullTalentRoster;

    const getSocialIcon = (platform) => {
        if (!platform) return <FaLink />;
        const p = platform.toLowerCase();
        if (p.includes('instagram')) return <FaInstagram />;
        if (p.includes('tiktok')) return <FaTiktok />;
        if (p.includes('youtube')) return <FaYoutube />;
        return <FaLink />;
    };

    return (
        <div className="sub-page-container" ref={listRef}>
            <header className="cs-page-header">
                <h1 className="cs-page-title">
                    The <span className="text-stroke">Roster</span>
                </h1>
            </header>

            <div className="cs-page-grid">
                {roster.map((talent) => (
                    <div className="cs-roster-card" key={talent.id}>
                        <div className="cs-roster-img-wrapper">
                            <div
                                className="cs-page-img"
                                style={{ backgroundImage: `url(${talent.image})` }}
                            ></div>
                            <div className="cs-roster-overlay">
                                <div className="cs-roster-niche">{talent.niche}</div>
                                <h2 className="cs-roster-name">{talent.name}</h2>
                                <div className="cs-roster-divider"></div>
                                <div className="cs-roster-stat">{talent.stats}</div>
                            </div>

                            {/* Socials Popout */}
                            <div className="cs-roster-socials">
                                {talent.socials && talent.socials.map((social, i) => (
                                    <a
                                        key={i}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="cs-roster-social-link"
                                    >
                                        {getSocialIcon(social.platform)}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TalentOriginal;
