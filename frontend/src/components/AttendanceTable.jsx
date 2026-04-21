export default function AttendanceTable({ records }) {
  if (!records || records.length === 0) {
    return (
      <div style={{
        padding: 40, textAlign: 'center',
        color: 'var(--text2)', fontSize: 14,
      }}>
        No records to display
      </div>
    );
  }

  return (
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
          {records.map((r, i) => (
            <tr key={r.id ?? i}>
              <td style={{ fontWeight: 500 }}>{r.name}</td>
              <td style={{
                color: 'var(--text2)',
                fontFamily: 'monospace',
                fontSize: 13,
              }}>
                {r.student_id}
              </td>
              <td style={{ color: 'var(--text2)' }}>{r.session}</td>
              <td>
                <StatusBadge status={r.status} />
              </td>
              <td style={{ color: 'var(--text2)', fontSize: 13 }}>
                {r.confidence != null ? r.confidence.toFixed(3) : '—'}
              </td>
              <td style={{ color: 'var(--text3)', fontSize: 13 }}>
                {r.marked_at ? new Date(r.marked_at).toLocaleString() : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function StatusBadge({ status }) {
  const isPresent = status === 'Present';
  return (
    <span style={{
      padding: '3px 10px',
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 500,
      background: isPresent
        ? 'rgba(63,185,80,0.15)'
        : 'rgba(248,81,73,0.15)',
      color: isPresent ? 'var(--green)' : 'var(--red)',
    }}>
      {status}
    </span>
  );
}
