// src/App.jsx

import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { useLocation } from 'react-router-dom';
import './App.css';
import ReactGA from 'react-ga4';

// Import các trang của bạn
import TeacherDashboard from './page/Teacher/TeacherDashboard';
import StudentWorkspace from './page/Student/StudentWorkspace';

const TRACKING_ID = "G-BYBSLN2K1M"; // Thay thế bằng Mã GA4 của bạn
ReactGA.initialize(TRACKING_ID);

const TrackingComponent = () => {
  const location = useLocation();

  useEffect(() => {
    // Gửi sự kiện Page View đến GA4 mỗi khi location (URL) thay đổi
    ReactGA.send({
      hitType: "pageview",
      page: location.pathname + location.search
    });
  }, [location]);

  return null; // Component này không hiển thị gì, chỉ dùng để theo dõi
};

const { Header } = Layout;

function App() {

  return (
    <Layout>
      <TrackingComponent />
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