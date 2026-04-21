import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import MarkAttendance from './pages/MarkAttendance';
import Enroll from './pages/Enroll';
import Reports from './pages/Reports';
import StudentDashboard from './pages/StudentDashboard';

function Guard({ children, role }) {
  const token = sessionStorage.getItem('token');
  const r = sessionStorage.getItem('role');
  if (!token) return <Navigate to="/login" />;
  if (role && r !== role) return <Navigate to="/login" />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Guard role="admin"><AdminDashboard /></Guard>} />
        <Route path="/admin/mark" element={<Guard role="admin"><MarkAttendance /></Guard>} />
        <Route path="/admin/enroll" element={<Guard role="admin"><Enroll /></Guard>} />
        <Route path="/admin/reports" element={<Guard role="admin"><Reports /></Guard>} />
        <Route path="/student" element={<Guard role="student"><StudentDashboard /></Guard>} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}