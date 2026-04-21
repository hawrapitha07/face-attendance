import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSummary } from '../api';
import Layout from '../components/Layout';

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    getSummary().then(r => setSummary(r.data)).catch(() => {});
  }, []);

  return (
    <Layout>
      <div style={{ marginBottom: 28 }}>
        <h2>Dashboard</h2>
        <p style={{ color: 'var(--text2)', marginTop: 4 }}>
          {new Date().toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        <StatCard icon="◉" label="Total Students"    value={summary?.total_students ?? '—'} />
        <StatCard icon="◷" label="Sessions Held"     value={summary?.total_sessions  ?? '—'} />
        <StatCard icon="◈" label="Today's Attendance" value={summary?.today_pct != null ? summary.today_pct + '%' : '—'} accent />
      </div>

      {/* Action cards */}
      <h3 style={{ marginBottom: 16, color: 'var(--text2)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Quick Actions
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        <ActionCard icon="◎" title="Mark Attendance"   desc="Upload a group photo to mark today's session" to="/admin/mark"       color="var(--green)" />
        <ActionCard icon="＋" title="Enroll Student"    desc="Register a new student with face photos"      to="/admin/enroll"      color="var(--blue)"  />
        <ActionCard icon="≡" title="Attendance Records" desc="View, filter and search all records"          to="/admin/attendance"  color="var(--yellow)"/>
        <ActionCard icon="↗" title="Reports"            desc="Charts, trends and export to CSV"             to="/admin/reports"     color="var(--green)" />
      </div>
    </Layout>
  );
}

function StatCard({ icon, label, value, accent }) {
  return (
    <div style={{
      background: 'var(--bg2)',
      border: `1px solid ${accent ? 'rgba(63,185,80,0.3)' : 'var(--border)'}`,
      borderRadius: 'var(--radius2)',
      padding: '20px 22px',
      transition: 'border-color 0.2s',
    }}>
      <div style={{ fontSize: 20, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 30, fontWeight: 700, color: accent ? 'var(--green)' : 'var(--text)' }}>
        {value}
      </div>
    </div>
  );
}

function ActionCard({ icon, title, desc, to, color }) {
  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'var(--bg2)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius2)',
        padding: '20px 22px',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = color;
          e.currentTarget.style.background = 'var(--bg3)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.background = 'var(--bg2)';
        }}
      >
        <div style={{ fontSize: 22, marginBottom: 10, color }}>{icon}</div>
        <div style={{ fontWeight: 600, marginBottom: 5 }}>{title}</div>
        <div style={{ fontSize: 13, color: 'var(--text2)' }}>{desc}</div>
      </div>
    </Link>
  );
}