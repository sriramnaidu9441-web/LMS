import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user, login } = useAuth();
  const [full, setFull] = useState(null);
  const [saving, setSaving] = useState(false);

  // form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [about, setAbout] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [fatherName, setFatherName] = useState('');

  useEffect(() => {
    if (!user) return;
    const raw = localStorage.getItem('lmsUsers');
    let found = null;
    if (raw) {
      try {
        const users = JSON.parse(raw);
        found = users.find((u) => u.email && user.email && u.email.toLowerCase() === user.email.toLowerCase());
      } catch (e) {
        found = null;
      }
    }
    // ensure profile has defaults for missing extended fields and persist
    const fillDefaultsAndPersist = (f) => {
      if (!f) return f;
      let changed = false;
      const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
      const updated = { ...f };
      if (!updated.phone) { updated.phone = `+1 ${Math.floor(600 + Math.random() * 300)}-${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`; changed = true; }
      if (!updated.bloodGroup) { updated.bloodGroup = pick(['A+','A-','B+','B-','O+','O-','AB+','AB-']); changed = true; }
      if (!updated.location) { updated.location = pick(['New York, USA','London, UK','Bangalore, India','Toronto, Canada','Sydney, Australia']); changed = true; }
      if (!updated.fatherName) { updated.fatherName = `Mr. ${updated.name?.split(' ')[0] || 'Parent'}`; changed = true; }
      if (changed) {
        try {
          const raw2 = localStorage.getItem('lmsUsers');
          const users2 = raw2 ? JSON.parse(raw2) : [];
          const next = users2.filter((u) => !(u.email && updated.email && u.email.toLowerCase() === updated.email.toLowerCase()));
          next.unshift(updated);
          localStorage.setItem('lmsUsers', JSON.stringify(next));
        } catch (e) {
          // ignore
        }
      }
      return updated;
    };

    let ensured = null;
    if (found) {
      ensured = fillDefaultsAndPersist(found);
    } else {
      // create a default profile entry for this user
      const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
      ensured = {
        id: user?.id || Math.random().toString(36).substr(2, 9),
        name: user?.name || '',
        email: user?.email || '',
        role: user?.role || 'student',
        phone: `+1 ${Math.floor(600 + Math.random() * 300)}-${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
        bloodGroup: pick(['A+','B+','O+','AB+']),
        location: pick(['New York, USA','London, UK','Bangalore, India','Toronto, Canada']),
        fatherName: `Mr. ${user?.name?.split(' ')[0] || 'Parent'}`,
        createdAt: Date.now(),
      };
      try {
        const raw2 = localStorage.getItem('lmsUsers');
        const users2 = raw2 ? JSON.parse(raw2) : [];
        const next = users2.filter((u) => !(u.email && ensured.email && u.email.toLowerCase() === ensured.email.toLowerCase()));
        next.unshift(ensured);
        localStorage.setItem('lmsUsers', JSON.stringify(next));
      } catch (e) {}
    }
    setFull(ensured);

    // initialize form fields
    setName(ensured?.name || user?.name || '');
    setEmail(ensured?.email || user?.email || '');
    setPhone(ensured?.phone || '');
    setLocation(ensured?.location || '');
    setWebsite(ensured?.website || '');
    setAbout(ensured?.about || '');
    setBloodGroup(ensured?.bloodGroup || '');
    setFatherName(ensured?.fatherName || '');
  }, [user]);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);

    const raw = localStorage.getItem('lmsUsers');
    const users = raw ? JSON.parse(raw) : [];

    const updated = {
      id: full?.id || user?.id || Math.random().toString(36).substr(2, 9),
      name: name || user?.name,
      email: email || user?.email,
      role: user?.role || (full && full.role) || 'student',
      phone,
      location,
      website,
      about,
      bloodGroup,
      fatherName,
      createdAt: full?.createdAt || Date.now(),
    };

    // replace or add in users
    const next = users.filter((u) => !(u.email && updated.email && u.email.toLowerCase() === updated.email.toLowerCase()));
    next.unshift(updated);
    localStorage.setItem('lmsUsers', JSON.stringify(next));

    // update active user in localStorage and auth context
    const publicUser = { id: updated.id, name: updated.name, email: updated.email, role: updated.role };
    localStorage.setItem('lmsUser', JSON.stringify(publicUser));
    login(publicUser);

    setTimeout(() => {
      setSaving(false);
      alert('Profile saved');
    }, 300);
  };

  return (
    <div className="page profile-page">
      <form className="profile-wrapper" onSubmit={handleSave}>
        <div className="profile-header">
          <div className="profile-header-left">
            <div className="avatar-wrap">
              <div className="avatar-circle">
                <img
                  className="profile-pic"
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=667eea&color=fff&size=256`}
                  alt={name}
                />
                <button type="button" className="avatar-upload" title="Change avatar">📷</button>
              </div>
            </div>
            <div className="profile-header-info">
              <h2>{name || 'User Name'}</h2>
              <div className="profile-email">{email}</div>
              <div className="role-pill">{user?.role}</div>
            </div>
          </div>
        </div>

        <div className="profile-form-grid">
          <div className="form-col">
            <label>Full Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="form-control" />
          </div>

          <div className="form-col">
            <label>Email Address</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" />
          </div>

          <div className="form-col">
            <label>Phone Number</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="form-control" />
          </div>

          <div className="form-col">
            <label>Location</label>
            <input value={location} onChange={(e) => setLocation(e.target.value)} className="form-control" />
          </div>

          <div className="form-col-full">
            <label>Website URL</label>
            <input value={website} onChange={(e) => setWebsite(e.target.value)} className="form-control" placeholder="https://yourwebsite.com" />
          </div>

          <div className="form-col-full">
            <label>About Me</label>
            <textarea value={about} onChange={(e) => setAbout(e.target.value)} className="form-control" rows={6} maxLength={500} placeholder="Share something about yourself..."></textarea>
            <div className="char-count">{about.length}/500 characters</div>
          </div>

          <div className="form-col">
            <label>Blood Group</label>
            <input value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} className="form-control" />
          </div>

          <div className="form-col">
            <label>Father's Name</label>
            <input value={fatherName} onChange={(e) => setFatherName(e.target.value)} className="form-control" />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">{saving ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
