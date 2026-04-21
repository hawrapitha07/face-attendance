import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getStudentAttendance } from '../api';

const darkTooltip = {
  contentStyle: {
    background: '#161b22', border: '1px solid #30363d',
    borderRadius: 8, fontSize: 13, color: '#e6edf3',
  },
};

export default function StudentDashboard() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const studentId = sessionStorage.getItem('student_id');

  useEffect(() => {
    if (studentId) getStudentAttendance(studentId).then(r => setData(r.data));
  }, []);

  const logout = () => { sessionStorage.clear(); navigate('/login'); };

  if (!data) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', color:'var(--text2)' }}>
      Loading...
    </div>
  );

  const pct   = Math.round((data.present / data.total) * 100);
  const isLow = pct < 75;

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', padding: 32 }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom: 28 }}>
          <div style={{ display:'flex', alignItems:'center', gap: 14 }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: 'var(--greenglow)', border: '1px solid var(--green)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize: 20, fontWeight: 700, color: 'var(--green)',
            }}>
              {data.name.charAt(0)}
            </div>
            <div>
              <h2 style={{ marginBottom: 2 }}>{data.name}</h2>
              <p style={{ color:'var(--text2)', fontSize:13 }}>
                {data.student_id} · {data.branch} · Year {data.year}
              </p>
            </div>
          </div>
          <button className="ghost" onClick={logout}>⏻ Logout</button>
        </div>

        {/* Low attendance warning */}
        {isLow && (
          <div className="fade-in" style={{
            background: 'rgba(248,81,73,0.1)',
            border: '1px solid rgba(248,81,73,0.3)',
            borderRadius: 'var(--radius2)',
            padding: '14px 18px', marginBottom: 24,
            color: 'var(--red)',
          }}>
            ⚠ Your attendance is {pct}% — below the 75% requirement. Please attend more classes.
          </div>
        )}

        {/* Stat cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:24 }}>
          {[
            { label:'Sessions Present', value: data.present },
            { label:'Total Sessions',   value: data.total   },
            { label:'Attendance %',     value: pct + '%', color: isLow ? 'var(--red)' : 'var(--green)' },
          ].map(c => (
            <div key={c.label} style={{
              background:'var(--bg2)', border:'1px solid var(--border)',
              borderRadius:'var(--radius2)', padding:'18px 20px',
            }}>
              <div style={{ fontSize:13, color:'var(--text2)', marginBottom:8 }}>{c.label}</div>
              <div style={{ fontSize:28, fontWeight:700, color: c.color || 'var(--text)' }}>{c.value}</div>
            </div>
          ))}
        </div>

        {/* Trend chart */}
        <div style={{
          background:'var(--bg2)', border:'1px solid var(--border)',
          borderRadius:'var(--radius2)', padding:22, marginBottom:24,
        }}>
          <h3 style={{ marginBottom:18 }}>My Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={data.trend}>
              <XAxis dataKey="date" tick={{ fill:'#8b949e', fontSize:11 }} />
              <YAxis domain={[0,1]} tickFormatter={v => v===1?'P':'A'} tick={{ fill:'#8b949e', fontSize:11 }} />
              <Tooltip {...darkTooltip} formatter={v => [v===1?'Present':'Absent']} />
              <Line type="stepAfter" dataKey="status" stroke="#3fb950" strokeWidth={2} dot={{ r:3, fill:'#3fb950', strokeWidth:0 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Session table */}
        <div style={{
          background:'var(--bg2)', border:'1px solid var(--border)',
          borderRadius:'var(--radius2)', overflow:'hidden',
        }}>
          <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--border)' }}>
            <h3>Session History</h3>
          </div>
          <table>
            <thead><tr><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              {data.sessions.map((s, i) => (
                <tr key={i}>
                  <td style={{ color:'var(--text2)' }}>{s.session}</td>
                  <td>
                    <span style={{
                      padding:'3px 10px', borderRadius:20, fontSize:12, fontWeight:500,
                      background: s.status==='Present' ? 'rgba(63,185,80,0.15)' : 'rgba(248,81,73,0.15)',
                      color: s.status==='Present' ? 'var(--green)' : 'var(--red)',
                    }}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}