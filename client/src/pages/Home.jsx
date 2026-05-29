import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div>
      <section className="hero">
        <div className="hero-content">
          <h1>Immortalize Your Moments at dreamshade.studio</h1>
          <p>Bespoke pencil sketches, vibrant color portraits, and unique doodle art tailored just for you.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
            <Link to="/commission" className="btn-primary">
              Commission a Piece <ArrowRight size={18} />
            </Link>
            <Link to="/collection" className="btn-outline">View Collection</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
