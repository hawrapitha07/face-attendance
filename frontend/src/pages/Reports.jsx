import { useEffect, useState } from 'react';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { getSummary, exportCSV } from '../api';
import Layout from '../components/Layout';

const darkTooltip = {
  contentStyle: {
    background: '#161b22', border: '1px solid #30363d',
    borderRadius: 8, fontSize: 13, color: '#e6edf3',
  },
  cursor: { fill: 'rgba(255,255,255,0.04)' },
};

export default function Reports() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getSummary().then(r => setData(r.data)).catch(() => {});
  }, []);

  const handleExport = async () => {
    const { data: blob } = await exportCSV();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'attendance.csv'; a.click();
  };

  if (!data) return <Layout><div style={{ color: 'var(--text2)' }}>Loading...</div></Layout>;

  return (
    <Layout>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom: 28 }}>
        <div>
          <h2>Reports & Analytics</h2>
          <p style={{ color: 'var(--text2)', marginTop: 4 }}>Overview of attendance across all students</p>
        </div>
        <button onClick={handleExport} className="ghost">↓ Export CSV</button>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
        <SCard label="Total Students"    value={data.total_students} />
        <SCard label="Overall Attendance" value={data.overall_pct + '%'} accent />
        <SCard label="Below 75%"          value={data.below_75} danger />
      </div>

      {/* Bar chart */}
      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius2)', padding: 24, marginBottom: 20,
      }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom: 20 }}>
          <h3>Attendance per Student</h3>
          <div style={{ display:'flex', gap: 16, fontSize: 12, color: 'var(--text2)', alignItems:'center' }}>
            <span style={{ display:'flex', alignItems:'center', gap: 6 }}>
              <span style={{ width:10, height:10, borderRadius:2, background:'var(--green)', display:'inline-block' }}/>
              Above 75%
            </span>
            <span style={{ display:'flex', alignItems:'center', gap: 6 }}>
              <span style={{ width:10, height:10, borderRadius:2, background:'var(--red)', display:'inline-block' }}/>
              Below 75%
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data.per_student} margin={{ bottom: 30 }}>
            <XAxis dataKey="name" tick={{ fill:'#8b949e', fontSize:12 }} angle={-30} textAnchor="end" />
            <YAxis domain={[0,100]} tick={{ fill:'#8b949e', fontSize:12 }} unit="%" />
            <Tooltip {...darkTooltip} formatter={v => [v + '%', 'Attendance']} />
            <Bar dataKey="percentage" radius={[4,4,0,0]}>
              {data.per_student.map((entry, i) => (
                <Cell key={i} fill={entry.percentage < 75 ? '#f85149' : '#3fb950'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Line chart */}
      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius2)', padding: 24,
      }}>
        <h3 style={{ marginBottom: 20 }}>Attendance Trend</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data.trend}>
            <XAxis dataKey="date" tick={{ fill:'#8b949e', fontSize:12 }} />
            <YAxis domain={[0,100]} tick={{ fill:'#8b949e', fontSize:12 }} unit="%" />
            <Tooltip {...darkTooltip} formatter={v => [v + '%', 'Present']} />
            <Line
              type="monotone" dataKey="present_pct"
              stroke="#3fb950" strokeWidth={2}
              dot={{ fill:'#3fb950', r:4, strokeWidth:0 }}
              activeDot={{ r:6, fill:'#3fb950' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Layout>
  );
}

function SCard({ label, value, accent, danger }) {
  const color = accent ? 'var(--green)' : danger ? 'var(--red)' : 'var(--text)';
  const bg    = accent ? 'rgba(63,185,80,0.1)' : danger ? 'rgba(248,81,73,0.1)' : 'var(--bg2)';
  const border= accent ? 'rgba(63,185,80,0.3)' : danger ? 'rgba(248,81,73,0.3)' : 'var(--border)';
  return (
    <div style={{ background:bg, border:`1px solid ${border}`, borderRadius:'var(--radius2)', padding:'18px 22px' }}>
      <div style={{ fontSize:13, color:'var(--text2)', marginBottom:8 }}>{label}</div>
      <div style={{ fontSize:30, fontWeight:700, color }}>{value}</div>
    </div>
  );
}