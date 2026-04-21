import { Link, useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { path: '/admin',            icon: '⬡', label: 'Dashboard'   },
  { path: '/admin/mark',       icon: '◎', label: 'Attendance'  },
  { path: '/admin/enroll',     icon: '＋', label: 'Enroll'      },
  { path: '/admin/attendance', icon: '≡', label: 'Records'     },
  { path: '/admin/reports',    icon: '↗', label: 'Reports'     },
];

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

      {/* Sidebar */}
      <aside style={{
        width: 220,
        background: 'var(--bg2)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{
          padding: '20px 20px 16px',
          borderBottom: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32,
              background: 'var(--greenglow)',
              border: '1px solid var(--green)',
              borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16,
            }}>◈</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>AttendAI</div>
              <div style={{ fontSize: 11, color: 'var(--text3)' }}>Admin Panel</div>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '12px 10px' }}>
          {navItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '9px 12px',
                  borderRadius: 'var(--radius)',
                  marginBottom: 2,
                  color: active ? 'var(--green)' : 'var(--text2)',
                  background: active ? 'var(--greenglow)' : 'transparent',
                  border: active ? '1px solid rgba(63,185,80,0.2)' : '1px solid transparent',
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: active ? 600 : 400,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--bg3)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                {item.label}
                {active && (
                  <span style={{
                    marginLeft: 'auto', width: 6, height: 6,
                    borderRadius: '50%', background: 'var(--green)',
                  }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: '12px 10px', borderTop: '1px solid var(--border)' }}>
          <button
            className="ghost"
            onClick={logout}
            style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <span>⏻</span> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{
        flex: 1,
        overflowY: 'auto',
        background: 'var(--bg)',
        padding: 32,
      }}
        className="fade-in"
      >
        {children}
      </main>
    </div>
  );
}