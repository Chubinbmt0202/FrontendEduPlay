// src/App.jsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import './App.css';

// Import các trang của bạn
import TeacherDashboard from './page/Teacher/TeacherDashboard';
import StudentWorkspace from './page/Student/StudentWorkspace';

const { Header } = Layout;

function App() {

  return (
    <Layout>
      < Routes >
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/student" element={<StudentWorkspace />} />

        {/* Route mặc định: Tự động chuyển đến trang giáo viên */}
        <Route path="*" element={<Navigate to="/teacher" replace />} />
      </Routes>
    </Layout >
  );
}

export default App;