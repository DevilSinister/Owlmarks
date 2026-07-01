import React from 'react';

const AuroraBackground = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
            <div className="aurora-blob blob-1"></div>
            <div className="aurora-blob blob-2"></div>
            <div className="aurora-blob blob-3"></div>
            <div className="aurora-overlay"></div>
        </div>
    );
};

export default AuroraBackground;
