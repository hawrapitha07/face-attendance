import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { enrollStudent } from '../api';
import Layout from '../components/Layout';

export default function Enroll() {
  const [form, setForm]     = useState({ student_id:'', name:'', branch:'', year:'' });
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePhotos = e => {
    setPhotos(Array.from(e.target.files));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (photos.length < 5) { setError('Upload at least 5 photos.'); return; }
    setLoading(true); setError('');
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    photos.forEach(p => fd.append('photos', p));
    try {
      await enrollStudent(fd);
      setSuccess(`${form.name} enrolled successfully!`);
      setTimeout(() => navigate('/admin'), 2000);
    } catch {
      setError('Enrollment failed. Student ID may already exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div style={{ marginBottom: 28 }}>
        <h2>Enroll Student</h2>
        <p style={{ color: 'var(--text2)', marginTop: 4 }}>Register a new student and capture face embeddings</p>
      </div>

      <div style={{ maxWidth: 600 }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Student info */}
          <div style={{
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius2)', padding: 22,
          }}>
            <h3 style={{ marginBottom: 16, color: 'var(--text2)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Student Info
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={lbl}>Student ID</label>
                <input name="student_id" placeholder="e.g. 0801IT23001" value={form.student_id} onChange={handle} required />
              </div>
              <div>
                <label style={lbl}>Full Name</label>
                <input name="name" placeholder="Full name" value={form.name} onChange={handle} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={lbl}>Branch</label>
                  <input name="branch" placeholder="e.g. CS, EC, ME" value={form.branch} onChange={handle} required />
                </div>
                <div>
                  <label style={lbl}>Year</label>
                  <select name="year" value={form.year} onChange={handle} required>
                    <option value="">Select year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Photos */}
          <div style={{
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius2)', padding: 22,
          }}>
            <h3 style={{ marginBottom: 4, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text2)' }}>
              Face Photos
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 14 }}>
              Minimum 5 photos · Different angles and lighting for best accuracy
            </p>
            <input type="file" accept="image/*" multiple onChange={handlePhotos} required />

            {photos.length > 0 && (
              <div className="fade-in">
                <div style={{ marginTop: 12, fontSize: 13, color: 'var(--green)', marginBottom: 10 }}>
                  ✓ {photos.length} photo{photos.length > 1 ? 's' : ''} selected
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6 }}>
                  {photos.slice(0, 12).map((p, i) => (
                    <img
                      key={i}
                      src={URL.createObjectURL(p)}
                      alt={`photo ${i+1}`}
                      style={{
                        width: '100%', aspectRatio: '1',
                        objectFit: 'cover', borderRadius: 6,
                        border: '1px solid var(--border)',
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {error && (
            <div style={{
              background: 'rgba(248,81,73,0.1)', border: '1px solid rgba(248,81,73,0.3)',
              borderRadius: 'var(--radius)', padding: '10px 14px', color: 'var(--red)', fontSize: 13,
            }}>{error}</div>
          )}

          {success && (
            <div style={{
              background: 'rgba(63,185,80,0.1)', border: '1px solid rgba(63,185,80,0.3)',
              borderRadius: 'var(--radius)', padding: '10px 14px', color: 'var(--green)', fontSize: 13,
            }}>{success}</div>
          )}

          <button type="submit" disabled={loading} style={{ padding: '12px 0', fontSize: 15 }}>
            {loading ? '⟳  Enrolling...' : '＋  Enroll Student'}
          </button>
        </form>
      </div>
    </Layout>
  );
}

const lbl = { display: 'block', fontSize: 12, color: 'var(--text2)', marginBottom: 6, fontWeight: 500 };