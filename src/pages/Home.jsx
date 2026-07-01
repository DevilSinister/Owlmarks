import React from 'react';
import Hero from '../components/Hero';
import Umbrella from '../components/Umbrella';
import Authority from '../components/Authority';
import TalentShowcase from '../components/TalentShowcase';
import CaseStudies from '../components/CaseStudies';
import Process from '../components/Process';
import Founders from '../components/Founders';
import FinalCTA from '../components/FinalCTA';

const Home = () => {
    return (
        <main>
            <Hero />
            <Umbrella />
            <Authority />
            <TalentShowcase />
            <CaseStudies />
            <Process />
            <Founders />
            <FinalCTA />
        </main>
    );
};

export default Home;
