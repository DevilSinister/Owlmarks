import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { owmarkContent } from '../data/owmarkContent';
import './IntroLoader.css';

const IntroLoader = ({ onComplete }) => {
    const containerRef = useRef(null);
    const textRef = useRef(null);
    const glowRef = useRef(null);
    const [currentLineIndex, setCurrentLineIndex] = useState(0);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                onComplete: () => {
                    gsap.to(containerRef.current, {
                        opacity: 0,
                        duration: 1,
                        ease: "power2.inOut",
                        onComplete: onComplete
                    });
                }
            });

            // Owl eye glow pulse
            gsap.to(glowRef.current, {
                opacity: 0.6,
                scale: 1.2,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });

            // Sequence through lines
            const lines = [...owmarkContent.introLoader.introLines, owmarkContent.introLoader.highlightWord];

            lines.forEach((line, index) => {
                const isLast = index === lines.length - 1;

                tl.to(textRef.current, {
                    textContent: line,
                    duration: 0, // Instant text switch
                    onStart: () => {
                        if (isLast) textRef.current.classList.add('highlight');
                    }
                })
                    .fromTo(textRef.current,
                        { opacity: 0, y: 30, filter: "blur(10px)" },
                        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "power3.out" }
                    )
                    .to(textRef.current, {
                        opacity: 0,
                        y: -30,
                        filter: "blur(10px)",
                        duration: 0.6,
                        ease: "power3.in",
                        delay: 1 // 1 second pause
                    });
            });

        }, containerRef);

        return () => ctx.revert();
    }, [onComplete]);

    return (
        <div className="intro-loader" ref={containerRef}>
            <div className="owl-eye-glow" ref={glowRef}></div>
            <div className="intro-text" ref={textRef}></div>
        </div>
    );
};

export default IntroLoader;
