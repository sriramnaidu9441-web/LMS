import React, { useEffect, useState } from 'react';
import './Settings.css';

const ADMIN_SETTINGS_KEY = 'lmsAdminSettings';

const ensureThumbnailsForKey = (storageKey) => {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return 0;
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return 0;
    const available = 22;
    const next = list.map((c, idx) => {
      if (c && c.thumbnail) return c;
      const n = (idx % available) + 1;
      return { ...c, thumbnail: `/assets/course-${n}.svg` };
    });
    localStorage.setItem(storageKey, JSON.stringify(next));
    return next.length;
  } catch (e) {
    return 0;
  }
};

const AdminSettings = () => {
  const [useLocalThumbnails, setUseLocalThumbnails] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(ADMIN_SETTINGS_KEY);
      if (raw) {
        const cfg = JSON.parse(raw);
        setUseLocalThumbnails(Boolean(cfg.useLocalThumbnails));
      }
    } catch (e) {}
  }, []);

  const handleToggle = () => {
    const next = !useLocalThumbnails;
    setUseLocalThumbnails(next);
    localStorage.setItem(ADMIN_SETTINGS_KEY, JSON.stringify({ useLocalThumbnails: next }));

    if (next) {
      let count = 0;
      count += ensureThumbnailsForKey('lmsEnrolledCourses');
      count += ensureThumbnailsForKey('lmsInstructorCourses');
      count += ensureThumbnailsForKey('lmsAdminCourses');
      setMessage(`Applied default thumbnails to ${count} records across storage.`);
    } else {
      setMessage('Local thumbnails toggle disabled. Existing thumbnails left unchanged.');
    }
  };

  const handleApplyNow = () => {
    let count = 0;
    count += ensureThumbnailsForKey('lmsEnrolledCourses');
    count += ensureThumbnailsForKey('lmsInstructorCourses');
    count += ensureThumbnailsForKey('lmsAdminCourses');
    setMessage(`Applied default thumbnails to ${count} records across storage.`);
  };

  return (
    <div className="page admin-settings">
      <div className="page-header">
        <div>
          <h1>Platform Settings</h1>
          <p>Manage platform-wide configuration and defaults.</p>
        </div>
      </div>

      <div className="settings-card">
        <div className="setting-row">
          <div>
            <h3>Use Local SVG Thumbnails</h3>
            <p>When enabled, the platform will assign the bundled SVG thumbnails (found in <code>/public/assets</code>) to courses that don't have a thumbnail set.</p>
          </div>
          <div className="setting-control">
            <label className="switch">
              <input type="checkbox" checked={useLocalThumbnails} onChange={handleToggle} />
              <span className="slider" />
            </label>
          </div>
        </div>

        <div className="setting-actions">
          <button className="btn btn-primary" onClick={handleApplyNow}>Apply Now</button>
          <div className="hint">{message}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
