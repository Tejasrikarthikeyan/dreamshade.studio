import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, ArrowRight, X, Search } from 'lucide-react';
import { getArtworks } from '../api';

const CATEGORIES = ['All', 'Pencil Sketch', 'Color Portrait', 'Doodle Art'];

const FALLBACK_ARTWORKS = [
  {
    id: 'f1',
    name: 'Ethereal Whispers',
    category: 'Pencil Sketch',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800',
    description: 'A delicate pencil portrait exploring the soft interplay of light and deep shadows on the human form.',
    year: '2025'
  },
  {
    id: 'f2',
    name: 'Midnight Muse',
    category: 'Pencil Sketch',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800',
    description: 'High-contrast charcoal portrait capturing intense emotion and raw texture.',
    year: '2025'
  },
  {
    id: 'f3',
    name: 'Technicolor Dreams',
    category: 'Color Portrait',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800',
    description: 'A vibrant colored portrait bursting with energy and psychedelic undertones, hand-painted with professional pigments.',
    year: '2026'
  },
  {
    id: 'f4',
    name: 'Urban Jungle',
    category: 'Doodle Art',
    image: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=800',
    description: 'A meticulous and highly complex black-and-white ink doodle depicting a surreal city architecture overgrown with nature.',
    year: '2025'
  },
  {
    id: 'f5',
    name: 'Serenade of Shadows',
    category: 'Pencil Sketch',
    image: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800',
    description: 'Masterful graphite shading illustrating hands playing an antique piano, full of soul and nostalgia.',
    year: '2026'
  },
  {
    id: 'f6',
    name: 'Cosmic Voyage',
    category: 'Doodle Art',
    image: 'https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=800',
    description: 'A whimsical and detailed ink piece packed with celestial bodies, portals, and intricate line work.',
    year: '2026'
  }
];

