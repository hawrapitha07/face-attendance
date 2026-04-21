import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8000' });

api.interceptors.request.use(cfg => {
  const token = sessionStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export const login = (u, p) =>
  api.post('/auth/login', { username: u, password: p });
export const getStudents = () => api.get('/students');
export const enrollStudent = (fd) => api.post('/students/enroll', fd);
export const uploadGroupPhoto = (fd) => api.post('/attendance/upload', fd);
export const getAttendance = (p) => api.get('/attendance', { params: p });
export const getStudentAttendance = (id) => api.get(`/attendance/${id}`);
export const getSummary = () => api.get('/reports/summary');
export const exportCSV = () =>
  api.get('/reports/export', { responseType: 'blob' });

// src/api/index.js — MOCK VERSION (no backend needed)

// const delay = (ms = 500) => new Promise(res => setTimeout(res, ms));

// // --- AUTH ---
// export const login = async (username, password) => {
//   await delay();
//   if (username === 'admin' && password === 'admin123') {
//     return { data: { access_token: 'fake-token', role: 'admin', student_id: null } };
//   }
//   if (username === 'student' && password === 'student123') {
//     return { data: { access_token: 'fake-token', role: 'student', student_id: '2023CS001' } };
//   }
//   throw new Error('Invalid credentials');
// };

// // --- STUDENTS ---
// export const getStudents = async () => {
//   await delay();
//   return { data: [
//     { id: 1, student_id: '2023CS001', name: 'Ravi Sharma', branch: 'CS', year: 2 },
//     { id: 2, student_id: '2023CS002', name: 'Priya Patel', branch: 'CS', year: 2 },
//     { id: 3, student_id: '2023EC001', name: 'Amit Singh', branch: 'EC', year: 3 },
//     { id: 4, student_id: '2023ME001', name: 'Neha Gupta', branch: 'ME', year: 1 },
//   ]};
// };

// export const enrollStudent = async (formData) => {
//   await delay(1200);
//   console.log('Enrolling student:', Object.fromEntries(formData));
//   return { data: { success: true } };
// };

// export const deleteStudent = async (id) => {
//   await delay();
//   return { data: { success: true } };
// };

// // --- ATTENDANCE ---
// export const uploadGroupPhoto = async (formData) => {
//   await delay(2000); // simulate face detection delay
//   return { data: {
//     session: new Date().toISOString().split('T')[0],
//     detected: [
//       { student_id: '2023CS001', name: 'Ravi Sharma',  confidence: 0.32 },
//       { student_id: '2023CS002', name: 'Priya Patel',  confidence: 0.41 },
//       { student_id: '2023EC001', name: 'Amit Singh',   confidence: 0.38 },
//     ],
//     absent: ['2023ME001'],
//     annotated_image: null  // no annotated image in mock
//   }};
// };

// export const getAttendance = async (params) => {
//   await delay();
//   return { data: [
//     { id: 1, student_id: '2023CS001', name: 'Ravi Sharma',  session: '2024-01-10', status: 'Present', confidence: 0.32, marked_at: '2024-01-10T09:05:00' },
//     { id: 2, student_id: '2023CS002', name: 'Priya Patel',  session: '2024-01-10', status: 'Present', confidence: 0.41, marked_at: '2024-01-10T09:05:00' },
//     { id: 3, student_id: '2023ME001', name: 'Neha Gupta',   session: '2024-01-10', status: 'Absent',  confidence: null, marked_at: '2024-01-10T09:05:00' },
//     { id: 4, student_id: '2023CS001', name: 'Ravi Sharma',  session: '2024-01-15', status: 'Present', confidence: 0.29, marked_at: '2024-01-15T09:10:00' },
//     { id: 5, student_id: '2023CS002', name: 'Priya Patel',  session: '2024-01-15', status: 'Absent',  confidence: null, marked_at: '2024-01-15T09:10:00' },
//     { id: 6, student_id: '2023EC001', name: 'Amit Singh',   session: '2024-01-15', status: 'Present', confidence: 0.44, marked_at: '2024-01-15T09:10:00' },
//   ]};
// };

// export const getStudentAttendance = async (id) => {
//   await delay();
//   return { data: {
//     student_id: '2023CS001',
//     name: 'Ravi Sharma',
//     branch: 'CS',
//     year: 2,
//     present: 8,
//     total: 10,
//     trend: [
//       { date: '2024-01-10', status: 1 },
//       { date: '2024-01-12', status: 1 },
//       { date: '2024-01-15', status: 0 },
//       { date: '2024-01-17', status: 1 },
//       { date: '2024-01-19', status: 1 },
//       { date: '2024-01-22', status: 1 },
//       { date: '2024-01-24', status: 0 },
//       { date: '2024-01-26', status: 1 },
//       { date: '2024-01-29', status: 1 },
//       { date: '2024-01-31', status: 1 },
//     ],
//     sessions: [
//       { session: '2024-01-10', status: 'Present' },
//       { session: '2024-01-12', status: 'Present' },
//       { session: '2024-01-15', status: 'Absent'  },
//       { session: '2024-01-17', status: 'Present' },
//       { session: '2024-01-19', status: 'Present' },
//       { session: '2024-01-22', status: 'Present' },
//       { session: '2024-01-24', status: 'Absent'  },
//       { session: '2024-01-26', status: 'Present' },
//       { session: '2024-01-29', status: 'Present' },
//       { session: '2024-01-31', status: 'Present' },
//     ]
//   }};
// };

// // --- REPORTS ---
// export const getSummary = async () => {
//   await delay();
//   return { data: {
//     total_students: 4,
//     total_sessions: 10,
//     today_pct: 75,
//     overall_pct: 78,
//     below_75: 1,
//     per_student: [
//       { name: 'Ravi Sharma',  student_id: '2023CS001', percentage: 80 },
//       { name: 'Priya Patel',  student_id: '2023CS002', percentage: 60 },
//       { name: 'Amit Singh',   student_id: '2023EC001', percentage: 90 },
//       { name: 'Neha Gupta',   student_id: '2023ME001', percentage: 70 },
//     ],
//     trend: [
//       { date: '2024-01-10', present_pct: 75 },
//       { date: '2024-01-12', present_pct: 80 },
//       { date: '2024-01-15', present_pct: 65 },
//       { date: '2024-01-17', present_pct: 85 },
//       { date: '2024-01-19', present_pct: 90 },
//       { date: '2024-01-22', present_pct: 70 },
//       { date: '2024-01-24', present_pct: 75 },
//       { date: '2024-01-26', present_pct: 80 },
//     ]
//   }};
// };

// export const getStudentReport = async (id) => {
//   await delay();
//   return { data: { percentage: 80, trend: [] } };
// };

// export const exportCSV = async () => {
//   await delay();
//   const csv = `student_id,name,session,status\n2023CS001,Ravi Sharma,2024-01-10,Present\n2023CS002,Priya Patel,2024-01-10,Present`;
//   const blob = new Blob([csv], { type: 'text/csv' });
//   return { data: blob };
// };