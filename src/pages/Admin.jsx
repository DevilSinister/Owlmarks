import React, { useState, useEffect } from 'react';
import fallbackContent from '../data/owmarkContent.json';
import './Admin.css';

const Admin = () => {
    const [content, setContent] = useState(null);
    const [activeTab, setActiveTab] = useState('hero');
    const [toast, setToast] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Unified lists for editing
    const [talentList, setTalentList] = useState([]);
    const [caseStudiesList, setCaseStudiesList] = useState([]);
    const [foundersList, setFoundersList] = useState([]);

    // Modals
    const [editingTalent, setEditingTalent] = useState(null);
    const [editingCaseStudy, setEditingCaseStudy] = useState(null);
    const [editingFounder, setEditingFounder] = useState(null);

    // Core Services Dropdown
    const [selectedCoreService, setSelectedCoreService] = useState('talentV2');

    // Production Guard
    const isLocal = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' || 
                    window.location.hostname.startsWith('192.168.') || 
                    window.location.hostname.startsWith('10.') || 
                    window.location.hostname.startsWith('172.');

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await fetch('/api/content');
                if (res.ok) {
                    const data = await res.json();
                    setContent(data);
                    parseUnifiedLists(data);
                } else {
                    throw new Error('API response not ok');
                }
            } catch (err) {
                console.warn('Backend server not available, loading from local import.');
                setContent(JSON.parse(JSON.stringify(fallbackContent)));
                parseUnifiedLists(fallbackContent);
            }
        };
        loadData();
    }, []);

    const parseUnifiedLists = (data) => {
        // Build unified Talent list
        const talentMap = {};
        const homeTalentIds = new Set((data.talentShowcase || []).map(t => t.id));
        const rosterTalentIds = new Set((data.dedicatedPageContent?.fullTalentRoster || []).map(t => t.id));

        const allTalents = [...(data.talentShowcase || []), ...(data.dedicatedPageContent?.fullTalentRoster || [])];
        allTalents.forEach(t => {
            talentMap[t.id] = {
                ...t,
                showOnHome: homeTalentIds.has(t.id),
                showOnRoster: rosterTalentIds.has(t.id),
                socialChannels: t.socialChannels || []
            };
        });
        setTalentList(Object.values(talentMap));

        // Build unified Case Studies list
        const csMap = {};
        const homeCsIds = new Set((data.caseStudiesSection?.caseStudies || []).map(c => c.id));
        const archiveCsIds = new Set((data.dedicatedPageContent?.fullCaseStudies || []).map(c => c.id));

        const allCs = [...(data.caseStudiesSection?.caseStudies || []), ...(data.dedicatedPageContent?.fullCaseStudies || [])];
        allCs.forEach(c => {
            csMap[c.id] = {
                ...c,
                showOnHome: homeCsIds.has(c.id),
                showOnArchive: archiveCsIds.has(c.id),
                statList: c.statList || [],
                servicesProvided: c.servicesProvided || [],
                metrics: c.metrics || { impressions: '', reach: '', engagementRate: '', conversions: '', ctr: '', roas: '' }
            };
        });
        setCaseStudiesList(Object.values(csMap));

        // Build Founders list
        setFoundersList([...(data.foundersSection?.founders || [])]);
    };

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(''), 3000);
    };

    // Generic text field update
    const handleFieldChange = (section, field, value) => {
        setContent(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleNestedFieldChange = (section, subSection, field, value) => {
        if (!subSection) {
            setContent(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value
                }
            }));
            return;
        }
        setContent(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [subSection]: {
                    ...prev[section][subSection],
                    [field]: value
                }
            }
        }));
    };

    // Handle single file upload
    const handleImageUpload = async (file, onComplete) => {
        const formData = new FormData();
        formData.append('file', file);
        try {
            showToast('Uploading image...');
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            if (res.ok) {
                const result = await res.json();
                onComplete(result.url);
                showToast('Image uploaded successfully!');
            } else {
                throw new Error('Upload failed');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to upload image. Make sure local backend server is running.');
        }
    };

    // Save Unified Lists back to content object and POST to backend
    const handleSaveAll = async () => {
        if (!isLocal) {
            alert('Edits can only be saved in local development environment!');
            return;
        }

        setIsSaving(true);
        // Rebuild Roster arrays
        const newTalentShowcase = talentList.filter(t => t.showOnHome).map(({ showOnHome, showOnRoster, ...t }) => t);
        const newFullTalentRoster = talentList.filter(t => t.showOnRoster).map(({ showOnHome, showOnRoster, ...t }) => t);

        // Rebuild Case Studies arrays
        const newCaseStudiesHome = caseStudiesList.filter(c => c.showOnHome).map(({ showOnHome, showOnArchive, ...c }) => c);
        const newFullCaseStudies = caseStudiesList.filter(c => c.showOnArchive).map(({ showOnHome, showOnArchive, ...c }) => c);

        const updatedContent = {
            ...content,
            talentShowcase: newTalentShowcase,
            caseStudiesSection: {
                ...content.caseStudiesSection,
                caseStudies: newCaseStudiesHome
            },
            dedicatedPageContent: {
                ...content.dedicatedPageContent,
                fullTalentRoster: newFullTalentRoster,
                fullCaseStudies: newFullCaseStudies
            },
            foundersSection: {
                ...content.foundersSection,
                founders: foundersList
            }
        };

        try {
            const res = await fetch('/api/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedContent)
            });
            if (res.ok) {
                setContent(updatedContent);
                showToast('All changes saved to JSON!');
            } else {
                throw new Error('Save failed');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to save content. Ensure server.js is running.');
        } finally {
            setIsSaving(false);
        }
    };

    if (!content) {
        return (
            <div className="admin-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
                <h2>Loading Owlmark Configurator...</h2>
            </div>
        );
    }

    if (!isLocal) {
        return (
            <div className="admin-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
                <div className="guard-banner">
                    <div className="guard-icon">⚠</div>
                    <h2 className="guard-title">Production Locked</h2>
                    <p className="guard-desc">
                        This site is running in production (live Netlify environment). 
                        To edit text, add influencers/projects, or upload files:
                    </p>
                    <div style={{ textAlign: 'left', marginTop: '1.5rem', paddingLeft: '1rem', color: '#ccc' }}>
                        <p>1. Run your project locally using <code>npm run dev</code>.</p>
                        <p>2. Open <code>localhost:5173/admin</code> in your local browser.</p>
                        <p>3. Edit everything easily, save, commit, and push your changes to GitHub.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-container">
            {toast && <div className="floating-toast">{toast}</div>}

            {/* HEADER */}
            <header className="admin-header">
                <div className="admin-title-flex">
                    <h1 className="admin-logo">OWL<span>MARK</span></h1>
                    <span className="admin-badge">Admin Panel</span>
                </div>
                <div className="admin-header-actions">
                    <a href="/" target="_blank" rel="noopener noreferrer" className="btn-view-site">
                        View Site ↗
                    </a>
                    <button 
                        className="btn-save-all" 
                        onClick={handleSaveAll}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </header>

            <div className="admin-layout">
                {/* SIDEBAR TABS */}
                <aside className="admin-sidebar">
                    <button className={`sidebar-tab ${activeTab === 'hero' ? 'active' : ''}`} onClick={() => setActiveTab('hero')}>Hero Section</button>
                    <button className={`sidebar-tab ${activeTab === 'metrics' ? 'active' : ''}`} onClick={() => setActiveTab('metrics')}>Metrics & Authority</button>
                    <button className={`sidebar-tab ${activeTab === 'services' ? 'active' : ''}`} onClick={() => setActiveTab('services')}>Service Pages Config</button>
                    <button className={`sidebar-tab ${activeTab === 'roster' ? 'active' : ''}`} onClick={() => setActiveTab('roster')}>Roster / Creators</button>
                    <button className={`sidebar-tab ${activeTab === 'case-studies' ? 'active' : ''}`} onClick={() => setActiveTab('case-studies')}>Case Studies / Projects</button>
                    <button className={`sidebar-tab ${activeTab === 'founders' ? 'active' : ''}`} onClick={() => setActiveTab('founders')}>Founders & Agency</button>
                    
                    <div style={{ flex: 1 }}></div>
                    <button className="btn-save" onClick={handleSaveAll} disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'SAVE ALL CHANGES'}
                    </button>
                </aside>

                {/* MAIN CONTENT AREA */}
                <main className="admin-main">

                    {/* HERO TAB */}
                    {activeTab === 'hero' && (
                        <div className="admin-section-card">
                            <h2 className="admin-section-title">Hero Configuration</h2>
                            <div className="form-group">
                                <label>Main Logo Headline</label>
                                <input 
                                    type="text" 
                                    value={content.hero.heroMainHeadline} 
                                    onChange={e => handleFieldChange('hero', 'heroMainHeadline', e.target.value)}
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>CTA Button 1 Text</label>
                                    <input 
                                        type="text" 
                                        value={content.hero.heroCTA1} 
                                        onChange={e => handleFieldChange('hero', 'heroCTA1', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>CTA Button 2 Text</label>
                                    <input 
                                        type="text" 
                                        value={content.hero.heroCTA2} 
                                        onChange={e => handleFieldChange('hero', 'heroCTA2', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Hero Background Video Path</label>
                                <input 
                                    type="text" 
                                    value={content.hero.heroBackgroundVideo} 
                                    onChange={e => handleFieldChange('hero', 'heroBackgroundVideo', e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Hero Fallback Image</label>
                                <div className="image-upload-wrapper">
                                    <div className="preview-thumb" style={{ backgroundImage: `url(${content.hero.heroFallbackImage})` }}></div>
                                    <div className="upload-controls">
                                        <input 
                                            type="text" 
                                            value={content.hero.heroFallbackImage} 
                                            onChange={e => handleFieldChange('hero', 'heroFallbackImage', e.target.value)}
                                            placeholder="/assets/fallback.jpg"
                                        />
                                        <label className="file-input-label">
                                            Upload File
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                style={{ display: 'none' }}
                                                onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], url => handleFieldChange('hero', 'heroFallbackImage', url))}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <h3 style={{ margin: '2rem 0 1rem', fontSize: '1.2rem', textTransform: 'uppercase' }}>Hero Banners Lines</h3>
                            {content.hero.heroLines.map((line, idx) => (
                                <div className="form-group" key={idx}>
                                    <label>Line {idx + 1}</label>
                                    <input 
                                        type="text" 
                                        value={line} 
                                        onChange={e => {
                                            const newLines = [...content.hero.heroLines];
                                            newLines[idx] = e.target.value;
                                            handleFieldChange('hero', 'heroLines', newLines);
                                        }}
                                    />
                                </div>
                            ))}

                            <h3 style={{ margin: '2rem 0 1rem', fontSize: '1.2rem', textTransform: 'uppercase' }}>Final CTA Section</h3>
                            <div className="form-group">
                                <label>Final Headline</label>
                                <input 
                                    type="text" 
                                    value={content.finalCTA.finalHeadline} 
                                    onChange={e => handleFieldChange('finalCTA', 'finalHeadline', e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Final Button Text</label>
                                <input 
                                    type="text" 
                                    value={content.finalCTA.finalButtonText} 
                                    onChange={e => handleFieldChange('finalCTA', 'finalButtonText', e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {/* METRICS & AUTHORITY TAB */}
                    {activeTab === 'metrics' && (
                        <div className="admin-section-card">
                            <h2 className="admin-section-title">Metrics & Authority Configuration</h2>
                            <h3 style={{ margin: '0 0 1.5rem', fontSize: '1.2rem', textTransform: 'uppercase' }}>Top Counters</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Metric 1 Count</label>
                                    <input 
                                        type="text" 
                                        value={content.metrics.metric1Number} 
                                        onChange={e => handleFieldChange('metrics', 'metric1Number', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Metric 1 Title</label>
                                    <input 
                                        type="text" 
                                        value={content.metrics.metric1Label} 
                                        onChange={e => handleFieldChange('metrics', 'metric1Label', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Metric 2 Count</label>
                                    <input 
                                        type="text" 
                                        value={content.metrics.metric2Number} 
                                        onChange={e => handleFieldChange('metrics', 'metric2Number', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Metric 2 Title</label>
                                    <input 
                                        type="text" 
                                        value={content.metrics.metric2Label} 
                                        onChange={e => handleFieldChange('metrics', 'metric2Label', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Metric 3 Count</label>
                                    <input 
                                        type="text" 
                                        value={content.metrics.metric3Number} 
                                        onChange={e => handleFieldChange('metrics', 'metric3Number', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Metric 3 Title</label>
                                    <input 
                                        type="text" 
                                        value={content.metrics.metric3Label} 
                                        onChange={e => handleFieldChange('metrics', 'metric3Label', e.target.value)}
                                    />
                                </div>
                            </div>

                            <h3 style={{ margin: '2rem 0 1.5rem', fontSize: '1.2rem', textTransform: 'uppercase' }}>Data Dominance (Authority Grid)</h3>
                            {content.authoritySection.metricsArray.map((metric, idx) => (
                                <div className="form-row" key={idx}>
                                    <div className="form-group">
                                        <label>Grid {idx + 1} Number</label>
                                        <input 
                                            type="text" 
                                            value={metric.number} 
                                            onChange={e => {
                                                const newArr = [...content.authoritySection.metricsArray];
                                                newArr[idx].number = e.target.value;
                                                handleFieldChange('authoritySection', 'metricsArray', newArr);
                                            }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Grid {idx + 1} Title</label>
                                        <input 
                                            type="text" 
                                            value={metric.label} 
                                            onChange={e => {
                                                const newArr = [...content.authoritySection.metricsArray];
                                                newArr[idx].label = e.target.value;
                                                handleFieldChange('authoritySection', 'metricsArray', newArr);
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* CORE SERVICES TAB */}
                    {activeTab === 'services' && (
                        <div className="admin-section-card">
                            <div className="manager-header">
                                <h2 className="admin-section-title" style={{ marginBottom: 0, borderBottom: 'none' }}>Dedicated Service Pages</h2>
                                <select 
                                    value={selectedCoreService}
                                    onChange={(e) => setSelectedCoreService(e.target.value)}
                                    style={{
                                        padding: '0.6rem 1rem',
                                        backgroundColor: '#222',
                                        color: '#fff',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        borderRadius: '6px',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    <option value="talentV2">Talent Management</option>
                                    <option value="brandsV2">Brand Strategy</option>
                                    <option value="hospitalityV2">Hospitality Marketing</option>
                                </select>
                            </div>
                            
                            <div style={{ marginBottom: '3rem' }}>
                                <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                    Full control over the selected dedicated page. Please maintain valid JSON syntax.
                                </p>
                                <textarea 
                                    style={{ 
                                        width: '100%', 
                                        minHeight: '400px', 
                                        backgroundColor: '#111', 
                                        color: '#fff', 
                                        border: '1px solid #333', 
                                        padding: '1rem', 
                                        fontFamily: 'monospace',
                                        fontSize: '0.9rem',
                                        borderRadius: '4px'
                                    }}
                                    value={JSON.stringify(content[selectedCoreService], null, 2)}
                                    onChange={(e) => {
                                        try {
                                            const parsed = JSON.parse(e.target.value);
                                            setContent(prev => ({
                                                ...prev,
                                                [selectedCoreService]: parsed
                                            }));
                                        } catch (err) {
                                            // Ignore invalid JSON while typing
                                        }
                                    }}
                                />
                            </div>

                            <h2 className="admin-section-title" style={{ marginTop: '2rem' }}>Homepage Core Services (Three Forces)</h2>
                            <div className="form-group">
                                <label>Main Headline Line 1</label>
                                <input 
                                    type="text" 
                                    value={content.umbrellaSection.mainHeadlineLine1} 
                                    onChange={e => handleNestedFieldChange('umbrellaSection', null, 'mainHeadlineLine1', e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Main Headline Line 2</label>
                                <input 
                                    type="text" 
                                    value={content.umbrellaSection.mainHeadlineLine2} 
                                    onChange={e => handleNestedFieldChange('umbrellaSection', null, 'mainHeadlineLine2', e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Main Headline Line 3</label>
                                <input 
                                    type="text" 
                                    value={content.umbrellaSection.mainHeadlineLine3} 
                                    onChange={e => handleNestedFieldChange('umbrellaSection', null, 'mainHeadlineLine3', e.target.value)}
                                />
                            </div>

                            <h3 style={{ margin: '2rem 0 1rem', fontSize: '1.2rem', color: '#ff4a1c', textTransform: 'uppercase' }}>The 3 Pillars</h3>
                            {content.umbrellaSection.pillarsArray.map((pillar, idx) => (
                                <div key={pillar.id} style={{ borderBottom: '1px dashed rgba(255,255,255,0.08)', paddingBottom: '2rem', marginBottom: '2rem' }}>
                                    <h3 style={{ fontSize: '1.15rem', color: '#ff4a1c', textTransform: 'uppercase', marginBottom: '1rem' }}>Pillar {idx + 1}</h3>
                                    <div className="form-group">
                                        <label>Title</label>
                                        <input 
                                            type="text" 
                                            value={pillar.title} 
                                            onChange={e => {
                                                const newArr = [...content.umbrellaSection.pillarsArray];
                                                newArr[idx].title = e.target.value;
                                                handleNestedFieldChange('umbrellaSection', null, 'pillarsArray', newArr);
                                            }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Short Description</label>
                                        <input 
                                            type="text" 
                                            value={pillar.shortDescription} 
                                            onChange={e => {
                                                const newArr = [...content.umbrellaSection.pillarsArray];
                                                newArr[idx].shortDescription = e.target.value;
                                                handleNestedFieldChange('umbrellaSection', null, 'pillarsArray', newArr);
                                            }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Background Image</label>
                                        <div className="image-upload-wrapper">
                                            <div className="preview-thumb" style={{ backgroundImage: `url(${pillar.image})` }}></div>
                                            <div className="upload-controls">
                                                <input 
                                                    type="text" 
                                                    value={pillar.image} 
                                                    onChange={e => {
                                                        const newArr = [...content.umbrellaSection.pillarsArray];
                                                        newArr[idx].image = e.target.value;
                                                        handleNestedFieldChange('umbrellaSection', null, 'pillarsArray', newArr);
                                                    }}
                                                />
                                                <label className="file-input-label">
                                                    Upload File
                                                    <input 
                                                        type="file" 
                                                        accept="image/*" 
                                                        style={{ display: 'none' }}
                                                        onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], url => {
                                                            const newArr = [...content.umbrellaSection.pillarsArray];
                                                            newArr[idx].image = url;
                                                            handleNestedFieldChange('umbrellaSection', null, 'pillarsArray', newArr);
                                                        })}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ROSTER TAB */}
                    {activeTab === 'roster' && (
                        <div className="admin-section-card">
                            <div className="manager-header">
                                <h2 className="admin-section-title" style={{ marginBottom: 0, borderBottom: 'none' }}>Roster Management</h2>
                                <button 
                                    className="btn-add-item" 
                                    onClick={() => setEditingTalent({
                                        id: `tln-${Date.now()}`,
                                        name: '',
                                        niche: '',
                                        category: 'Trading',
                                        relationship: 'MANAGED',
                                        location: 'Pakistan',
                                        campaignDuration: '',
                                        metricHeadline: '500K+ FOLLOWERS',
                                        title: 'Educator',
                                        description: '',
                                        image: '',
                                        showOnHome: true,
                                        showOnRoster: true,
                                        socialChannels: []
                                    })}
                                >
                                    + Add New Creator
                                </button>
                            </div>

                            <div className="manager-grid">
                                {talentList.map(talent => (
                                    <div className="manager-card" key={talent.id}>
                                        <div>
                                            <div className="manager-card-header">
                                                <h3 className="manager-card-title">{talent.name || 'Unnamed Creator'}</h3>
                                                <span className="admin-badge" style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: '#aaa', border: 'none' }}>
                                                    {talent.niche || 'No Niche'}
                                                </span>
                                            </div>
                                            <div className="manager-card-sub">
                                                ID: {talent.id}<br/>
                                                Shows in: {[talent.showOnHome && 'Homepage', talent.showOnRoster && 'Roster Page'].filter(Boolean).join(', ') || 'Hidden'}
                                            </div>
                                        </div>
                                        <div className="manager-card-actions">
                                            <button className="btn-edit" onClick={() => setEditingTalent({ ...talent })}>Edit Creator</button>
                                            <button 
                                                className="btn-delete" 
                                                onClick={() => {
                                                    if(confirm(`Are you sure you want to delete ${talent.name || 'this creator'}?`)) {
                                                        setTalentList(talentList.filter(t => t.id !== talent.id));
                                                    }
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* CASE STUDIES TAB */}
                    {activeTab === 'case-studies' && (
                        <div className="admin-section-card">
                            <div className="manager-header">
                                <h2 className="admin-section-title" style={{ marginBottom: 0, borderBottom: 'none' }}>Case Studies Management</h2>
                                <button 
                                    className="btn-add-item" 
                                    onClick={() => setEditingCaseStudy({
                                        id: `cs-${Date.now()}`,
                                        category: 'E-Commerce',
                                        name: '',
                                        title: '',
                                        metricHeadline: 'HIGH CONVERSION',
                                        description: '',
                                        relationship: 'Video Advertising',
                                        location: 'Online',
                                        campaignDuration: 'Ongoing',
                                        website: '',
                                        outcome: '',
                                        image: '',
                                        showOnHome: true,
                                        showOnArchive: true,
                                        statList: [],
                                        servicesProvided: [],
                                        metrics: { impressions: '', reach: '', engagementRate: '', conversions: '', ctr: '', roas: '' }
                                    })}
                                >
                                    + Add New Case Study
                                </button>
                            </div>

                            <div className="manager-grid">
                                {caseStudiesList.map(cs => (
                                    <div className="manager-card" key={cs.id}>
                                        <div>
                                            <div className="manager-card-header">
                                                <h3 className="manager-card-title">{cs.name || 'Unnamed Project'}</h3>
                                                <span className="admin-badge" style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: '#aaa', border: 'none' }}>
                                                    {cs.category || 'No Category'}
                                                </span>
                                            </div>
                                            <div className="manager-card-sub">
                                                ID: {cs.id}<br/>
                                                Shows in: {[cs.showOnHome && 'Homepage', cs.showOnArchive && 'Archive Page'].filter(Boolean).join(', ') || 'Hidden'}
                                            </div>
                                        </div>
                                        <div className="manager-card-actions">
                                            <button className="btn-edit" onClick={() => setEditingCaseStudy({ ...cs })}>Edit Case Study</button>
                                            <button 
                                                className="btn-delete" 
                                                onClick={() => {
                                                    if(confirm(`Are you sure you want to delete ${cs.name || 'this project'}?`)) {
                                                        setCaseStudiesList(caseStudiesList.filter(c => c.id !== cs.id));
                                                    }
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* FOUNDERS & PROCESS TAB */}
                    {activeTab === 'founders' && (
                        <div className="admin-section-card">
                            <div className="manager-header">
                                <h2 className="admin-section-title" style={{ marginBottom: 0, borderBottom: 'none' }}>Founders Management</h2>
                                <button 
                                    className="btn-add-item" 
                                    onClick={() => setEditingFounder({
                                        id: `fnd-${Date.now()}`,
                                        slug: '',
                                        name: '',
                                        role: '',
                                        image: '',
                                        bio: '',
                                        fullBio: '',
                                        stats: { experience: '', campaigns: '', network: '' },
                                        socials: [],
                                        projects: []
                                    })}
                                >
                                    + Add New Founder
                                </button>
                            </div>
                            
                            <div className="manager-grid" style={{ marginBottom: '3rem' }}>
                                {foundersList.map((founder) => (
                                    <div className="manager-card" key={founder.id}>
                                        <div>
                                            <div className="manager-card-header">
                                                <h3 className="manager-card-title">{founder.name || 'Unnamed'}</h3>
                                                <span className="admin-badge" style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: '#aaa', border: 'none' }}>
                                                    {founder.role}
                                                </span>
                                            </div>
                                            <div className="manager-card-sub">
                                                Projects Linked: {founder.projects?.length || 0}
                                            </div>
                                        </div>
                                        <div className="manager-card-actions">
                                            <button className="btn-edit" onClick={() => setEditingFounder({ ...founder })}>Edit Founder</button>
                                            <button 
                                                className="btn-delete" 
                                                onClick={() => {
                                                    if(confirm(`Are you sure you want to delete ${founder.name || 'this founder'}?`)) {
                                                        setFoundersList(foundersList.filter(f => f.id !== founder.id));
                                                    }
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <h3 style={{ margin: '2rem 0 1.5rem', fontSize: '1.2rem', color: '#ff4a1c', textTransform: 'uppercase' }}>The Blueprint Steps</h3>
                            {content.processSection.stepsArray.map((step, idx) => (
                                <div key={idx} style={{ marginBottom: '1.5rem' }}>
                                    <h4 style={{ fontSize: '1rem', textTransform: 'uppercase', color: '#888', marginBottom: '0.5rem' }}>Step {step.number}</h4>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Step Title</label>
                                            <input 
                                                type="text" 
                                                value={step.title} 
                                                onChange={e => {
                                                    const newArr = [...content.processSection.stepsArray];
                                                    newArr[idx].title = e.target.value;
                                                    handleFieldChange('processSection', 'stepsArray', newArr);
                                                }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Step Description</label>
                                            <input 
                                                type="text" 
                                                value={step.description} 
                                                onChange={e => {
                                                    const newArr = [...content.processSection.stepsArray];
                                                    newArr[idx].description = e.target.value;
                                                    handleFieldChange('processSection', 'stepsArray', newArr);
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* CREATOR EDIT MODAL */}
            {editingTalent && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <div className="admin-modal-header">
                            <h3 className="admin-modal-title">{editingTalent.name ? `Edit ${editingTalent.name}` : 'Add Creator'}</h3>
                            <button className="btn-modal-close" onClick={() => setEditingTalent(null)}>×</button>
                        </div>
                        
                        <div className="form-group">
                            <label>Creator Name</label>
                            <input 
                                type="text" 
                                value={editingTalent.name} 
                                onChange={e => setEditingTalent({ ...editingTalent, name: e.target.value })}
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Niche / Specialty (e.g. Trading)</label>
                                <input 
                                    type="text" 
                                    value={editingTalent.niche} 
                                    onChange={e => setEditingTalent({ ...editingTalent, niche: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Category (e.g. Finance)</label>
                                <input 
                                    type="text" 
                                    value={editingTalent.category || ''} 
                                    onChange={e => setEditingTalent({ ...editingTalent, category: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Relationship status (e.g. EXCLUSIVELY SIGNED)</label>
                                <input 
                                    type="text" 
                                    value={editingTalent.relationship || ''} 
                                    onChange={e => setEditingTalent({ ...editingTalent, relationship: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Location</label>
                                <input 
                                    type="text" 
                                    value={editingTalent.location || ''} 
                                    onChange={e => setEditingTalent({ ...editingTalent, location: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Key Metric (Headline, e.g. 1.2M Followers)</label>
                                <input 
                                    type="text" 
                                    value={editingTalent.metricHeadline || ''} 
                                    onChange={e => setEditingTalent({ ...editingTalent, metricHeadline: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Title (in Dedicated Modal)</label>
                                <input 
                                    type="text" 
                                    value={editingTalent.title || ''} 
                                    onChange={e => setEditingTalent({ ...editingTalent, title: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Campaign Duration / Partnership details</label>
                            <input 
                                type="text" 
                                value={editingTalent.campaignDuration || ''} 
                                onChange={e => setEditingTalent({ ...editingTalent, campaignDuration: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Description Bio</label>
                            <textarea 
                                value={editingTalent.description || ''} 
                                onChange={e => setEditingTalent({ ...editingTalent, description: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Creator Photo</label>
                            <div className="image-upload-wrapper">
                                <div className="preview-thumb" style={{ backgroundImage: `url(${editingTalent.image})` }}></div>
                                <div className="upload-controls">
                                    <input 
                                        type="text" 
                                        value={editingTalent.image} 
                                        onChange={e => setEditingTalent({ ...editingTalent, image: e.target.value })}
                                    />
                                    <label className="file-input-label">
                                        Upload File
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            style={{ display: 'none' }}
                                            onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], url => setEditingTalent({ ...editingTalent, image: url }))}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Visibility toggles */}
                        <div className="form-row" style={{ backgroundColor: '#121212', padding: '1rem', borderRadius: '4px', margin: '1.5rem 0' }}>
                            <div className="checkbox-group">
                                <input 
                                    type="checkbox" 
                                    id="showHome" 
                                    checked={editingTalent.showOnHome} 
                                    onChange={e => setEditingTalent({ ...editingTalent, showOnHome: e.target.checked })}
                                />
                                <label htmlFor="showHome">Show in Home Page Roster Carousel</label>
                            </div>
                            <div className="checkbox-group">
                                <input 
                                    type="checkbox" 
                                    id="showRoster" 
                                    checked={editingTalent.showOnRoster} 
                                    onChange={e => setEditingTalent({ ...editingTalent, showOnRoster: e.target.checked })}
                                />
                                <label htmlFor="showRoster">Show in Dedicated Roster Directory</label>
                            </div>
                        </div>

                        {/* Social channels sub-list */}
                        <h4 style={{ margin: '1.5rem 0 1rem', textTransform: 'uppercase', fontSize: '0.9rem', color: '#ff4a1c' }}>Social Channels</h4>
                        <div className="array-items-list">
                            {editingTalent.socialChannels.map((soc, idx) => (
                                <div className="array-item-row" key={idx}>
                                    <select 
                                        value={soc.platform} 
                                        onChange={e => {
                                            const newSocs = [...editingTalent.socialChannels];
                                            newSocs[idx].platform = e.target.value;
                                            setEditingTalent({ ...editingTalent, socialChannels: newSocs });
                                        }}
                                        style={{ width: '130px' }}
                                    >
                                        <option value="Instagram">Instagram</option>
                                        <option value="TikTok">TikTok</option>
                                        <option value="YouTube">YouTube</option>
                                        <option value="Twitter">Twitter/X</option>
                                        <option value="LinkedIn">LinkedIn</option>
                                    </select>
                                    <input 
                                        type="text" 
                                        placeholder="Handle (e.g. @stoictrader)" 
                                        value={soc.handle || ''} 
                                        onChange={e => {
                                            const newSocs = [...editingTalent.socialChannels];
                                            newSocs[idx].handle = e.target.value;
                                            setEditingTalent({ ...editingTalent, socialChannels: newSocs });
                                        }}
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="Followers (e.g. 100k+)" 
                                        value={soc.followers || ''} 
                                        onChange={e => {
                                            const newSocs = [...editingTalent.socialChannels];
                                            newSocs[idx].followers = e.target.value;
                                            setEditingTalent({ ...editingTalent, socialChannels: newSocs });
                                        }}
                                    />
                                    <input 
                                        type="url" 
                                        placeholder="Link URL" 
                                        value={soc.url || ''} 
                                        onChange={e => {
                                            const newSocs = [...editingTalent.socialChannels];
                                            newSocs[idx].url = e.target.value;
                                            setEditingTalent({ ...editingTalent, socialChannels: newSocs });
                                        }}
                                    />
                                    <button 
                                        className="btn-remove-item"
                                        onClick={() => {
                                            setEditingTalent({
                                                ...editingTalent,
                                                socialChannels: editingTalent.socialChannels.filter((_, i) => i !== idx)
                                            });
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button 
                            className="btn-add-item" 
                            onClick={() => setEditingTalent({
                                ...editingTalent,
                                socialChannels: [...editingTalent.socialChannels, { platform: 'Instagram', handle: '', followers: '', url: '' }]
                            })}
                        >
                            + Add Social Link
                        </button>

                        <div className="admin-modal-actions">
                            <button className="btn-cancel" onClick={() => setEditingTalent(null)}>Cancel</button>
                            <button 
                                className="btn-submit" 
                                onClick={() => {
                                    // Save back to list
                                    const exists = talentList.some(t => t.id === editingTalent.id);
                                    if (exists) {
                                        setTalentList(talentList.map(t => t.id === editingTalent.id ? editingTalent : t));
                                    } else {
                                        setTalentList([...talentList, editingTalent]);
                                    }
                                    setEditingTalent(null);
                                    showToast('Creator details queued (Save Changes to apply)');
                                }}
                            >
                                Queue Creator
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* CASE STUDY EDIT MODAL */}
            {editingCaseStudy && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <div className="admin-modal-header">
                            <h3 className="admin-modal-title">{editingCaseStudy.name ? `Edit ${editingCaseStudy.name}` : 'Add Case Study'}</h3>
                            <button className="btn-modal-close" onClick={() => setEditingCaseStudy(null)}>×</button>
                        </div>

                        <div className="form-group">
                            <label>Brand / Client Name</label>
                            <input 
                                type="text" 
                                value={editingCaseStudy.name} 
                                onChange={e => setEditingCaseStudy({ ...editingCaseStudy, name: e.target.value })}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Category (e.g. E-Commerce, Fashion)</label>
                                <input 
                                    type="text" 
                                    value={editingCaseStudy.category || ''} 
                                    onChange={e => setEditingCaseStudy({ ...editingCaseStudy, category: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Project title (e.g. Custom Neon Signs)</label>
                                <input 
                                    type="text" 
                                    value={editingCaseStudy.title} 
                                    onChange={e => setEditingCaseStudy({ ...editingCaseStudy, title: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Core Outcome Metric (e.g. HIGH CONVERSION)</label>
                                <input 
                                    type="text" 
                                    value={editingCaseStudy.metricHeadline} 
                                    onChange={e => setEditingCaseStudy({ ...editingCaseStudy, metricHeadline: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Relationship type (e.g. Video Advertising)</label>
                                <input 
                                    type="text" 
                                    value={editingCaseStudy.relationship || ''} 
                                    onChange={e => setEditingCaseStudy({ ...editingCaseStudy, relationship: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Location</label>
                                <input 
                                    type="text" 
                                    value={editingCaseStudy.location || ''} 
                                    onChange={e => setEditingCaseStudy({ ...editingCaseStudy, location: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Duration (e.g. Ongoing)</label>
                                <input 
                                    type="text" 
                                    value={editingCaseStudy.campaignDuration || ''} 
                                    onChange={e => setEditingCaseStudy({ ...editingCaseStudy, campaignDuration: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Website Link</label>
                                <input 
                                    type="url" 
                                    value={editingCaseStudy.website || ''} 
                                    onChange={e => setEditingCaseStudy({ ...editingCaseStudy, website: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Outcome Statement</label>
                                <input 
                                    type="text" 
                                    value={editingCaseStudy.outcome || ''} 
                                    onChange={e => setEditingCaseStudy({ ...editingCaseStudy, outcome: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Project Description</label>
                            <textarea 
                                value={editingCaseStudy.description} 
                                onChange={e => setEditingCaseStudy({ ...editingCaseStudy, description: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Project Cover Image</label>
                            <div className="image-upload-wrapper">
                                <div className="preview-thumb" style={{ backgroundImage: `url(${editingCaseStudy.image})` }}></div>
                                <div className="upload-controls">
                                    <input 
                                        type="text" 
                                        value={editingCaseStudy.image} 
                                        onChange={e => setEditingCaseStudy({ ...editingCaseStudy, image: e.target.value })}
                                    />
                                    <label className="file-input-label">
                                        Upload File
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            style={{ display: 'none' }}
                                            onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], url => setEditingCaseStudy({ ...editingCaseStudy, image: url }))}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Visibility toggles */}
                        <div className="form-row" style={{ backgroundColor: '#121212', padding: '1rem', borderRadius: '4px', margin: '1.5rem 0' }}>
                            <div className="checkbox-group">
                                <input 
                                    type="checkbox" 
                                    id="showHomeCs" 
                                    checked={editingCaseStudy.showOnHome} 
                                    onChange={e => setEditingCaseStudy({ ...editingCaseStudy, showOnHome: e.target.checked })}
                                />
                                <label htmlFor="showHomeCs">Show in Home Page Results Stack</label>
                            </div>
                            <div className="checkbox-group">
                                <input 
                                    type="checkbox" 
                                    id="showArchiveCs" 
                                    checked={editingCaseStudy.showOnArchive} 
                                    onChange={e => setEditingCaseStudy({ ...editingCaseStudy, showOnArchive: e.target.checked })}
                                />
                                <label htmlFor="showArchiveCs">Show in Dedicated Case Archive</label>
                            </div>
                        </div>

                        {/* Detailed Metrics Subform */}
                        <h4 style={{ margin: '1.5rem 0 1rem', textTransform: 'uppercase', fontSize: '0.9rem', color: '#ff4a1c' }}>Campaign Metrics (Detailed Stats)</h4>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Impressions (e.g. 10M+)</label>
                                <input 
                                    type="text" 
                                    value={editingCaseStudy.metrics.impressions || ''} 
                                    onChange={e => setEditingCaseStudy({ 
                                        ...editingCaseStudy, 
                                        metrics: { ...editingCaseStudy.metrics, impressions: e.target.value } 
                                    })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Reach (e.g. Targeted)</label>
                                <input 
                                    type="text" 
                                    value={editingCaseStudy.metrics.reach || ''} 
                                    onChange={e => setEditingCaseStudy({ 
                                        ...editingCaseStudy, 
                                        metrics: { ...editingCaseStudy.metrics, reach: e.target.value } 
                                    })}
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Engagement Rate</label>
                                <input 
                                    type="text" 
                                    value={editingCaseStudy.metrics.engagementRate || ''} 
                                    onChange={e => setEditingCaseStudy({ 
                                        ...editingCaseStudy, 
                                        metrics: { ...editingCaseStudy.metrics, engagementRate: e.target.value } 
                                    })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Conversions (e.g. +30% Sales)</label>
                                <input 
                                    type="text" 
                                    value={editingCaseStudy.metrics.conversions || ''} 
                                    onChange={e => setEditingCaseStudy({ 
                                        ...editingCaseStudy, 
                                        metrics: { ...editingCaseStudy.metrics, conversions: e.target.value } 
                                    })}
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>CTR (Click-Through Rate)</label>
                                <input 
                                    type="text" 
                                    value={editingCaseStudy.metrics.ctr || ''} 
                                    onChange={e => setEditingCaseStudy({ 
                                        ...editingCaseStudy, 
                                        metrics: { ...editingCaseStudy.metrics, ctr: e.target.value } 
                                    })}
                                />
                            </div>
                            <div className="form-group">
                                <label>ROAS (Return on Ad Spend)</label>
                                <input 
                                    type="text" 
                                    value={editingCaseStudy.metrics.roas || ''} 
                                    onChange={e => setEditingCaseStudy({ 
                                        ...editingCaseStudy, 
                                        metrics: { ...editingCaseStudy.metrics, roas: e.target.value } 
                                    })}
                                />
                            </div>
                        </div>

                        {/* List lists (StatList / ServicesProvided) */}
                        <div className="form-row" style={{ marginTop: '1.5rem' }}>
                            <div>
                                <label>Tags (Highlights, e.g. High ROAS)</label>
                                <div className="array-items-list">
                                    {editingCaseStudy.statList.map((tag, idx) => (
                                        <div className="array-item-row" key={idx}>
                                            <input 
                                                type="text" 
                                                value={tag} 
                                                onChange={e => {
                                                    const newTags = [...editingCaseStudy.statList];
                                                    newTags[idx] = e.target.value;
                                                    setEditingCaseStudy({ ...editingCaseStudy, statList: newTags });
                                                }}
                                            />
                                            <button 
                                                className="btn-remove-item"
                                                onClick={() => setEditingCaseStudy({
                                                    ...editingCaseStudy,
                                                    statList: editingCaseStudy.statList.filter((_, i) => i !== idx)
                                                })}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button 
                                    className="btn-add-item" 
                                    onClick={() => setEditingCaseStudy({
                                        ...editingCaseStudy,
                                        statList: [...editingCaseStudy.statList, '']
                                    })}
                                >
                                    + Add Tag
                                </button>
                            </div>

                            <div>
                                <label>Services Provided (e.g. Video Ads)</label>
                                <div className="array-items-list">
                                    {editingCaseStudy.servicesProvided.map((srv, idx) => (
                                        <div className="array-item-row" key={idx}>
                                            <input 
                                                type="text" 
                                                value={srv} 
                                                onChange={e => {
                                                    const newSrvs = [...editingCaseStudy.servicesProvided];
                                                    newSrvs[idx] = e.target.value;
                                                    setEditingCaseStudy({ ...editingCaseStudy, servicesProvided: newSrvs });
                                                }}
                                            />
                                            <button 
                                                className="btn-remove-item"
                                                onClick={() => setEditingCaseStudy({
                                                    ...editingCaseStudy,
                                                    servicesProvided: editingCaseStudy.servicesProvided.filter((_, i) => i !== idx)
                                                })}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button 
                                    className="btn-add-item" 
                                    onClick={() => setEditingCaseStudy({
                                        ...editingCaseStudy,
                                        servicesProvided: [...editingCaseStudy.servicesProvided, '']
                                    })}
                                >
                                    + Add Service
                                </button>
                            </div>
                        </div>

                        <div className="admin-modal-actions">
                            <button className="btn-cancel" onClick={() => setEditingCaseStudy(null)}>Cancel</button>
                            <button 
                                className="btn-submit" 
                                onClick={() => {
                                    // Save back to list
                                    const exists = caseStudiesList.some(c => c.id === editingCaseStudy.id);
                                    if (exists) {
                                        setCaseStudiesList(caseStudiesList.map(c => c.id === editingCaseStudy.id ? editingCaseStudy : c));
                                    } else {
                                        setCaseStudiesList([...caseStudiesList, editingCaseStudy]);
                                    }
                                    setEditingCaseStudy(null);
                                    showToast('Case study queued (Save Changes to apply)');
                                }}
                            >
                                Queue Project
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* FOUNDER EDIT MODAL */}
            {editingFounder && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <div className="admin-modal-header">
                            <h3 className="admin-modal-title">{editingFounder.name ? `Edit ${editingFounder.name}` : 'Add Founder'}</h3>
                            <button className="btn-modal-close" onClick={() => setEditingFounder(null)}>×</button>
                        </div>
                        
                        <div className="form-group">
                            <label>Name</label>
                            <input 
                                type="text" 
                                value={editingFounder.name} 
                                onChange={e => setEditingFounder({ ...editingFounder, name: e.target.value })}
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Role</label>
                                <input 
                                    type="text" 
                                    value={editingFounder.role} 
                                    onChange={e => setEditingFounder({ ...editingFounder, role: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Slug (URL path)</label>
                                <input 
                                    type="text" 
                                    value={editingFounder.slug} 
                                    onChange={e => setEditingFounder({ ...editingFounder, slug: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Short Bio</label>
                            <textarea 
                                value={editingFounder.bio} 
                                onChange={e => setEditingFounder({ ...editingFounder, bio: e.target.value })}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Full Bio</label>
                            <textarea 
                                style={{ minHeight: '150px' }}
                                value={editingFounder.fullBio} 
                                onChange={e => setEditingFounder({ ...editingFounder, fullBio: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Photo</label>
                            <div className="image-upload-wrapper">
                                <div className="preview-thumb" style={{ backgroundImage: `url(${editingFounder.image})` }}></div>
                                <div className="upload-controls">
                                    <input 
                                        type="text" 
                                        value={editingFounder.image} 
                                        onChange={e => setEditingFounder({ ...editingFounder, image: e.target.value })}
                                    />
                                    <label className="file-input-label">
                                        Upload File
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            style={{ display: 'none' }}
                                            onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], url => setEditingFounder({ ...editingFounder, image: url }))}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <h4 style={{ margin: '1.5rem 0 1rem', textTransform: 'uppercase', fontSize: '0.9rem', color: '#ff4a1c' }}>Stats</h4>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Experience (e.g. 5+ Years)</label>
                                <input 
                                    type="text" 
                                    value={editingFounder.stats?.experience || ''} 
                                    onChange={e => setEditingFounder({ ...editingFounder, stats: { ...editingFounder.stats, experience: e.target.value } })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Campaigns (e.g. 100+)</label>
                                <input 
                                    type="text" 
                                    value={editingFounder.stats?.campaigns || ''} 
                                    onChange={e => setEditingFounder({ ...editingFounder, stats: { ...editingFounder.stats, campaigns: e.target.value } })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Network (e.g. 50M+ Reach)</label>
                                <input 
                                    type="text" 
                                    value={editingFounder.stats?.network || ''} 
                                    onChange={e => setEditingFounder({ ...editingFounder, stats: { ...editingFounder.stats, network: e.target.value } })}
                                />
                            </div>
                        </div>

                        <h4 style={{ margin: '1.5rem 0 1rem', textTransform: 'uppercase', fontSize: '0.9rem', color: '#ff4a1c' }}>Linked Projects</h4>
                        <div className="form-group" style={{ maxHeight: '200px', overflowY: 'auto', backgroundColor: '#111', padding: '1rem', borderRadius: '4px' }}>
                            {[...talentList, ...caseStudiesList].map(proj => {
                                const isChecked = editingFounder.projects?.includes(proj.id);
                                return (
                                    <div key={proj.id} className="checkbox-group" style={{ marginBottom: '0.5rem' }}>
                                        <input 
                                            type="checkbox" 
                                            id={`proj-${proj.id}`}
                                            checked={isChecked}
                                            onChange={e => {
                                                const newProjects = e.target.checked 
                                                    ? [...(editingFounder.projects || []), proj.id]
                                                    : (editingFounder.projects || []).filter(id => id !== proj.id);
                                                setEditingFounder({ ...editingFounder, projects: newProjects });
                                            }}
                                        />
                                        <label htmlFor={`proj-${proj.id}`}>{proj.name || proj.title} ({proj.id.startsWith('cs') ? 'Case Study' : 'Talent'})</label>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="admin-modal-actions">
                            <button className="btn-cancel" onClick={() => setEditingFounder(null)}>Cancel</button>
                            <button 
                                className="btn-submit" 
                                onClick={() => {
                                    const exists = foundersList.some(f => f.id === editingFounder.id);
                                    if (exists) {
                                        setFoundersList(foundersList.map(f => f.id === editingFounder.id ? editingFounder : f));
                                    } else {
                                        setFoundersList([...foundersList, editingFounder]);
                                    }
                                    setEditingFounder(null);
                                    showToast('Founder queued (Save Changes to apply)');
                                }}
                            >
                                Queue Founder
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
