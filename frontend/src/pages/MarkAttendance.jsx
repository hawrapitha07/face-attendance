import { useState } from 'react';
import { uploadGroupPhoto } from '../api';
import Layout from '../components/Layout';

export default function MarkAttendance() {
  const [file, setFile]       = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [drag, setDrag]       = useState(false);

  const handleFile = (f) => {
    if (!f) return;
    setFile(f); setPreview(URL.createObjectURL(f));
    setResult(null); setError('');
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDrag(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    setLoading(true); setError('');
    const fd = new FormData();
    fd.append('photo', file);
    try {
      const { data } = await uploadGroupPhoto(fd);
      setResult(data);
      if (data.annotated_image)
        setPreview(`data:image/jpeg;base64,${data.annotated_image}`);
    } catch {
      setError('Detection failed. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div style={{ marginBottom: 28 }}>
        <h2>Mark Attendance</h2>
        <p style={{ color: 'var(--text2)', marginTop: 4 }}>Upload a group photo to detect and mark present students</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: preview ? '1fr 1fr' : '1fr', gap: 24 }}>

        {/* Left — upload */}
        <div>
          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById('fileInput').click()}
            style={{
              border: `2px dashed ${drag ? 'var(--green)' : 'var(--border)'}`,
              borderRadius: 'var(--radius2)',
              padding: '40px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              background: drag ? 'var(--greenglow)' : 'var(--bg2)',
              transition: 'all 0.2s',
              marginBottom: 16,
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 12 }}>◎</div>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>
              {file ? file.name : 'Drop photo here or click to browse'}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text2)' }}>
              Supports JPG, PNG — group photos work best
            </div>
            <input
              id="fileInput" type="file" accept="image/*"
              onChange={e => handleFile(e.target.files[0])}
              style={{ display: 'none' }}
            />
          </div>

          <button
            onClick={handleUpload}
            disabled={!file || loading}
            style={{ width: '100%', padding: '12px 0', fontSize: 15 }}
          >
            {loading ? '⟳  Detecting faces...' : '◎  Run Face Detection'}
          </button>

          {error && (
            <div style={{
              marginTop: 14,
              background: 'rgba(248,81,73,0.1)',
              border: '1px solid rgba(248,81,73,0.3)',
              borderRadius: 'var(--radius)',
              padding: '10px 14px',
              color: 'var(--red)', fontSize: 13,
            }}>
              {error}
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="fade-in" style={{ marginTop: 24 }}>
              <div style={{
                background: 'var(--bg2)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius2)', overflow: 'hidden',
              }}>
                <div style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--border)',
                  display: 'flex', justifyContent: 'space-between',
                }}>
                  <span style={{ fontWeight: 600 }}>Session: {result.session}</span>
                  <span style={{ color: 'var(--text2)', fontSize: 13 }}>
                    {result.detected.length} present · {result.absent.length} absent
                  </span>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>ID</th>
                      <th>Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.detected.map(s => (
                      <tr key={s.student_id}>
                        <td>{s.name}</td>
                        <td style={{ color: 'var(--text2)', fontFamily: 'monospace' }}>{s.student_id}</td>
                        <td>
                          <span style={{
                            padding: '2px 10px', borderRadius: 20, fontSize: 12,
                            background: s.confidence < 0.45 ? 'rgba(63,185,80,0.15)' : 'rgba(210,153,34,0.15)',
                            color: s.confidence < 0.45 ? 'var(--green)' : 'var(--yellow)',
                          }}>
                            {s.confidence.toFixed(3)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {result.absent.length > 0 && (
                  <div style={{
                    padding: '12px 16px',
                    borderTop: '1px solid var(--border)',
                    fontSize: 13, color: 'var(--text2)',
                  }}>
                    <span style={{ color: 'var(--red)', fontWeight: 600 }}>Absent: </span>
                    {result.absent.join(', ')}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right — preview */}
        {preview && (
          <div className="fade-in">
            <div style={{
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius2)',
              overflow: 'hidden',
            }}>
              <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', fontSize: 13, color: 'var(--text2)' }}>
                {result ? 'Annotated result' : 'Preview'}
              </div>
              <img src={preview} alt="preview" style={{ width: '100%', display: 'block' }} />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}