import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger, Draggable } from 'gsap/all';
import { FaInstagram, FaTiktok, FaYoutube, FaTwitter, FaLinkedin, FaFacebook, FaLink } from 'react-icons/fa6';
import { owmarkContent } from '../data/owmarkContent';
import './TalentShowcase.css';

gsap.registerPlugin(ScrollTrigger, Draggable);

const getSocialIcon = (platform) => {
    if (!platform) return <FaLink />;
    const p = platform.toLowerCase();
    if (p.includes('instagram')) return <FaInstagram />;
    if (p.includes('tiktok')) return <FaTiktok />;
    if (p.includes('youtube')) return <FaYoutube />;
    if (p.includes('twitter') || p.includes('x')) return <FaTwitter />;
    if (p.includes('linkedin')) return <FaLinkedin />;
    if (p.includes('facebook')) return <FaFacebook />;
    return <FaLink />;
};

const SocialLink = ({ social, index }) => {
    const [count, setCount] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        // Simulate network request "Real-time" fetch
        const delay = 1000 + Math.random() * 1500; // Random delay between 1-2.5s for realism
        const timer = setTimeout(() => {
            setCount(social.followers);
            setLoading(false);
        }, delay);
        return () => clearTimeout(timer);
    }, [social.followers]);

    return (
        <a
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="talent-social-link"
        >
            <div className="ts-left">
                <span className="ts-icon">{getSocialIcon(social.platform)}</span>
                <span className="ts-platform">{social.platform}</span>
            </div>

            <div className="ts-right">
                {loading ? (
                    <div className="ts-loader"></div>
                ) : (
                    <span className="ts-followers fade-in">{count}</span>
                )}
            </div>
        </a>
    );
};

const TalentShowcase = () => {
    const sectionRef = useRef(null);
    const containerRef = useRef(null);
    const cardsRef = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {

            // Horizontal Scroll / Drag Logic
            const totalWidth = containerRef.current.scrollWidth;
            const viewportWidth = sectionRef.current.offsetWidth;

            if (totalWidth > viewportWidth) {
                Draggable.create(containerRef.current, {
                    type: "x",
                    bounds: {
                        minX: - (totalWidth - viewportWidth) - 100, // Extra buffer
                        maxX: 0
                    },
                    inertia: true,
                    edgeResistance: 0.65,
                    throwProps: true
                });
            }

            // Entrance Animation
            gsap.fromTo(cardsRef.current,
                { x: 100, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 70%",
                    }
                }
            );

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const { talentShowcase } = owmarkContent;

    return (
        <section className="talent-section" ref={sectionRef}>
            <div className="container">
                <h2 className="talent-headline">THE ROSTER.</h2>
            </div>

            <div className="talent-carousel-wrapper">
                <div className="talent-carousel" ref={containerRef}>
                    {talentShowcase.map((talent, index) => (
                        <div
                            key={talent.id}
                            className="talent-card"
                            ref={el => cardsRef.current[index] = el}
                        >
                            <div
                                className="talent-img"
                                style={{
                                    backgroundImage: `url(${talent.image})`,
                                    contentVisibility: 'auto'
                                }}
                                role="img"
                                aria-label={talent.name}
                            ></div>
                            <div className="talent-info">
                                <span className="talent-niche">{talent.niche}</span>
                                <h3 className="talent-name">{talent.name}</h3>

                                <div className="talent-socials">
                                    {talent.socialChannels && talent.socialChannels.map((social, i) => (
                                        <SocialLink key={i} social={social} index={i} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                    {/* Duplicate for visual length if needed, or just let it end */}
                </div>
            </div>
        </section>
    );
};

export default TalentShowcase;