const Collection = () => {
  const [artworks, setArtworks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArtwork, setActiveArtwork] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const data = await getArtworks();
        if (data && data.length > 0) {
          const mapped = data.map(item => ({
            id: item._id,
            name: item.name,
            category: item.category || 'Pencil Sketch',
            image: item.image.startsWith('/uploads') ? `http://localhost:5000${item.image}` : item.image,
            description: item.description || '',
            year: item.year || '2026'
          }));
          setArtworks(mapped);
        } else {
          setArtworks(FALLBACK_ARTWORKS);
        }
      } catch (error) {
        console.error("Failed to load artworks from database, showing catalog presets.", error);
        setArtworks(FALLBACK_ARTWORKS);
      } finally {
        setLoading(false);
      }
    };
    fetchArtworks();
  }, []);

  const filteredArtworks = artworks.filter(art => {
    const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;
    const matchesSearch = art.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          art.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '6rem', minHeight: '70vh' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', background: 'linear-gradient(135deg, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          The Collection
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Explore a curated gallery of masterfully crafted pencil sketches, vibrant color portraits, and highly detailed doodle art.
        </p>
      </div>

      {/* Filters & Search */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: '1.5rem', 
        marginBottom: '3rem',
        padding: '1.5rem',
        background: 'rgba(15, 23, 42, 0.4)',
        borderRadius: '16px',
        border: '1px solid var(--border)',
        backdropFilter: 'blur(10px)'
      }}>
        {/* Category Tabs */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? 'btn-primary' : 'btn-outline'}
              style={{ 
                padding: '0.5rem 1.25rem', 
                fontSize: '0.9rem',
                borderRadius: '30px'
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', minWidth: '280px', flexGrow: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="Search the collection..."
            className="form-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              paddingLeft: '2.75rem', 
              borderRadius: '30px', 
              background: 'rgba(2, 6, 23, 0.4)',
              fontSize: '0.95rem'
            }}
          />
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
          <p style={{ fontSize: '1.2rem' }}>Loading the gallery...</p>
        </div>
      ) : filteredArtworks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
          <p style={{ fontSize: '1.2rem' }}>No artworks found matching your search or category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3" style={{ gap: '2rem' }}>
          {filteredArtworks.map(art => (
            <div 
              key={art.id} 
              className="card" 
              onClick={() => setActiveArtwork(art)}
              style={{ 
                padding: '0', 
                overflow: 'hidden', 
                display: 'flex', 
                flexDirection: 'column', 
                borderRadius: '16px',
                height: '420px',
                cursor: 'none'
              }}
            >
              {/* Image Container with Hover Zoom */}
              <div style={{ 
                position: 'relative', 
                overflow: 'hidden', 
                height: '300px', 
                width: '100%' 
              }} className="gallery-container">
                <img 
                  src={art.image} 
                  alt={art.name} 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover', 
                    transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' 
                  }} 
                  className="gallery-img"
                />
                
                {/* Overlay on hover */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(to top, rgba(2, 6, 23, 0.9) 0%, rgba(2, 6, 23, 0.2) 60%, rgba(2, 6, 23, 0) 100%)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '1.5rem',
                  zIndex: 2
                }} className="gallery-overlay">
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <span style={{ 
                      fontSize: '0.85rem', 
                      backgroundColor: 'var(--accent)', 
                      color: '#fff', 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '20px',
                      fontWeight: 'bold'
                    }}>
                      {art.category}
                    </span>
                    <div style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                      borderRadius: '50%', 
                      width: '40px', 
                      height: '40px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      backdropFilter: 'blur(4px)'
                    }}>
                      <Eye size={20} color="#fff" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Artwork Meta */}
              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>{art.name}</h3>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{art.year}</span>
                  </div>
                  <p style={{ 
                    color: 'var(--text-secondary)', 
                    fontSize: '0.9rem', 
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: '1.4'
                  }}>
                    {art.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox / Art Modal */}
      {activeArtwork && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(2, 6, 23, 0.95)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 99999,
          padding: '2rem'
        }} onClick={() => setActiveArtwork(null)}>
          <button 
            onClick={() => setActiveArtwork(null)} 
            style={{
              position: 'absolute',
              top: '2rem',
              right: '2rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: 'none',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'none',
              transition: 'all 0.3s ease',
              color: 'var(--text-primary)'
            }}
            className="btn-outline"
          >
            <X size={24} />
          </button>

          <div style={{
            maxWidth: '1100px',
            width: '100%',
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid var(--border)',
            borderRadius: '24px',
            overflow: 'hidden',
            display: 'flex',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
            maxHeight: '90vh'
          }} onClick={e => e.stopPropagation()}>
            {/* Image Side */}
            <div style={{ width: '60%', backgroundColor: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center', maxHeight: '90vh' }}>
              <img 
                src={activeArtwork.image} 
                alt={activeArtwork.name} 
                style={{ width: '100%', height: '100%', objectFit: 'contain', maxHeight: '80vh' }}
              />
            </div>

            {/* Info Side */}
            <div style={{ width: '40%', padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: '1px solid var(--border)' }}>
              <div>
                <span style={{ 
                  fontSize: '0.85rem', 
                  backgroundColor: 'var(--accent-glow)', 
                  color: 'var(--accent)', 
                  padding: '0.35rem 1rem', 
                  borderRadius: '20px',
                  fontWeight: '600',
                  display: 'inline-block',
                  marginBottom: '1.5rem',
                  border: '1px solid var(--accent)'
                }}>
                  {activeArtwork.category}
                </span>
                
                <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', lineHeight: '1.2' }}>{activeArtwork.name}</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '2rem' }}>Created in {activeArtwork.year}</p>
                
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem', fontSize: '1.1rem' }}>Description</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '2.5rem' }}>
                  {activeArtwork.description}
                </p>
              </div>

              <div>
                <div style={{ padding: '1.5rem', background: 'rgba(2, 6, 23, 0.3)', border: '1px solid var(--border)', borderRadius: '16px', marginBottom: '2rem' }}>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    Inspired by this piece?
                  </p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    You can request a custom drawing tailored to your specific story, portrait, or doodle preference.
                  </p>
                </div>

                <Link 
                  to="/commission" 
                  onClick={() => setActiveArtwork(null)}
                  className="btn-primary" 
                  style={{ width: '100%', padding: '1rem' }}
                >
                  Commission Similar Work <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Collection;
