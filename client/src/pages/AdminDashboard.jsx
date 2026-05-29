import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getOrders, 
  updateOrderStatus, 
  updateAdminCredentials, 
  deleteOrder,
  getArtworks,
  addArtwork,
  deleteArtwork,
  getAboutDetails,
  updateAboutDetails
} from '../api';
import { 
  ClipboardList, 
  Image as ImageIcon, 
  User as UserIcon, 
  Lock, 
  Plus, 
  Trash2, 
  Check, 
  AlertCircle,
  Upload
} from 'lucide-react';

const AdminDashboard = () => {
  // Navigation & Auth
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  // Navigation tab
  const [activeTab, setActiveTab] = useState('orders'); // orders, collection, about, security

  // Global loading
  const [loading, setLoading] = useState(true);

  // Orders Tab States
  const [orders, setOrders] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  // Collection Tab States
  const [artworks, setArtworks] = useState([]);
  const [artName, setArtName] = useState('');
  const [artCategory, setArtCategory] = useState('Pencil Sketch');
  const [artYear, setArtYear] = useState('2026');
  const [artDescription, setArtDescription] = useState('');
  const [artFile, setArtFile] = useState(null);
  const [artAddMessage, setArtAddMessage] = useState('');
  const [artAddError, setArtAddError] = useState('');
  const [deletingArtId, setDeletingArtId] = useState(null);
  const [isSubmittingArt, setIsSubmittingArt] = useState(false);

  // About Tab States
  const [aboutTitle, setAboutTitle] = useState('');
  const [aboutBio1, setAboutBio1] = useState('');
  const [aboutBio2, setAboutBio2] = useState('');
  const [aboutImage, setAboutImage] = useState('');
  const [aboutFile, setAboutFile] = useState(null);
  const [aboutUpdateMessage, setAboutUpdateMessage] = useState('');
  const [aboutUpdateError, setAboutUpdateError] = useState('');
  const [isSubmittingAbout, setIsSubmittingAbout] = useState(false);

  // Security Tab States
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [securityMessage, setSecurityMessage] = useState('');
  const [securityError, setSecurityError] = useState('');

  // Run on mount
  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    loadAllDashboardData();
  }, [token, navigate]);

  const loadAllDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch orders
      const orderData = await getOrders(token);
      setOrders(orderData);

      // Fetch artworks
      const artData = await getArtworks();
      setArtworks(artData);

      // Fetch about details
      const aboutData = await getAboutDetails();
      if (aboutData) {
        setAboutTitle(aboutData.title || '');
        setAboutBio1(aboutData.bio1 || '');
        setAboutBio2(aboutData.bio2 || '');
        setAboutImage(aboutData.image || '');
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      if (error === 'Invalid Token' || error === 'Access Denied') {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // --- ORDERS TAB METHODS ---
  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateOrderStatus(id, newStatus, token);
      setOrders(orders.map(o => o._id === id ? { ...o, status: newStatus } : o));
    } catch (error) {
      alert('Failed to update order status');
    }
  };

  const confirmDeleteOrder = async (id) => {
    try {
      await deleteOrder(id, token);
      setOrders(orders.filter(o => o._id !== id));
      setDeletingId(null);
    } catch (error) {
      alert('Failed to delete order');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  // --- COLLECTION TAB METHODS ---
  const handleAddArtwork = async (e) => {
    e.preventDefault();
    if (!artName || (!artFile && !artAddError)) {
      setArtAddError("Artwork title and image file are required.");
      return;
    }

    setIsSubmittingArt(true);
    setArtAddMessage('');
    setArtAddError('');

    try {
      const formData = new FormData();
      formData.append('name', artName);
      formData.append('category', artCategory);
      formData.append('year', artYear);
      formData.append('description', artDescription);
      if (artFile) {
        formData.append('imageFile', artFile);
      }

      const response = await addArtwork(formData, token);
      
      setArtAddMessage('Artwork uploaded successfully!');
      
      // Update local artworks state
      setArtworks([response, ...artworks]);

      // Reset form
      setArtName('');
      setArtDescription('');
      setArtFile(null);
      
      // Reset file input element manually
      const fileInput = document.getElementById('artFileInput');
      if (fileInput) fileInput.value = '';

      setTimeout(() => setArtAddMessage(''), 4000);
    } catch (error) {
      console.error(error);
      setArtAddError(error.error || "Failed to add artwork.");
    } finally {
      setIsSubmittingArt(false);
    }
  };

  const handleDeleteArtwork = async (id) => {
    try {
      await deleteArtwork(id, token);
      setArtworks(artworks.filter(a => a._id !== id));
      setDeletingArtId(null);
    } catch (error) {
      alert('Failed to delete artwork.');
    }
  };

  // --- ABOUT TAB METHODS ---
  const handleUpdateAboutDetails = async (e) => {
    e.preventDefault();
    setIsSubmittingAbout(true);
    setAboutUpdateMessage('');
    setAboutUpdateError('');

    try {
      const formData = new FormData();
      formData.append('title', aboutTitle);
      formData.append('bio1', aboutBio1);
      formData.append('bio2', aboutBio2);
      if (aboutFile) {
        formData.append('imageFile', aboutFile);
      } else {
        formData.append('image', aboutImage);
      }

      const response = await updateAboutDetails(formData, token);
      
      setAboutUpdateMessage('About page updated successfully!');
      if (response && response.image) {
        setAboutImage(response.image);
      }
      setAboutFile(null);

      // Reset file input element manually
      const fileInput = document.getElementById('aboutFileInput');
      if (fileInput) fileInput.value = '';

      setTimeout(() => setAboutUpdateMessage(''), 4000);
    } catch (error) {
      console.error(error);
      setAboutUpdateError("Failed to update about details.");
    } finally {
      setIsSubmittingAbout(false);
    }
  };

  // --- SECURITY TAB METHODS ---
  const handleUpdateCredentials = async (e) => {
    e.preventDefault();
    if (!newEmail && !newPassword) return;
    setSecurityMessage('');
    setSecurityError('');

    try {
      await updateAdminCredentials({ email: newEmail, password: newPassword }, token);
      setSecurityMessage('Admin credentials updated successfully!');
      setNewEmail('');
      setNewPassword('');
      setTimeout(() => setSecurityMessage(''), 4000);
    } catch (error) {
      setSecurityError('Failed to update admin credentials.');
    }
  };

  if (loading) return <div className="container" style={{ padding: '8rem 0', textAlign: 'center', fontSize: '1.25rem', color: 'var(--text-secondary)' }}>Loading Dashboard Content...</div>;

  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '6rem' }}>
      {/* Dashboard Top Nav */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ color: 'var(--accent)', fontSize: '3rem', fontWeight: 'bold' }}>Studio Control</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '0.25rem' }}>Admin panel for dreamshade.studio</p>
        </div>
        <button onClick={handleLogout} className="btn-outline">Logout Security Session</button>
      </div>

      {/* Tabs Menu bar */}
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        marginBottom: '3rem', 
        borderBottom: '1px solid var(--border)', 
        paddingBottom: '1rem',
        overflowX: 'auto',
        whiteSpace: 'nowrap'
      }}>
        <button 
          onClick={() => setActiveTab('orders')} 
          className={activeTab === 'orders' ? 'btn-primary' : 'btn-outline'}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '30px', padding: '0.6rem 1.5rem', fontSize: '0.95rem' }}
        >
          <ClipboardList size={18} /> Orders & Commissions ({orders.length})
        </button>
        <button 
          onClick={() => setActiveTab('collection')} 
          className={activeTab === 'collection' ? 'btn-primary' : 'btn-outline'}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '30px', padding: '0.6rem 1.5rem', fontSize: '0.95rem' }}
        >
          <ImageIcon size={18} /> Manage Collection ({artworks.length})
        </button>
        <button 
          onClick={() => setActiveTab('about')} 
          className={activeTab === 'about' ? 'btn-primary' : 'btn-outline'}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '30px', padding: '0.6rem 1.5rem', fontSize: '0.95rem' }}
        >
          <UserIcon size={18} /> Edit About details
        </button>
        <button 
          onClick={() => setActiveTab('security')} 
          className={activeTab === 'security' ? 'btn-primary' : 'btn-outline'}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '30px', padding: '0.6rem 1.5rem', fontSize: '0.95rem' }}
        >
          <Lock size={18} /> Account Credentials
        </button>
      </div>

      {/* --- ORDERS TAB CONTENT --- */}
      {activeTab === 'orders' && (
        <div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Customer Request Queue</h2>
          <div className="card" style={{ overflowX: 'auto', padding: '1rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '1.25rem 1rem' }}>Date</th>
                  <th style={{ padding: '1.25rem 1rem' }}>Customer Details</th>
                  <th style={{ padding: '1.25rem 1rem' }}>Commission Details</th>
                  <th style={{ padding: '1.25rem 1rem' }}>Ref Image</th>
                  <th style={{ padding: '1.25rem 1rem' }}>Status</th>
                  <th style={{ padding: '1.25rem 1rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      No orders or custom commission submissions found.
                    </td>
                  </tr>
                ) : (
                  orders.map(order => (
                    <tr key={order._id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '1.25rem 1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '1.25rem 1rem' }}>
                        <div style={{ fontWeight: '600' }}>{order.customerName}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{order.customerEmail}</div>
                        {order.customerPhone && <div style={{ fontSize: '0.80rem', color: 'var(--text-secondary)' }}>{order.customerPhone}</div>}
                      </td>
                      <td style={{ padding: '1.25rem 1rem', maxWidth: '300px' }}>
                        <div style={{ fontWeight: '500', color: 'var(--accent)' }}>
                          {order.portraitType} ({order.paperSize})
                        </div>
                        {order.description && (
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {order.description}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '1.25rem 1rem' }}>
                        {order.referenceImages && order.referenceImages.length > 0 ? (
                          <a 
                            href={`http://localhost:5000${order.referenceImages[0]}`} 
                            target="_blank" 
                            rel="noreferrer" 
                            style={{ 
                              color: 'var(--accent)', 
                              textDecoration: 'underline', 
                              fontSize: '0.9rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem'
                            }}
                          >
                            View Reference File
                          </a>
                        ) : (
                          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No attachments</span>
                        )}
                      </td>
                      <td style={{ padding: '1.25rem 1rem' }}>
                        <select 
                          value={order.status} 
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="form-select"
                          style={{ 
                            padding: '0.4rem 0.8rem', 
                            fontSize: '0.9rem',
                            backgroundColor: 'rgba(2, 6, 23, 0.4)',
                            borderColor: 'var(--border)',
                            width: '130px'
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="accepted">Accepted</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td style={{ padding: '1.25rem 1rem' }}>
                        {deletingId === order._id ? (
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button 
                              onClick={() => confirmDeleteOrder(order._id)}
                              style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem' }}
                            >
                              Confirm
                            </button>
                            <button 
                              onClick={() => setDeletingId(null)}
                              style={{ backgroundColor: '#475569', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem' }}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setDeletingId(order._id)}
                            style={{ 
                              backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                              color: '#ef4444', 
                              border: '1px solid rgba(239, 68, 68, 0.3)', 
                              padding: '0.4rem 0.8rem', 
                              borderRadius: '6px', 
                              fontSize: '0.85rem',
                              transition: 'all 0.3s ease'
                            }}
                            className="btn-outline"
                          >
                            Delete Order
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- COLLECTION TAB CONTENT --- */}
      {activeTab === 'collection' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '3rem' }}>
          
          {/* Add Artwork Form */}
          <div>
            <div className="card">
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
                <Plus size={22} color="var(--accent)" /> Add Artwork to Showcase
              </h2>
              <form onSubmit={handleAddArtwork}>
                <div className="form-group">
                  <label className="form-label">Artwork Title</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={artName} 
                    onChange={(e) => setArtName(e.target.value)} 
                    placeholder="e.g. Whispering Shadows"
                    required
                  />
                </div>

                <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Drawing Category</label>
                    <select 
                      className="form-select" 
                      value={artCategory} 
                      onChange={(e) => setArtCategory(e.target.value)}
                    >
                      <option value="Pencil Sketch">Pencil Sketch</option>
                      <option value="Color Portrait">Color Portrait</option>
                      <option value="Doodle Art">Doodle Art</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Creation Year</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={artYear} 
                      onChange={(e) => setArtYear(e.target.value)} 
                      placeholder="e.g. 2026"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description / Inspiration</label>
                  <textarea 
                    className="form-input" 
                    rows="3"
                    value={artDescription} 
                    onChange={(e) => setArtDescription(e.target.value)} 
                    placeholder="Describe details, medium, or concept..."
                    style={{ resize: 'none' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Upload Artwork Image File</label>
                  <div className="file-drop-area" style={{ padding: '2rem 1rem' }}>
                    <Upload size={32} style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }} />
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      {artFile ? `Selected: ${artFile.name}` : 'Select jpeg, png, or svg file'}
                    </p>
                    <input 
                      id="artFileInput"
                      type="file" 
                      className="file-input" 
                      accept="image/*"
                      onChange={(e) => setArtFile(e.target.files[0])}
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn-primary" 
                  style={{ width: '100%', padding: '0.9rem' }}
                  disabled={isSubmittingArt}
                >
                  {isSubmittingArt ? 'Uploading Image...' : 'Publish Artwork to Collection'}
                </button>

                {artAddMessage && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', fontWeight: 'bold', marginTop: '1.25rem' }}>
                    <Check size={18} /> {artAddMessage}
                  </div>
                )}
                {artAddError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontWeight: 'bold', marginTop: '1.25rem' }}>
                    <AlertCircle size={18} /> {artAddError}
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Current Gallery Listing */}
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Live Showcased Artworks ({artworks.length})</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '720px', overflowY: 'auto', paddingRight: '0.5rem' }}>
              {artworks.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)', background: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  No custom artworks uploaded yet. Default fallback images will be loaded for the clients.
                </div>
              ) : (
                artworks.map(art => {
                  const imagePath = art.image.startsWith('/uploads') 
                    ? `http://localhost:5000${art.image}` 
                    : art.image;
                  
                  return (
                    <div 
                      key={art._id} 
                      className="card" 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '1.5rem', 
                        padding: '1rem', 
                        borderRadius: '12px',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <img 
                          src={imagePath} 
                          alt={art.name} 
                          style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border)' }} 
                        />
                        <div>
                          <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>{art.name}</h4>
                          <span style={{ 
                            fontSize: '0.75rem', 
                            backgroundColor: 'rgba(14, 165, 233, 0.1)', 
                            color: 'var(--accent)', 
                            padding: '0.2rem 0.5rem', 
                            borderRadius: '4px',
                            fontWeight: '600',
                            display: 'inline-block',
                            marginTop: '0.25rem'
                          }}>
                            {art.category} ({art.year})
                          </span>
                        </div>
                      </div>

                      <div>
                        {deletingArtId === art._id ? (
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button 
                              onClick={() => handleDeleteArtwork(art._id)}
                              style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem' }}
                            >
                              Confirm
                            </button>
                            <button 
                              onClick={() => setDeletingArtId(null)}
                              style={{ backgroundColor: '#475569', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem' }}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setDeletingArtId(art._id)}
                            style={{ 
                              background: 'none', 
                              border: '1px solid rgba(239, 68, 68, 0.3)', 
                              color: '#ef4444', 
                              padding: '0.5rem', 
                              borderRadius: '8px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.3s ease'
                            }}
                            className="btn-outline"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      )}

      {/* --- ABOUT TAB CONTENT --- */}
      {activeTab === 'about' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '3rem' }}>
          
          {/* Edit About Copy Form */}
          <div>
            <div className="card">
              <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Configure About Bio Details</h2>
              <form onSubmit={handleUpdateAboutDetails}>
                
                <div className="form-group">
                  <label className="form-label">About Page Title Header</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={aboutTitle} 
                    onChange={(e) => setAboutTitle(e.target.value)} 
                    placeholder="e.g. About dreamshade.studio"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Biography Paragraph 1 (Introduction)</label>
                  <textarea 
                    className="form-input" 
                    rows="4"
                    value={aboutBio1} 
                    onChange={(e) => setAboutBio1(e.target.value)} 
                    placeholder="Introduce yourself, your studio name, specializations, and drive..."
                    style={{ resize: 'vertical' }}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Biography Paragraph 2 (Details & Goal)</label>
                  <textarea 
                    className="form-input" 
                    rows="4"
                    value={aboutBio2} 
                    onChange={(e) => setAboutBio2(e.target.value)} 
                    placeholder="Provide details on custom commissions, your goal, process details, and art focus..."
                    style={{ resize: 'vertical' }}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Upload New Artist Photo (Replaces current photo)</label>
                  <div className="file-drop-area" style={{ padding: '2rem 1rem' }}>
                    <Upload size={32} style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }} />
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      {aboutFile ? `Selected: ${aboutFile.name}` : 'Select jpeg, png, or svg file'}
                    </p>
                    <input 
                      id="aboutFileInput"
                      type="file" 
                      className="file-input" 
                      accept="image/*"
                      onChange={(e) => setAboutFile(e.target.files[0])}
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn-primary" 
                  style={{ width: '100%', padding: '0.9rem' }}
                  disabled={isSubmittingAbout}
                >
                  {isSubmittingAbout ? 'Updating Profile Details...' : 'Save & Publish About details'}
                </button>

                {aboutUpdateMessage && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', fontWeight: 'bold', marginTop: '1.25rem' }}>
                    <Check size={18} /> {aboutUpdateMessage}
                  </div>
                )}
                {aboutUpdateError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontWeight: 'bold', marginTop: '1.25rem' }}>
                    <AlertCircle size={18} /> {aboutUpdateError}
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Current About Profile Preview */}
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Live Portrait Preview</h2>
            <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              {aboutImage ? (
                <img 
                  src={aboutImage.startsWith('/uploads') ? `http://localhost:5000${aboutImage}` : aboutImage} 
                  alt="Artist Profile portrait" 
                  style={{ 
                    width: '100%', 
                    height: '350px', 
                    objectFit: 'cover', 
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    marginBottom: '1.5rem'
                  }} 
                />
              ) : (
                <div style={{ width: '100%', height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(2,6,23,0.4)', border: '1px dashed var(--border)', borderRadius: '12px', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  No Profile Image Set
                </div>
              )}
              <h3 style={{ fontSize: '1.25rem', color: 'var(--accent)' }}>{aboutTitle || 'Your Title'}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                This is the profile image and title currently visible to users visiting your About page.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* --- ACCOUNT SECURITY TAB CONTENT --- */}
      {activeTab === 'security' && (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="card">
            <h2 style={{ color: 'var(--accent)', marginBottom: '1.5rem', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lock size={20} /> Update Credentials
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              To ensure safety, change your login email address and security access password regularly.
            </p>
            <form onSubmit={handleUpdateCredentials}>
              <div className="form-group">
                <label className="form-label">New Email Address</label>
                <input 
                  type="email" 
                  className="form-input" 
                  value={newEmail} 
                  onChange={(e) => setNewEmail(e.target.value)} 
                  placeholder="Leave blank to keep current" 
                />
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input 
                  type="password" 
                  className="form-input" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  placeholder="Leave blank to keep current" 
                />
              </div>
              <button 
                type="submit" 
                className="btn-primary" 
                style={{ width: '100%', padding: '0.9rem' }}
                disabled={!newEmail && !newPassword}
              >
                Update Security Credentials
              </button>
              
              {securityMessage && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', fontWeight: 'bold', marginTop: '1.25rem' }}>
                  <Check size={18} /> {securityMessage}
                </div>
              )}
              {securityError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontWeight: 'bold', marginTop: '1.25rem' }}>
                  <AlertCircle size={18} /> {securityError}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
