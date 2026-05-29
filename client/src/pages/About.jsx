import React, { useEffect, useState } from 'react';
import { getAboutDetails } from '../api';

const About = () => {
  const [aboutData, setAboutData] = useState({
    title: 'About dreamshade.studio',
    bio1: "Welcome to dreamshade.studio. I am an independent artist specializing in pencil sketches, vibrant color portraits, and unique doodle art. With a passion for capturing emotions and telling stories through art, I've spent years honing my craft.",
    bio2: "Whether you're looking for a personalized custom drawing to immortalize a memory or searching for a unique piece from my collection, my goal is to bring your vision to life with meticulous attention to detail.",
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const data = await getAboutDetails();
        if (data) {
          // If the backend has uploads path, prefix it with backend API URL if needed
          const imagePath = data.image.startsWith('/uploads') 
            ? `http://localhost:5000${data.image}` 
            : data.image;

          setAboutData({
            title: data.title || aboutData.title,
            bio1: data.bio1 || aboutData.bio1,
            bio2: data.bio2 || aboutData.bio2,
            image: imagePath || aboutData.image
          });
        }
      } catch (error) {
        console.error("Failed to load dynamic about data, using default copy.", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAboutData();
  }, []);

  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem', minHeight: '65vh' }}>
      <div className="grid grid-cols-2" style={{ alignItems: 'center', gap: '4rem' }}>
        <div>
          <img 
            src={aboutData.image} 
            alt="Artist at work" 
            style={{ width: '100%', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', objectFit: 'cover', height: '450px' }} 
          />
        </div>
        <div>
          <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', color: 'var(--accent)' }}>
            {aboutData.title}
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.7' }}>
            {aboutData.bio1}
          </p>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
            {aboutData.bio2}
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
