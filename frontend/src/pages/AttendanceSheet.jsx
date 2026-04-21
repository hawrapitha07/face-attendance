import { useEffect, useState } from 'react';
import { getAttendance, exportCSV } from '../api';
import Layout from '../components/Layout';

export default function AttendanceSheet() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ branch:'', year:'', from:'', to:'' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.branch) params.branch = filters.branch;
      if (filters.year)   params.year   = filters.year;
      if (filters.from)   params.from   = filters.from;
      if (filters.to)     params.to     = filters.to;
      const { data } = await getAttendance(params);
      setRecords(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleExport = async () => {
    const { data } = await exportCSV();
    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url; a.download = 'attendance.csv'; a.click();
  };

  const present = records.filter(r => r.status === 'Present').length;
  const absent  = records.filter(r => r.status === 'Absent').length;

  return (
    <Layout>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom: 28 }}>
        <div>
          <h2>Attendance Records</h2>
          <p style={{ color: 'var(--text2)', marginTop: 4 }}>
            {records.length} records · {present} present · {absent} absent
          </p>
        </div>
        <button onClick={handleExport} className="ghost">↓ Export CSV</button>
      </div>

      {/* Filters */}
      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius2)', padding: '16px 20px',
        display: 'flex', gap: 12, flexWrap: 'wrap',
        alignItems: 'flex-end', marginBottom: 20,
      }}>
        <div style={{ flex: 1, minWidth: 120 }}>
          <label style={lbl}>Branch</label>
          <input placeholder="CS, EC, ME..." value={filters.branch}
            onChange={e => setFilters({...filters, branch: e.target.value})} />
        </div>
        <div style={{ width: 130 }}>
          <label style={lbl}>Year</label>
          <select value={filters.year} onChange={e => setFilters({...filters, year: e.target.value})}>
            <option value="">All years</option>
            <option value="1">Year 1</option>
            <option value="2">Year 2</option>
            <option value="3">Year 3</option>
            <option value="4">Year 4</option>
          </select>
        </div>
        <div style={{ width: 160 }}>
          <label style={lbl}>From</label>
          <input type="date" value={filters.from}
            onChange={e => setFilters({...filters, from: e.target.value})} />
        </div>
        <div style={{ width: 160 }}>
          <label style={lbl}>To</label>
          <input type="date" value={filters.to}
            onChange={e => setFilters({...filters, to: e.target.value})} />
        </div>
        <button onClick={fetchData} style={{ marginBottom: 0 }}>Apply</button>
      </div>

      {/* Table */}
      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius2)', overflow: 'hidden',
      }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text2)' }}>
            Loading records...
          </div>
        ) : records.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text2)' }}>
            No records found
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>ID</th>
                  <th>Session</th>
                  <th>Status</th>
                  <th>Confidence</th>
                  <th>Marked At</th>
                </tr>
              </thead>
              <tbody>
                {records.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 500 }}>{r.name}</td>
                    <td style={{ color: 'var(--text2)', fontFamily: 'monospace', fontSize: 13 }}>{r.student_id}</td>
                    <td style={{ color: 'var(--text2)' }}>{r.session}</td>
                    <td>
                      <span style={{
                        padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500,
                        background: r.status === 'Present' ? 'rgba(63,185,80,0.15)' : 'rgba(248,81,73,0.15)',
                        color: r.status === 'Present' ? 'var(--green)' : 'var(--red)',
                      }}>
                        {r.status}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text2)', fontSize: 13 }}>
                      {r.confidence != null ? r.confidence.toFixed(3) : '—'}
                    </td>
                    <td style={{ color: 'var(--text3)', fontSize: 13 }}>
                      {new Date(r.marked_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}

const lbl = { display: 'block', fontSize: 12, color: 'var(--text2)', marginBottom: 6 };