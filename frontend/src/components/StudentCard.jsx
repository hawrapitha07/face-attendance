export default function StudentCard({ student, onDelete }) {
  return (
    <div style={{
      background: 'var(--bg2)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius2)',
      padding: '16px 18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      transition: 'border-color 0.2s',
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border2)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      {/* Avatar + info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 40, height: 40,
          borderRadius: '50%',
          background: 'var(--greenglow)',
          border: '1px solid var(--green)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16, fontWeight: 700,
          color: 'var(--green)',
          flexShrink: 0,
        }}>
          {student.name?.charAt(0).toUpperCase()}
        </div>

        <div>
          <div style={{ fontWeight: 600, marginBottom: 3 }}>
            {student.name}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text2)', display: 'flex', gap: 10 }}>
            <span style={{
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              borderRadius: 4,
              padding: '1px 7px',
              fontFamily: 'monospace',
            }}>
              {student.student_id}
            </span>
            <span>{student.branch}</span>
            <span>Year {student.year}</span>
          </div>
        </div>
      </div>

      {/* Delete button — only shown if handler provided */}
      {onDelete && (
        <button
          className="danger"
          onClick={() => onDelete(student.id)}
          style={{ padding: '5px 12px', fontSize: 12 }}
        >
          Remove
        </button>
      )}
    </div>
  );
}
