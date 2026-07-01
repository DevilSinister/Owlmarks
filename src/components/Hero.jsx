import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { owmarkContent } from '../data/owmarkContent';
import { usePageTransition } from '../hooks/usePageTransition';
import AuroraBackground from './ui/AuroraBackground';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
    const heroRef = useRef(null);
    const pinRef = useRef(null);
    const videoRef = useRef(null);
    const contentRef = useRef(null);
    const linesRef = useRef([]);
    const shapesRef = useRef([]); // Ref for shape placeholders
    const headlineRef = useRef(null);
    const ctaRef = useRef(null);
    const navigateTo = usePageTransition();

    const handleCTA1Click = () => {
        // CTA1 is "Our Work" -> Go to Case Studies
        navigateTo('/case-studies');
    };

    const handleCTA2Click = () => {
        // CTA2 is "Contact Us" -> Go to Apply/Contact Page
        navigateTo('/apply');
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: "top top",
                    end: "+=400%", // Increased scroll distance for smoother pacing
                    pin: pinRef.current,
                    scrub: 1.5, // Increased scrub for smoother feel
                    anticipatePin: 1
                }
            });

            // Background Parallax (Subtle)
            gsap.to(videoRef.current, {
                yPercent: 15,
                ease: "none",
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                }
            });

            // --- SEQUENCE START ---

            // Initial State: First line visible, first shape visible (if we want setup)
            // Actually, let's start clean.

            owmarkContent.hero.heroLines.forEach((_, index) => {
                const currentLine = linesRef.current[index];
                const currentShape = shapesRef.current[index];
                const isLast = index === owmarkContent.hero.heroLines.length - 1;

                // Animate In (Line + Shape)
                // Skip first fade-in if it's already visible static (optional, but let's animate all for consistency or keep 0 static)
                if (index !== 0) {
                    tl.fromTo([currentLine, currentShape],
                        { opacity: 0, y: 100 },
                        { opacity: 1, y: 0, duration: 2, ease: "power2.out" }, // Slower duration
                        ">-=1" // Overlap slightly with outgoing
                    );
                }

                // Hold for a moment (spacer in timeline)
                tl.to({}, { duration: 1 });

                // Animate Out (Line + Shape)
                // If it's the last line, we fade it out to reveal headline
                tl.to([currentLine, currentShape], {
                    opacity: 0,
                    y: -50,
                    duration: 2,
                    ease: "power2.in"
                });
            });

            // --- HEADLINE REVEAL ---

            // Reveal Main Headline
            tl.fromTo(headlineRef.current,
                { opacity: 0, scale: 1.1, filter: "blur(10px)" },
                { opacity: 1, scale: 1, filter: "blur(0px)", duration: 2.5, ease: "power2.out" },
                "<" // Start effectively as last line fading out
            );

            // Reveal CTAs
            tl.fromTo(ctaRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" },
                "-=1"
            );

            // Underline animation
            tl.fromTo(".hero-underline",
                { width: "0%" },
                { width: "100%", duration: 1.5, ease: "power2.out" },
                "-=0.5"
            );

            // --- SEQUENCE END ---

        }, heroRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="hero-section" ref={heroRef}>
            <div className="hero-pinned" ref={pinRef}>

                {/* Background */}
                <div className="hero-bg">
                    <video
                        ref={videoRef}
                        className="hero-video"
                        autoPlay
                        muted
                        loop
                        playsInline
                        poster={owmarkContent.hero.heroFallbackImage}
                    >
                        <source src={owmarkContent.hero.heroBackgroundVideo} type="video/mp4" />
                    </video>
                    <div className="hero-overlay"></div>
                    <AuroraBackground />
                </div>

                {/* Dynamic Content Container */}
                <div className="hero-content container" ref={contentRef}>

                    {/* Scroll Sequence Items (Text + Shapes) */}
                    <div className="sequence-container">
                        {owmarkContent.hero.heroLines.map((line, index) => (
                            <div
                                key={index}
                                className="sequence-item"
                            >
                                {/* Text Line */}
                                <h2
                                    className="hero-line"
                                    ref={el => linesRef.current[index] = el}
                                    style={{ opacity: index === 0 ? 1 : 0 }}
                                >
                                    {line}
                                </h2>
                            </div>
                        ))}
                    </div>

                    {/* Final Main Headline Reveal */}
                    <div className="hero-final-reveal" ref={headlineRef}>
                        <h1 className="hero-main-headline">
                            {owmarkContent.hero.heroMainHeadline.split(' ').map((word, i, arr) => (
                                <span key={i} className="headline-word">
                                    {word}
                                    {i === arr.length - 1 && <span className="hero-underline"></span>}
                                </span>
                            ))}
                        </h1>

                        <div className="hero-ctas" ref={ctaRef}>
                            <button className="btn-primary" onClick={handleCTA1Click}>{owmarkContent.hero.heroCTA1}</button>
                            <button className="btn-secondary" onClick={handleCTA2Click}>{owmarkContent.hero.heroCTA2}</button>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Hero;
